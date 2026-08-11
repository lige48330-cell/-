# `middleware/app.py`：HTTP 边界与安全分流

**源码：** [`../../middleware/app.py`](../../middleware/app.py)（218 行）
**核对日期：** 2026-07-14
**总览：** [返回项目学习总览](../CODEXCONT_LEARNING_GUIDE_zh.md)
**核心职责：** 把一个进入监听路径的 POST 请求，安全地送到上游；只有满足严格条件时才交给折叠状态机。

## 入口链

`create_app(cfg)` 注册 `cfg.server.listen_paths` 中每个路径的 `POST → handle_responses`。生命周期启动时把三个共享对象放在 `app.state`：不可变配置 `cfg`、一个 `httpx.AsyncClient`、一个 `IdStore`；关闭时关闭 HTTP 客户端。

## `handle_responses()` 的决策树

```text
读取原始 body → JSON 且为 object？否则 400
→ 解析上游 URL；header_required 缺头？400
→ 请求头指定外部 URL 且会注入本地 Authorization？400
→ enabled && stream && reasoning_enabled && 非 tool_pair 名称冲突？
     否 → _passthrough（原 body、原上游响应字节）
     是 → 可选跨回合 repair → build_round_payload → 打开 round 1
             round 1 非 2xx：原状态码/错误体返回
             否则：StreamingResponse(fold_stream(...))
```

### URL 解析函数

- `_header_base`：大小写无关读取 `Responses-API-Base`，去空白，空值当不存在。
- `_join_responses`：把 base 规范为 `<base>/responses`；如果已经以 `/responses` 结尾则不重复追加。
- `_resolve_upstream_url`：`fixed` 永远用配置 URL；`header` 有头则覆盖、无头回退；`header_required` 无头返回 `None`，由入口变成 400。

### 最关键安全闸门

请求可控制 `Responses-API-Base` 时，配置中的令牌绝不能被带往该 URL。`_url_is_from_header(...) && would_inject_authorization(...)` 为真就拒绝。注意 `inject` 模式即使代理请求本身带了 Authorization 也会覆盖它，因此仍须拒绝；`passthrough_then_inject` 且请求已有自己的 Authorization 则可放行。

## 为什么先开第一轮、后建流？

`open_round` 后若 round 1 是非 2xx，入口还能把真实 HTTP 状态码和错误体返回。若一开始就响应 200 SSE，认证错误会被埋进流中，客户端失去正确的失败语义。后续轮已经处在 SSE 会话中，只能由 `proxy.py` 合成为 `response.incomplete`。

## 透传不是“少处理”，而是设计承诺

`_passthrough` 保留原始 request body，并逐块 `yield resp.aiter_bytes()`；`finally` 始终关闭上游响应。以下任一条件都会透传：续写禁用、非流式、显式 `reasoning: false`、或 legacy `tool_pair` 中用户已声明同名工具。只有 `tool_pair` 需要碰撞规则，因为 commentary 不注入工具。

## `_make_client()`

HTTPX 客户端超时设为 `None`，并删除默认 `User-Agent`/`Accept`，避免代理伪造身份。Host、Content-Length、压缩等客户端拥有的头由 HTTPX 重新管理，具体筛选在 `creds.py`。

**自测：** `reasoning` 字段缺失时是否折叠？是；仅显式 `false` 才关闭 reasoning（见 `codex.reasoning_enabled`）。
