# `tests/test_middleware.py`：离线可执行规格

**源码：** [`../../tests/test_middleware.py`](../../tests/test_middleware.py)（648 行）
**核对日期：** 2026-07-14
**总览：** [返回项目学习总览](../CODEXCONT_LEARNING_GUIDE_zh.md)
**运行：** `./.venv/Scripts/python.exe tests/test_middleware.py`

该文件不用 pytest runner，而是自己的 `check()` 收集结果，`main()` 打印通过数并以退出码表达成败。它是学习项目最可靠的“行为证据”：测试不访问真实上游。

## 测试支架

- `make_sse(events)`：把 dict 事件编码成 SSE fixture。
- `_aiter_once` / `parse_events`：模拟异步字节源并用真实 `incremental_sse` 回读。
- `FakeResp`：模拟 HTTPX response 的 `aiter_bytes`、`aread`、`aclose`。
- `FakeClient`：按队列返回后续 round response，并记录发出的 payload；`run_fold` / `run_fold_capture` 用它们驱动真实 `fold_stream`。
- `_round(...)`：构建包含 reasoning、可选工具调用/消息和 terminal usage 的小型上游回放。

## 按行为分组

1. `test_truncation_math`：确认 516/1034 等数学边界、层级窗口和空值行为。
2. `test_sse_framing`：确认任意分块、多 data 行、DONE 与序列化的 framing。
3. `test_fold_real_captures`：用 fixture 回放真实形状，验证折叠、usage 和终端重建。
4. `test_truncated_tool_call_discarded`：最关键回归——截断轮的 tool call 和参数 delta 均不得泄漏；干净轮工具调用必须能下发。
5. `test_commentary_continuation_payload`、`test_tool_pair_continuation_payload`、`test_forward_marker_emits_downstream`：比较两种 marker、确保默认隐藏 marker、验证可选转发时生命周期与序号正确。
6. `test_header_transparency`、`test_upstream_url_resolution`、`test_auth_safety_guard`、`test_auth_injection`：验证头透明性、URL 三模式以及绝不向请求指定 URL 泄露配置凭据。
7. `test_reasoning_gate`、`test_stateful_repair`：验证仅显式 false 关闭 reasoning，及按 id 插入、自然相邻不误插、重复运行幂等。
8. `test_eof_incomplete`：无 terminal EOF 时必须 `response.incomplete(upstream_eof)`，并断言 buffered message 没有泄漏且最终 output 仅为 reasoning。

## 如何把测试变成学习练习

先遮住断言，预测事件序列；再运行测试；最后在 `proxy.py` 找到对应分支。例如想理解“不泄漏”，从 `test_eof_incomplete` 的 `partial` delta 出发，追到 `out_buffer`，再追到只在有 terminal 的干净结束处调用 `_flush_entry`。

注意：测试通过表示覆盖的契约仍成立，不表示已穷尽所有真实上游协议变体。修改核心逻辑时，先补一段可离线复现的新回放，再改实现。
