const documents = [
  { id: "ops-001", title: "设备离线排查手册", tags: ["设备", "在线", "网络"], content: "设备离线先确认最近心跳时间，再检查现场电源、网络信号和网关连接。若连续三个心跳周期没有恢复，记录设备编号、发生时间和现场照片，转交值班负责人。恢复后复核在线状态、最近一条事件和控制回执。" },
  { id: "ops-002", title: "消毒任务回执与异常处理", tags: ["消毒", "任务", "回执"], content: "消毒任务应包含目标设备、计划开始时间、持续时长和操作者。管理端先显示待下发状态，设备确认后变为已接收，运行结束后写入完成或失败回执。超过回执窗口时保留任务现场，不重复下发。" },
  { id: "ops-003", title: "运营交接清单", tags: ["交接", "验收", "日志"], content: "交接记录至少包含问题描述、影响范围、当前状态、证据链接、未决风险和下一步负责人。验收不能只看页面截图，应按角色场景复测关键路径。" },
  { id: "ops-004", title: "管理端状态字段契约", tags: ["接口", "状态", "字段"], content: "设备管理端统一使用 device_id、online_state、run_state、last_heartbeat 和 command_ack 字段。online_state 描述连接状态，run_state 描述任务状态，command_ack 描述控制回执，三者不能互相替代。" },
];

const tokenize = (value) => {
  const raw = value.toLowerCase().match(/[a-z0-9_+-]+|[\u4e00-\u9fff]+/g) || [];
  return raw.flatMap((part) => {
    if (/^[a-z0-9_+-]+$/.test(part)) return [part];
    if (part.length <= 2) return [part];
    return Array.from({ length: part.length - 1 }, (_, index) => part.slice(index, index + 2));
  });
};
const queryInput = document.querySelector("#query-input");
const form = document.querySelector("#query-form");
const answerOutput = document.querySelector("#answer-output");
const routeOutput = document.querySelector("#route-output");
const confidenceOutput = document.querySelector("#confidence-output");
const gateOutput = document.querySelector("#gate-output");
const resultState = document.querySelector("#result-state");
const citationOutput = document.querySelector("#citation-output");
const traceList = document.querySelector("#trace-list");
const approveButton = document.querySelector("#approve-button");
const actionWords = ["下发", "修改", "删除", "重启", "开启", "关闭", "执行", "写入"];

function search(query) {
  const terms = [...new Set(tokenize(query))];
  return documents.map((doc) => {
    const tokens = tokenize(`${doc.title} ${doc.content} ${doc.tags.join(" ")}`);
    const matched = terms.filter((term) => tokens.includes(term));
    const score = matched.reduce((sum, term) => sum + tokens.filter((token) => token === term).length, 0) + (matched.some((term) => tokenize(doc.title).includes(term)) ? 1 : 0);
    return { ...doc, matched, score };
  }).filter((doc) => doc.score > 0).sort((a, b) => b.score - a.score).slice(0, 3);
}

function renderTrace(items) {
  traceList.replaceChildren(...items.map((item, index) => {
    const li = document.createElement("li");
    if (item.status === "hold") li.classList.add("hold");
    const stage = document.createElement("span");
    stage.textContent = `${String(index + 1).padStart(2, "0")} / ${item.stage}`;
    const title = document.createElement("strong");
    title.textContent = item.label;
    const detail = document.createElement("p");
    detail.textContent = item.detail;
    li.append(stage, title, detail);
    return li;
  }));
}

function renderResult(query) {
  const trace = [{ stage: "input", label: "接收任务", detail: query || "空输入", status: "ok" }];
  const isAction = actionWords.some((word) => query.includes(word));
  const route = isAction ? "controlled_action" : "knowledge_retrieval";
  trace.push({ stage: "route", label: "选择路由", detail: isAction ? "变更类请求进入人工闸门" : "先检索知识库", status: "ok" });
  if (isAction) {
    trace.push({ stage: "human_gate", label: "等待人工确认", detail: "请求可能改变设备或数据状态", status: "hold" });
    answerOutput.textContent = "这是一个可能改变系统状态的请求。请先确认目标设备、影响范围和回滚方式。";
    setMeta(route, 0, "需要确认", "hold");
    approveButton.hidden = false;
    approveButton.dataset.query = query;
    renderTrace(trace);
    return;
  }
  approveButton.hidden = true;
  const hits = search(query);
  const confidence = hits.length ? Math.min(1, (hits[0].score / Math.max(tokenize(query).length * .9, 1)) * .55 + (hits[0].matched.length / Math.max(new Set(tokenize(query)).size, 1)) * .45) : 0;
  trace.push({ stage: "retrieval", label: "检索知识库", detail: `命中 ${hits.length} 条候选证据`, status: "ok" });
  if (!hits.length || confidence < .35) {
    trace.push({ stage: "grounding", label: "证据不足", detail: "置信度低于闸门，保留候选并请求人工判断", status: "hold" });
    answerOutput.textContent = "当前知识库没有足够证据支持可靠回答，请补充资料或由负责人确认。";
    citationOutput.replaceChildren(...hits.map((hit) => citation(hit)));
    setMeta("clarification", confidence, "需要确认", "hold");
    renderTrace(trace);
    return;
  }
  const citations = hits.slice(0, 2);
  trace.push({ stage: "grounding", label: "引用与置信度检查", detail: `回答绑定 ${citations.map((hit) => hit.id).join(", ")}`, status: "ok" });
  trace.push({ stage: "handoff", label: "生成交接摘要", detail: "保留路由、引用、置信度和下一步", status: "ok" });
  answerOutput.textContent = `围绕“${query}”，优先参考《${hits[0].title}》：${hits[0].content}（引用：${hits[0].id}）。如需改变设备或数据状态，应先走人工确认并记录回滚方案。`;
  citationOutput.replaceChildren(...citations.map((hit) => citation(hit)));
  setMeta(route, confidence, "否", "ok");
  renderTrace(trace);
}

function renderApprovedAction(query) {
  const hits = search(query);
  const lead = hits[0];
  if (!lead) return;
  answerOutput.textContent = `已确认影响范围，生成 mock 动作计划：目标设备、时间窗、回滚方式待授权执行器处理（引用：${lead.id}）。当前 demo 不会触碰外部系统。`;
  citationOutput.replaceChildren(citation(lead));
  setMeta("controlled_action", 0, "已确认", "ok");
  renderTrace([
    { stage: "input", label: "接收任务", detail: query, status: "ok" },
    { stage: "route", label: "选择路由", detail: "变更类请求进入人工闸门", status: "ok" },
    { stage: "human_gate", label: "人工确认已记录", detail: "影响范围与回滚方式已确认", status: "ok" },
    { stage: "tool_preview", label: "生成受控动作预览", detail: "仅生成 mock 计划，不执行外部副作用", status: "ok" },
    { stage: "handoff", label: "生成交接摘要", detail: "把计划、引用和下一步交给授权执行器", status: "ok" },
  ]);
  approveButton.hidden = true;
}

function citation(hit) {
  const item = document.createElement("span");
  item.textContent = `${hit.id} · ${hit.title}`;
  return item;
}

function setMeta(route, confidence, gate, state) {
  routeOutput.textContent = route;
  confidenceOutput.textContent = confidence ? `${Math.round(confidence * 100)}%` : "0%";
  gateOutput.textContent = gate;
  resultState.textContent = state === "hold" ? "人工接管" : "已完成";
  resultState.className = `state-chip state-${state}`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  renderResult(queryInput.value.trim());
});
document.querySelectorAll("[data-query]").forEach((button) => button.addEventListener("click", () => {
  queryInput.value = button.dataset.query;
  renderResult(button.dataset.query);
}));
approveButton.addEventListener("click", () => renderApprovedAction(approveButton.dataset.query || ""));
