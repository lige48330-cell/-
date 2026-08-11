# `config.example.toml`：可分享的安全配置模板

**源码路径：** [`../../config.example.toml`](../../config.example.toml)
**核对日期：** 2026-07-14
**总览：** [返回项目学习总览](../CODEXCONT_LEARNING_GUIDE_zh.md)

这是供复制为 `config.toml` 的模板，不会被 `run.py` 自动读取。它和本地配置拥有同一 schema，默认把上游模式设为 `header`，因此特别适合解释“请求可选地指定上游”和“凭据不得泄漏”的关系。

## 与本地配置的有意差异

模板的 `upstream.url` 是回退 endpoint，而 `mode="header"` 表示请求若带 `Responses-API-Base`，`app._resolve_upstream_url` 把该值当作 base 并补 `/responses`；没有该头才用回退 URL。此控制头不会向上游转发（`creds.py` 删除它）。

模板的 `[auth]` 也是 `passthrough` 且 token 为空：这是最保守、最适合分发的初始状态。若改为 `inject` 或 `passthrough_then_inject` 并填 token，再允许 request header 选择外部 URL，`app.py` 会拒绝“可能把本地 token 注入外部 URL”的请求。这不是配置错误，而是安全闸门正常工作。

## 续写与流式字段

文件注释已经列出字段；学习时应把它们按代码消费点分组，而非只背名称：

- **入口资格：** `continue.enabled`、请求 stream/reasoning 条件；
- **续写资格：** `truncation_step`、`min_n`、`max_n`、`max_continue`、`max_total_output_tokens`；
- **下一轮提示：** `method`、`marker_text`，或 legacy tool pair 的三个字段；
- **输出形态：** `force_include_encrypted`、`rechunk_final_answer`、`rechunk_size`；
- **可观测性：** `log.level`、`dump_rounds_dir`。

`forward_marker=false` 保持下游历史干净；设 true 时只有 commentary marker 会作为正常 assistant item 下发。`repair_followup` 只有 `tool_pair` 旧路径才有意义。

## 常见误解

1. `header` 不是无条件要求 header；无 header 会回退。要求 header 应用 `header_required`。
2. `max_continue=3` 不是总共三轮，而是最多进行三次“当前轮 → 下一轮”的续写转场。
3. 填入 token 后不能把模板提交为公共配置；应复制到被忽略的 `config.toml`。

**验证：** 测试中的 `test_upstream_url_resolution`、`test_auth_safety_guard`、`test_auth_injection` 对应模板最重要的 URL/认证语义。
