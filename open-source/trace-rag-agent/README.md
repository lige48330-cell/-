# TraceRAG Agent

一个面向业务现场的可核验 RAG Agent 全栈原型：把知识摄取、检索、路由、人工确认和交接记录放进同一条可观察链路。

> 这是个人公开实验工程。知识库只使用泛化的设备运维样例，不包含公司项目、客户数据、账号或真实凭据。

## 为什么做它

很多 Agent demo 只有一个聊天框，面试时很难回答“它为什么这样回答、什么时候应该停下来、下一位同事如何接手”。TraceRAG 把这些边界显式化：

```text
现场问题
  -> 业务模型
  -> 文档摄取 / 分块
  -> 轻量检索
  -> Agent 路由
  -> 工具或人工闸门
  -> 带引用回答
  -> 评测 / trace / handoff
```

## 可运行入口

- [浏览器演示](demo.html)：无需安装，直接体验检索、低置信度人工接管和变更确认。
- `python run.py`：启动标准库 HTTP API，默认监听 `127.0.0.1:8788`。
- `python -m unittest discover -s tests -v`：运行离线测试（当前 7 个用例）。

## API

| 方法 | 路径 | 作用 |
| --- | --- | --- |
| `GET` | `/api/health` | 返回索引文档数和服务状态 |
| `POST` | `/api/query` | `{ "query": "设备离线怎么处理" }`，返回 answer、citations、trace |
| `POST` | `/api/ingest` | 接收 `{ "documents": [{"id","title","content","tags":[]}] }` |

查询响应的关键字段：

```json
{
  "route": "knowledge_retrieval",
  "answer": "...",
  "confidence": 0.82,
  "citations": ["ops-001"],
  "needs_human": false,
  "trace": [
    {"stage":"route","label":"选择检索路径","status":"ok"},
    {"stage":"grounding","label":"引用与置信度检查","status":"ok"},
    {"stage":"handoff","label":"生成交接摘要","status":"ok"}
  ]
}
```

## 技术选择

- Python 标准库 `http.server`：保持 demo 可复制、可离线运行；HTTP 层与 Agent 核心分离。
- SQLite 不是必需依赖：当前版本用确定性的内存倒排索引证明检索与路由契约，便于阅读和测试。
- 浏览器 demo 复刻同一规则，方便招聘者在 GitHub Pages 上直接点击；它明确标注为静态演示，不冒充线上服务。

## 关键工程决策

1. **先检索再生成**：回答必须绑定命中的文档 ID；没有足够证据就进入人工确认。
2. **变更默认停在人工闸门**：包含“下发、修改、删除、重启”等动作的请求不会被 demo 静默执行。
3. **trace 是一等输出**：每一步记录输入、路由、命中、置信度和 handoff，便于复盘与交接。
4. **动作只生成计划**：即使 API 收到 `approved=true`，当前版本也只返回可审查的 mock 动作计划，不执行外部副作用。
5. **可替换边界**：`KnowledgeBase`、`AgentRuntime` 与 HTTP handler 分开，后续可替换为向量库或真实模型而不改变 API 契约。

## 限制与下一步

- 当前检索是词项匹配，不是生产级向量检索；目的是先证明可观察的业务闭环。
- 当前回答模板是确定性的，不调用外部模型，也不保存用户输入。
- 下一步可以接入 embedding / reranker、真实工具适配器和离线 eval 集，但仍需保留引用、人工闸门和审计 trace。

## 证据等级

`公开原创原型 · 可运行 demo · 标准库 API · 离线测试 · 无真实业务数据`

## License

MIT
