# `middleware/proxy.py`：多轮流折叠状态机

**源码：** [`../../middleware/proxy.py`](../../middleware/proxy.py)（550 行）
**核对日期：** 2026-07-14
**总览：** [返回项目学习总览](../CODEXCONT_LEARNING_GUIDE_zh.md)
**它是项目的核心。** 目标不是把多个上游响应拼接，而是把多轮内部推理折成一个对下游语义正确的 SSE 响应。

## 第一性原理

上游某轮的 `message`/`function_call` 在知道该轮是否命中截断前，都是**暂定输出**。提前发出后无法撤回；因此：

| 项目 | 本轮期间 | 轮结束后命中续写 | 干净结束 |
|---|---|---|---|
| `reasoning` | 立即转发 | 已发出，加入 replay | 保留 |
| `message` / `function_call` | 缓冲 | 丢弃 | 刷新到下游 |

这解释了大多数代码分支。

## 辅助层

- `open_round`：字典 JSON 编码为原始字节，流式 POST；不替 HTTPX 发明 Content-Type。
- `open_passthrough`：同样流式 POST，但原样发送原 body。
- `_tee`：可选将每轮原始 SSE 同时写入 `dump_rounds_dir`，仍逐块向解析器产出。
- `_sum_usage`：累计真实各轮账单；`_agent_usage` 则重建“下游仿佛只经历一轮”的 usage：输入仅第 1 轮，reasoning 求和，非 reasoning 仅最终已刷新轮。
- `_Seq`：全局单调 sequence number；`ds_oi` 是下游连续 output index。上游每轮都会从自己的索引重新开始，不能直接复用。
- `_flush_entry`：只在确认最终轮时放出缓冲事件，重写索引和序号；若启用 rechunk，把多个文本 delta 合并后按固定大小再拆，令最终文本输出更均匀。
- `_reconstruct_terminal` / `_synthetic_incomplete`：制造一个逻辑上的最终终端事件，附加 `proxy_rounds`、实际累计账单 `proxy_billed_usage` 与停止原因。

## `fold_stream()` 状态

初始化时保存：`orig_input`（用户原输入）、`replay_tail`（被确认需要交给下一轮的推理和 marker）、`final_output`（下游最终 output）、两类 usage、轮次信息、下游序号。`first_response` 已由 `app.py` 打开且确认是 2xx。

### 每轮读取阶段

1. 使用 `incremental_sse(response.aiter_bytes())` 得到事件；可选 `_tee`。
2. `response.created`、`response.in_progress`：仅第一轮转发，且把 `created.response` 保存为最终响应身份。
3. 终端事件（completed/failed/incomplete）：保存并停止读本轮。
4. `response.output_item.added`：若 item 是 `reasoning`，立刻分配下游索引并转发；否则创建 `out_buffer` 条目，只收集事件。
5. 后续 reasoning 生命周期事件立刻转发；`output_item.done` 的完整 reasoning item 加到 `round_reasoning` 和 `final_output`。缓冲项的事件只追加到对应 buffer。
6. 没见过 `added` 的项目级事件走 best-effort 直接转发，避免因不认识事件而卡死流。

### 轮末判定

令 `rt = reasoning_tokens(usage)`，`n = tier_n(rt)`。续写条件是所有条件同时成立：有终端事件、token 数符合 `step*n-2` 且层级在窗口内、有最后一个 reasoning 的 `encrypted_content`、轮数未超过 `max_continue`、累计输出没有触及总上限。没有终端事件绝不续写。

若命中指纹却不能续写，记录具体原因：`no_encrypted_content`、`max_continue`、`max_total_output_tokens` 或 `tier_out_of_window`。这是可观测的保守停止，不是静默猜测。

### 续写转换

当 `do_continue` 为真：关闭当前响应，**不刷新** `out_buffer`；构造 marker：默认 commentary message，或 legacy function-call/output pair。把 `round_reasoning + marker` 追加到 `replay_tail`。可选 `forward_marker` 只会把 commentary marker 以完整 SSE 生命周期下发，绝不泄漏 synthetic tool pair。

下一轮 payload 的 input 为 `orig_input + replay_tail`，并删除 `previous_response_id`：状态已显式携带于输入。若续写请求返回非 2xx，无法再改 HTTP 状态，产出 `response.incomplete(reason=upstream_error)`。

### 停止转换

- **上游 EOF，无终端：** 绝不刷新 buffer；保留已直播 reasoning，合成 `response.incomplete(upstream_eof)`。
- **有终端且不续写：** 逐条 `_flush_entry`，把确认过的 message/tool 放入 `final_output`，重建上游终端事件。若上游曾发 `[DONE]`，最后也序列化它。
- **HTTP/连接异常：** 捕获并合成 `upstream_error` incomplete；`finally` 再保险关闭当前响应。

## 读代码时的四个检查点

1. `out_buffer` 是否只在干净结束的 515–520 行被刷新？是。
2. 多轮输入为何不会重复原始用户输入？`orig_input` 固定一次，只有 `replay_tail` 递增。
3. 为什么 `final_output` 可先加入 reasoning？reasoning 已实时向下游可见，因此它是最终逻辑响应的一部分。
4. 为什么 billed usage 与 agent usage 分离？内部重试真实消耗需可见，但下游不应误以为自己一次输入占用了每轮重复的上下文。

**练习：** 把“第一轮 516 reasoning token、带 encrypted reasoning 和一条 message；第二轮 999 token、带最终 message”的事件，按上表手工列出哪些事件会真正下发。
