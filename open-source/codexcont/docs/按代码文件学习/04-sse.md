# `middleware/sse.py`：从任意字节分块恢复 SSE

**源码：** [`../../middleware/sse.py`](../../middleware/sse.py)（86 行）
**核对日期：** 2026-07-14
**总览：** [返回项目学习总览](../CODEXCONT_LEARNING_GUIDE_zh.md)

网络层交给你的不是“一个事件一个 chunk”，而是任意长度的字节块：一个 chunk 可含半行、多个事件，或恰好为空。`incremental_sse()` 的职责是只在 SSE 事件完整时产出 JSON。

## 状态机

状态只有两份：`buffer` 保存尚未看到换行的字节；`data_lines` 保存当前事件的所有 `data:` 行。

```text
收到 chunk → 追加 buffer
只要 buffer 含 '\n'：取出一行并解码
  空行：把 data_lines 用 '\n' 合并，清空；[DONE] 产出 sentinel，否则 JSON 解析并产出 dict
  ':' 开头：注释，忽略
  'data:' 开头：去可选一个空格，追加 data_lines
  其它字段：忽略
流结束：再 flush 一次（兼容末尾没有空行）
```

`_decode_line` 用 UTF-8 `errors="replace"`，并兼容 `\r\n`。多行 data 根据 SSE 规则以换行连接。坏 JSON 被跳过而不是让整条代理流失败，这是刻意的宽容策略。

## 终端与序列化

`DONE = "[DONE]"` 是字符串 sentinel，和 dict 事件区分。`serialize_event` 以 `event: <type>\ndata: <minified JSON>\n\n` 编码；`serialize_done` 输出 `data: [DONE]\n\n`。代理依靠空行划分事件，而非依靠 HTTP chunk。

**常见误解：** `event:` 行在解析时被忽略并非丢信息：本项目上游 JSON 的 `type` 是真实分类依据，序列化时再由它重建 `event:`。

**自测：** `data: {"a":` 与 `1}\n\n` 分属两个 chunk 时会怎样？前者只留在 `buffer`，直到换行与空行都到齐才解析成一个事件。
