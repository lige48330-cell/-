# 个人公开工程

这里按“招聘者能核验什么”分层，而不是按项目数量堆目录。公司 ERP、养殖场 IoT 平台、ESP32 固件和公司小程序不在此目录。

## 第一证据：可运行的 Agent / 全栈闭环

| 工程 | 重点能力 | 入口 |
| --- | --- | --- |
| **TraceRAG Agent** | Python API、知识摄取、检索、路由、人工闸门、引用回答、trace / handoff | [运行浏览器 Demo](trace-rag-agent/demo.html) · [阅读源码](trace-rag-agent/) |
| **CodexCont** | Python、Starlette、SSE 流式中间件、鉴权边界、离线 fixture 测试 | [查看源码](codexcont/) |

## 第二证据：Agent 工程方法与上下文契约

| 工程 | 重点能力 | 入口 |
| --- | --- | --- |
| **Stable-First AI Workflow** | 需求结构化、上下文准备、质量闸门、验收与交接 | [查看源码](stable-first-ai-workflow/) |
| **Code Control Stack** | 工具注册、上下文契约、路由边界、反馈与权限说明 | [查看源码](code-control-stack/) |

## 第三证据：业务迁移与全栈原型

| 工程 | 重点能力 | 入口 |
| --- | --- | --- |
| **Digital Aquaculture Prototype** | Vue 3、TypeScript、Pinia、复杂业务状态与数据工作台 | [查看源码](digital-aquaculture-prototype/) |

TraceRAG 的设计依据与边界记录见 [一手资料研究](../docs/trace-rag-primary-research.md)。

工业监控与开发者服务小程序仍保留在 [补充原型档案](../#project-radar)，用于证明信息架构和跨端学习能力，不作为 AI Agent 主证据。

## 发布边界

- 示例数据和图片均为 mock 或泛化内容。
- 本目录不包含账号、密码、token、API key、真实设备数据或客户资料。
- CodexCont 的本机配置、缓存和原始流量 fixture 由忽略规则排除。
- TraceRAG 的知识库是泛化运维样例；动作请求默认停在人工作用闸门，不会连接或改变真实设备。
