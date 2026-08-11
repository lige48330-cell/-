# CodexCont：按代码文件学习（主学习指南扩展）

本目录是 [`../CODEXCONT_LEARNING_GUIDE_zh.md`](../CODEXCONT_LEARNING_GUIDE_zh.md) 的**源码索引式扩展**：主指南负责整体心智模型，本目录负责在你打开某一个 `.py` 文件时，解释它的职责、输入输出、控制流、状态变化、关键不变量及与其它文件的连接。

> 范围：覆盖仓库自有的运行 Python、测试、启动/切换脚本和关键配置/工程文件；`.venv/` 是第三方依赖，不属于本项目源码，故不逐文件讲解。README、许可证、教学记录等说明资料不重复作源码解析。

## 建议顺序

1. 先读主指南的架构和请求生命周期；
2. 依次读 `01-run.md` → `02-app.md` → `03-proxy.md`；
3. 再读支撑模块：`04-sse.md`、`05-codex.md`、`06-creds.md`、`07-config.md`、`08-store.md`；
4. 最后以 `10-test-middleware.md` 对照测试回放每条不变量。

## 文件对照

| 源文件 | 学习文件 | 一句话职责 |
|---|---|---|
| `run.py` | [01-run.md](01-run.md) | 读取配置、建应用、启动 ASGI 服务器。 |
| `middleware/app.py` | [02-app.md](02-app.md) | HTTP 入口、路由、鉴权安全闸门、透传/折叠分流。 |
| `middleware/proxy.py` | [03-proxy.md](03-proxy.md) | 多轮 SSE 折叠状态机，项目核心。 |
| `middleware/sse.py` | [04-sse.md](04-sse.md) | 字节流与 SSE 事件的增量互转。 |
| `middleware/codex.py` | [05-codex.md](05-codex.md) | 截断判定与续写请求的纯函数。 |
| `middleware/creds.py` | [06-creds.md](06-creds.md) | 请求头筛选、鉴权注入与泄漏防线的基础。 |
| `middleware/config.py` | [07-config.md](07-config.md) | TOML 到不可变配置对象。 |
| `middleware/store.py` | [08-store.md](08-store.md) | legacy `tool_pair` 跨轮修复所需的 TTL/LRU ID 集合。 |
| `middleware/__init__.py` | [09-init.md](09-init.md) | 将目录标识为 Python 包；没有运行逻辑。 |
| `tests/test_middleware.py` | [10-test-middleware.md](10-test-middleware.md) | 离线可执行规格，验证关键分支与安全不变量。 |
| `config.toml` | [11-config-local.md](11-config-local.md) | 当前机器实际运行策略（含本地上游选择）。 |
| `config.example.toml` | [12-config-example.md](12-config-example.md) | 可分享的配置模板与安全起点。 |
| `pyproject.toml` | [13-pyproject.md](13-pyproject.md) | Python 版本与直接运行依赖声明。 |
| `switch-upstream.ps1` | [14-switch-upstream.md](14-switch-upstream.md) | 改写本地路由、重启中间件的 Windows 运维脚本。 |
| `start-codexcont-ccswitch.bat` | [15-start-ccswitch.md](15-start-ccswitch.md) | CCswitch/Cockpit 场景的一键前置检查和启动包装器。 |
| `.gitignore` | [16-gitignore.md](16-gitignore.md) | 防止本地凭据和运行产物进入版本控制。 |

## 阅读纪律：用第一性原理追踪代码

每读一处，先回答：**它保存了什么事实？它何时允许把数据交给客户端？失败时宁可丢什么，也绝不泄漏什么？**

全项目最重要的答案是：`reasoning` 可以实时转发；`message` 和 `function_call` 在本轮完成前只是候选输出，必须缓冲。命中截断并续写时丢弃候选输出；最终确认或受保护地不完整结束时，才构造最终响应。
