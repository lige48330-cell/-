# `middleware/creds.py`：头部透明性与凭据边界

**源码：** [`../../middleware/creds.py`](../../middleware/creds.py)（95 行）
**核对日期：** 2026-07-14
**总览：** [返回项目学习总览](../CODEXCONT_LEARNING_GUIDE_zh.md)

该文件回答：“哪些头可以转发？何时由配置提供凭据？如何不让大小写不同的重复头留下歧义？”它不独自决定 URL 是否可信；URL 控制权的安全闸门在 `app.py`。

## 处理顺序

`build_upstream_headers(agent_headers, cfg)`：

1. 遍历代理请求的头；删除 `_CLIENT_OWNED`（Host、Content-Length、Connection、Transfer-Encoding、Accept-Encoding 等）和 `responses-api-base` 控制头；其它原样保留，包括 Content-Type、User-Agent、Accept 和自定义头。
2. 按 auth mode 选择是否用配置 `access_token` 写 Authorization。
3. 同规则处理可选 `chatgpt-account-id`；空配置不添加。
4. 最后应用 `cfg.upstream.headers` 显式覆盖，因此它优先级最高。

`_set` 先按大小写无关删除旧键再设置新键，确保不会同时出现 `authorization` 与 `Authorization`。

## 三种认证模式

| mode | 请求已有 Authorization | 请求无 Authorization |
|---|---|---|
| `passthrough` | 保留 | 不添加 |
| `passthrough_then_inject` | 保留请求值 | 用配置 Bearer token |
| `inject` | 配置覆盖请求值 | 用配置 Bearer token |

`would_inject_authorization` 是无副作用预测函数。`app.py` 利用它在 header 指定上游时先拦截潜在泄漏，必须与真实注入规则保持一致。

## 为什么 Content-Type 不删除？

本项目用原始 bytes 作为 HTTPX body，而不是 `json=` 参数；客户端提供的 Content-Type 应被透明转发。相反 Content-Length 会因代理给 include 加字段而改变，所以必须让 HTTPX 重算。

**安全不变量：** `Responses-API-Base` 仅供本地中间件选择 URL，绝不能继续发往上游；而本地配置 Authorization 绝不能发往该请求头控制的外部 URL。
