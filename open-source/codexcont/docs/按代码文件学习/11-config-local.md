# `config.toml`：本机实际运行策略

**源码路径：** [`../../config.toml`](../../config.toml)
**核对日期：** 2026-07-14
**总览：** [返回项目学习总览](../CODEXCONT_LEARNING_GUIDE_zh.md)

这是当前机器运行时由 `run.py` 读取的本地配置；它被 `.gitignore` 排除，不能假设其它开发者拥有相同内容。它没有 Python 控制流，但其值会直接决定 `config.py` 建出的 `Config`，继而改变 `app.py` 和 `proxy.py` 的行为。

## 当前文件表达的运行链

`server.host=127.0.0.1` 与 `port=8787` 表明服务只监听本机；`listen_paths=["/v1/responses"]` 只注册该路由。`upstream.mode="fixed"` 使请求头 `Responses-API-Base` 被忽略，所有请求转向本文件 `upstream.url` 所填的 endpoint。当前 URL 是本机人员环境中的占位/切换结果；理解它是“固定上游”即可，不应把它当成可公开或通用地址。

## 各节如何进入代码

| 配置节 | 消费者 | 实际影响 |
|---|---|---|
| `[server]` | `run.py`、`app.create_app` | 监听地址与允许的 POST 路径。 |
| `[upstream]` | `app._resolve_upstream_url` | 上游 endpoint 和 URL 选择模式。 |
| `[auth]` | `creds.build_upstream_headers` | 此文件选 `passthrough`，因此不从配置注入 token。 |
| `[continue]` | `app.handle_responses`、`proxy.fold_stream` | 启用 commentary 续写，最多三次续写，tier 1–6 可触发。 |
| `[stream]` | `codex.build_round_payload`、`proxy._flush_entry` | 要求 encrypted reasoning，并把最终文本按 16 字符重分块。 |
| `[log]` | `run.py`、`proxy.fold_stream` | info 日志；空 dump 目录表示不保存原始 SSE。 |

## 关键分支与保护

此配置的 `enabled=true` 不等于每个请求必续写：还必须是流式、reasoning 未显式关闭、命中 token 指纹、带 encrypted reasoning 且未碰到上限。`auth.mode=passthrough` 的含义是上游认证完全由客户端请求头承担；若没有有效头，第一轮上游失败会由 `app.py` 原样返回其状态码。

不要把真实 token 写入可提交文件；本文件被忽略正是为了让本机值与仓库模板分离。修改前先复制并理解 `config.example.toml`，再运行离线测试；真正启动会连接配置中的上游，不是离线实验。

**验证：** `./.venv/Scripts/python.exe tests/test_middleware.py` 验证配置语义所依赖的代码分支；`./.venv/Scripts/python.exe run.py` 会实际读取此文件，故只在确认上游设置后运行。
