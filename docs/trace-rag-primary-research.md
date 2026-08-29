# TraceRAG Agent 一手资料研究记录

日期：2026-08-30

这份记录只使用官方文档、官方 SDK 源码、官方示例和公开规范作为依据。链接尽量固定到提交快照，避免网页后续更新改变证据。研究对象是公开的 `open-source/trace-rag-agent` 原型；不读取、不复制公司项目、账号、凭据或本机敏感资料。

## 研究结论

1. RAG 不是一个聊天框，而是一条可分段验证的链路：资料摄取与分块、索引/检索、证据绑定、回答生成、失败处理和评测。OpenAI 的检索资料明确区分关键词/API 检索、关系库查询和向量语义检索；向量检索还需要把文本查询转换为 embedding，并考虑原文权限边界。[S1]
2. 工具调用的责任边界在应用侧。模型提出工具名和参数，应用校验授权、执行工具，再把带有调用 ID 的结果回传给模型；“模型看得到工具”不等于“模型被授权执行工具”。[S3][S4][S9]
3. 有副作用的工具应有可见、可拒绝的人工闸门。OpenAI Agents SDK 将批准建模为 interruption，并支持把暂停状态序列化后恢复；MCP 规范也要求实现保留用户拒绝工具调用的能力。[S5][S10]
4. Trace 应记录工作流而不只是最终文本。官方 SDK 和 OpenTelemetry GenAI 规范都把 Agent、检索、工具执行拆成可关联的 trace/span，并建议记录操作名、数据源、文档 ID/分数、工具名/调用 ID/错误；查询、参数和结果可能含敏感信息，必须按需记录和脱敏。[S6][S11]
5. 评测应分离检索质量和端到端回答质量，并形成“分析失败样本 -> 建立基线 -> 定向改进”的循环。官方示例使用独立的数据集、期望值和 grader，而不是只看一条 happy-path 截图。[S7][S8]

## 一手来源与可复核事实

### S1. OpenAI Cookbook：数据检索

- 快照：2024-07-25，提交 `5f552669f7d3f0af8bb34690c305d06600808753`。
- 来源：[data-retrieval.txt（OpenAI Cookbook）](https://github.com/openai/openai-cookbook/blob/5f552669f7d3f0af8bb34690c305d06600808753/examples/data/oai_docs/data-retrieval.txt)
- 事实：官方示例把检索分成 API 搜索/获取、关系数据库查询和向量数据库语义检索；向量数据库通常接收 embedding，网关可以负责把纯文本查询转换为向量；原始文档权限在切成文本块后仍需单独设计。
- 对 TraceRAG 的启发：把 `ingest -> chunk -> search -> answer` 拆成可替换接口；在作品集里明确当前检索是离线词项基线，不把它包装成生产级语义检索。

### S2. OpenAI Cookbook：File Search 的摄取和混合检索

- 快照：2024-07-25，提交 `5f552669f7d3f0af8bb34690c305d06600808753`。
- 来源：[tool-file-search.txt（OpenAI Cookbook）](https://github.com/openai/openai-cookbook/blob/5f552669f7d3f0af8bb34690c305d06600808753/examples/data/oai_docs/tool-file-search.txt)
- 事实：官方 File Search 示例说明，文件会被解析、分块并建立 embeddings，检索同时使用向量搜索和关键词搜索；文件处理完成前需要等待状态结束；启用工具后，模型根据用户消息决定是否检索。
- 对 TraceRAG 的启发：未来接入 embedding/reranker 时，需要保留摄取状态、索引版本和检索候选，而不是只替换一个 `search()` 函数。
- 边界：该文件是 Assistants API 时代的官方 Cookbook 快照，本文只引用其检索分层原则，不据此声称当前线上 API 细节。

### S3. OpenAI Cookbook：Function Calling 协议

- 快照：2024-07-25，提交 `5f552669f7d3f0af8bb34690c305d06600808753`。
- 来源：[tool-function-calling.txt（OpenAI Cookbook）](https://github.com/openai/openai-cookbook/blob/5f552669f7d3f0af8bb34690c305d06600808753/examples/data/oai_docs/tool-function-calling.txt)
- 事实：工具定义包含函数名、描述和参数 schema；模型提出调用后，运行会进入 `requires_action`，应用执行工具并按 `tool_call_id` 提交结果，之后模型才继续生成。
- 对 TraceRAG 的启发：`controlled_action` 必须有结构化输入、调用 ID、执行结果和错误状态；当前原型只生成 mock 计划，尚未接真实模型或执行器。

### S4. OpenAI Agents SDK：工具可见性不是授权

- 快照：2026-08-25，提交 `48c2ee40a41610ad92b20ba0ce77a3587f127cd8`。
- 来源：[tools.md（OpenAI Agents SDK）](https://github.com/openai/openai-agents-python/blob/48c2ee40a41610ad92b20ba0ce77a3587f127cd8/docs/tools.md)
- 事实：SDK 文档明确指出 `is_enabled` 只控制工具是否可见/可调度，不能替代依赖参数或资源的授权检查；授权应在工具实现内部强制，或使用工具输入 guardrail 与 approval；受保护的 MCP 操作仍由 MCP server 自己授权。
- 对 TraceRAG 的启发：不能把前端的 `approved` 布尔值当作权限系统。真实接入时应在服务端校验用户、资源、参数、幂等键和回滚策略，并把拒绝原因写入 trace。

### S5. OpenAI Agents SDK：Human-in-the-loop 与可恢复状态

- 快照：2026-08-11，提交 `80e1baaefdfff291b3d7e55987219107c9736d80`。
- 来源：[human_in_the_loop.md（OpenAI Agents SDK）](https://github.com/openai/openai-agents-python/blob/80e1baaefdfff291b3d7e55987219107c9736d80/docs/human_in_the_loop.md)
- 事实：工具可以用 `needs_approval` 标记为必须批准；运行结果以 interruption 暴露待处理批准；`RunState` 可以序列化暂停运行并在决定后恢复。可调用的批准规则在参数 malformed 或无法安全检查时 fail closed，转人工批准。
- 对 TraceRAG 的启发：当前同步 `approved` 参数只演示闸门，不等于可恢复的人审工作流；下一步应增加 `approval_id`、pending 状态、过期时间、拒绝理由和持久化 resume 测试。

### S6. OpenAI Agents SDK：Trace / Span

- 快照：2026-08-24，提交 `6268f43e3aaf3d9ba193bff267345a8dc62f4223`。
- 来源：[tracing.md（OpenAI Agents SDK）](https://github.com/openai/openai-agents-python/blob/6268f43e3aaf3d9ba193bff267345a8dc62f4223/docs/tracing.md)
- 事实：SDK 内置 trace 会收集 Agent 运行中的模型生成、工具调用、handoff、guardrail 和自定义事件；Trace 表示端到端工作流，Span 记录开始/结束时间、父子关系和 span data。生成和函数调用 span 可能包含敏感输入/输出，文档提供关闭敏感数据采集的配置。
- 对 TraceRAG 的启发：当前 `trace` 已是 API 一等输出，但只有 `stage/label/detail/status`，没有 `trace_id`、时间戳、父子关系、错误类型或持久化导出；这些是“可观察原型”和“可运营系统”的明确分界。

### S7. OpenAI Cookbook：Evaluation Flywheel

- 快照：2025-10-07，提交 `2ce7c32a253a0540c9bd65d7c84c773e16e1eead`。
- 来源：[Building_resilient_prompts_using_an_evaluation_flywheel.md（OpenAI Cookbook）](https://github.com/openai/openai-cookbook/blob/2ce7c32a253a0540c9bd65d7c84c773e16e1eead/examples/evaluation/Building_resilient_prompts_using_an_evaluation_flywheel.md)
- 事实：官方方法分为 Analyze、Measure、Improve：先人工检查失败 trace 并标注失败模式，再用测试数据集和 grader 建立基线，最后针对失败模式迭代并重复测量。
- 对 TraceRAG 的启发：7 个离线单元测试证明契约，但还不是检索指标或回答质量评测；下一步应把 query、期望文档、期望路由、是否需要人工和答案约束放进可重复数据集。

### S8. Anthropic Cookbook：检索评测与端到端评测分离

- 快照：2025-10-14，提交 `ed9b068f77bcd4d663bfc2bc564ad132c7b7d85d`。
- 来源：[RAG evaluation README（Anthropic Cookbook）](https://github.com/anthropics/anthropic-cookbook/blob/ed9b068f77bcd4d663bfc2bc564ad132c7b7d85d/capabilities/retrieval_augmented_generation/evaluation/README.md)
- 事实：官方示例用独立配置和数据集分别评估 retrieval 与 end-to-end；数据行包含 `__expected` 作为自动断言输入，并把评测输出保存为可查看结果。
- 对 TraceRAG 的启发：应分别回答“检索命中了正确证据吗”和“最终回答是否满足业务约束”，不能用单一回答分数替代两者。

### S9. Anthropic SDK 官方工具调用示例

- 快照：2026-06-30，提交 `ab10964f48c54c691e96f29f03dd7c600452c817`。
- 来源：[examples/tools.py（Anthropic SDK for Python）](https://github.com/anthropics/anthropic-sdk-python/blob/ab10964f48c54c691e96f29f03dd7c600452c817/examples/tools.py)
- 事实：工具定义使用 `name`、`description` 和 `input_schema`；模型返回 `stop_reason == "tool_use"` 与 `tool_use` 块；应用执行后用相同的 `tool_use_id` 发送 `tool_result`，再请求最终响应。
- 对 TraceRAG 的启发：跨模型适配层应把“提出调用、人工批准、执行、回传结果”建模为状态机，而不是把工具执行隐藏在回答字符串里。

### S10. MCP 规范：工具发现、调用和用户拒绝权

- 规范版本：`2025-11-25`，访问日期：2026-08-30。
- 来源：[MCP Server Tools](https://modelcontextprotocol.io/specification/2025-11-25/server/tools)
- 事实：MCP 工具通过 `tools/list` 暴露名称、描述和 `inputSchema`，通过 `tools/call` 调用并返回结构化结果；规范说明工具通常由模型控制，但出于信任与安全，实现应始终保留能拒绝调用的人工环节，并在 UI 中清楚显示暴露的工具、调用状态和确认提示。
- 对 TraceRAG 的启发：当前原型没有 MCP server/client；它只提前演示同一条安全原则：变更类请求先停在人工闸门，批准后也只生成 mock 计划。

### S11. OpenTelemetry GenAI Semantic Conventions

- 快照：2026-08-20，提交 `8a3767d6c5d09bc0917722720973c0c44182d960`。
- 来源：[GenAI spans](https://github.com/open-telemetry/semantic-conventions-genai/blob/8a3767d6c5d09bc0917722720973c0c44182d960/docs/gen-ai/gen-ai-spans.md) · [Agent spans](https://github.com/open-telemetry/semantic-conventions-genai/blob/8a3767d6c5d09bc0917722720973c0c44182d960/docs/gen-ai/gen-ai-agent-spans.md) · [MCP spans](https://github.com/open-telemetry/semantic-conventions-genai/blob/8a3767d6c5d09bc0917722720973c0c44182d960/docs/gen-ai/mcp.md)
- 事实：检索操作建议使用 `gen_ai.operation.name=retrieval`，并在可用时记录数据源 ID、`top_k`、文档 ID/score 和查询文本；工具执行建议使用 `execute_tool` span，记录工具名、调用 ID、工具类型、参数、结果和错误；Agent span 还应能表达工作流/Agent 标识。规范警告查询、工具参数和结果可能是敏感信息。
- 对 TraceRAG 的启发：当前 trace 字段已经有 `retrieval`、`tool_preview`、`handoff` 等阶段名，方向一致；但应在后续版本补稳定的 `trace_id`、事件时间、候选文档分数、错误类型和脱敏策略，并避免把原始用户输入无条件写入遥测。

## TraceRAG 当前实现对照

以下状态均以仓库当前代码为准，而不是根据规划文案推断：

| 能力层 | 当前已实现 | 当前未实现或仅模拟 | 可核对位置 |
| --- | --- | --- | --- |
| 摄取与分块 | JSON 知识库摄取；按段落切分并保留 overlap；校验 `id/title/content` | 无文件处理队列、索引版本、embedding 或向量存储 | [`core.py`](../open-source/trace-rag-agent/rag_agent/core.py#L27) [`core.py`](../open-source/trace-rag-agent/rag_agent/core.py#L84) |
| 检索 | 确定性中文 bigram + ASCII token；TF/IDF 风格排序；返回 excerpt、score、matched terms | 不是 embedding 语义检索；无 reranker、权限过滤或离线召回指标 | [`core.py`](../open-source/trace-rag-agent/rag_agent/core.py#L98) |
| Agent 路由 | 空输入澄清；知识检索路由；动作词路由；置信度闸门 | 无真实 LLM planner、意图分类模型或多工具选择 | [`core.py`](../open-source/trace-rag-agent/rag_agent/core.py#L158) |
| 工具边界 | 变更请求默认 hold；批准后生成可审查 mock plan；明确不触碰外部系统 | `approved` 不是身份/资源授权；无 schema、幂等、回滚执行器 | [`core.py`](../open-source/trace-rag-agent/rag_agent/core.py#L170) [`README.md`](../open-source/trace-rag-agent/README.md#L61) |
| 人工接管 | 低证据和变更请求返回 `needs_human=true`，trace 标记 `hold` | 无 approval 记录、持久化 pending、拒绝理由和 resume | [`core.py`](../open-source/trace-rag-agent/rag_agent/core.py#L173) |
| 证据回答 | 引用前两条文档 ID；证据不足不生成确定回答 | 无生成模型、引用片段校验、答案 grader 或事实一致性检查 | [`core.py`](../open-source/trace-rag-agent/rag_agent/core.py#L186) |
| Trace / handoff | 每次运行返回 input、route、retrieval、grounding、handoff 等结构化事件 | 无稳定 trace ID、时间戳、父子 span、持久化、导出、敏感数据策略 | [`core.py`](../open-source/trace-rag-agent/rag_agent/core.py#L160) [`README.md`](../open-source/trace-rag-agent/README.md#L63) |
| HTTP 全栈闭环 | `health/query/ingest` API；错误 JSON；CORS；标准库可离线运行 | 无认证、限流、数据库持久化、生产部署和真实设备连接 | [`server.py`](../open-source/trace-rag-agent/rag_agent/server.py#L24) |
| 评测 | 7 个 `unittest` 覆盖 token、chunk、grounding、人工闸门和 mock plan | 无独立 retrieval/e2e 数据集、precision/recall/MRR/F1 基线或回归报告 | [`test_core.py`](../open-source/trace-rag-agent/tests/test_core.py#L17) [`README.md`](../open-source/trace-rag-agent/README.md#L22) |
| 浏览器演示 | GitHub Pages 上可点击查询示例并展示 trace、引用和人工接管 | 静态 JS 复制规则，不调用本地 API；不能冒充线上 Agent | [`demo.html`](../open-source/trace-rag-agent/demo.html) [`demo.js`](../open-source/trace-rag-agent/demo.js) |

## 建议的公开技术链表达

作品集可以把 TraceRAG 的链路写成下面这句，且每一段都有代码或测试落点：

```text
业务问题
  -> 资料摄取 / 分块
  -> 检索候选与分数
  -> Agent 路由
  -> 证据闸门
  -> 人工确认（有副作用时）
  -> 引用式回答或 mock 动作计划
  -> trace / handoff
  -> retrieval 与 end-to-end eval
```

其中最后一项目前是“测试契约 + 规划中的评测集”，不应写成已经完成的生产评测平台。更准确的招聘表述是：

> 我先用离线、确定性的检索和路由证明 Agent 的安全边界，再把引用、人工闸门和 trace 设计成 API 契约；下一阶段可替换为 embedding、真实工具适配器和独立评测集，而不改变交接格式。

## 下一轮可验证增量

按风险和证据收益排序：

1. 增加 `trace_id`、事件时间、`parent_id`、`error_type` 和 `schema_version`，并默认只记录脱敏摘要。
2. 增加 `evals/retrieval.jsonl` 与 `evals/end_to_end.jsonl`，输出 Recall@k、MRR、grounding pass rate、人工闸门命中率；先用标准库实现，保持离线可运行。
3. 把人工闸门改成 `approval_id + pending/approved/rejected/expired` 状态机，补恢复和重复提交测试。
4. 为工具预览定义 JSON Schema 和幂等键；真实执行器单独放在受授权的适配层，默认 dry-run。
5. 若接入 embedding 或 MCP，保留当前 `citations`、`trace` 和 handoff 字段，并在 README 中同时展示基线与新检索器的对比结果。

## 公开边界

- 该原型只使用泛化设备运维 mock 文档；不得加入公司 ERP、ESP32 固件、小程序源码、生产配置、客户数据、账号、密码、API Key 或内部地址。
- 公司项目继续以“真实项目界面 · AI 辅助脱敏”展示，TraceRAG 只能作为个人公开原型，不得暗示它是公司系统的源码或线上部署。
- “可运行”在当前版本只指 GitHub Pages 静态演示和本地标准库 API；“生产级向量检索”“真实工具执行”“持久化评测”均属于未实现能力。
