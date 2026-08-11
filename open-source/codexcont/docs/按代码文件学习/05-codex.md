# `middleware/codex.py`：续写规则的纯函数层

**源码：** [`../../middleware/codex.py`](../../middleware/codex.py)（197 行）
**核对日期：** 2026-07-14
**总览：** [返回项目学习总览](../CODEXCONT_LEARNING_GUIDE_zh.md)
**设计目的：** 让“该不该续写”和“下一轮请求长什么样”脱离网络状态机，因而可独立测试。

## 截断数学

经验指纹是 `reasoning_tokens = step × n - 2`，默认 `step=518`，所以 `516、1034、1552...` 是候选点。

- `is_truncation_pattern(tokens, step)`：先防空和过小，再检查 `(tokens + 2) % step == 0`。
- `tier_n(...)`：若命中返回 `n=(tokens+2)//step`，否则 `None`。
- `should_continue(...)`：还要求 `min_n ≤ n ≤ max_n`；`max_n=0` 表示无上界。
- `reasoning_tokens(usage)`：从嵌套的 `output_tokens_details.reasoning_tokens` 宽容取数。

这里的数学不是“证明模型一定截断”，而是保守的经验触发器；真正续写还由 `proxy.py` 要求终端、加密推理和各类上限。

## 两种 continuation marker

默认 `commentary_message(text)` 创建 assistant 的 `phase: commentary` message。它不伪造工具。

legacy `continue_pair(reasoning_id, ...)` 生成 `function_call` 和对应 `function_call_output`。`continue_call_id` 以 reasoning id 的 SHA-1 前 24 字符确定性生成，因此同一 id 重放时字节稳定；它不是安全令牌，只是稳定标识。

## payload 装配

`build_round_payload` 复制原 body，不改变调用者字典；强制 `stream=True`，设置本轮 `input`，必要时合并 `include` 以确保 `reasoning.encrypted_content`，续写轮再移除 `previous_response_id`。模型、instructions、reasoning、tools 都来自原请求，函数不凭空发明。

`merge_include` 仅接受 list；强制项不存在时才追加。

## 分流和跨回合修复

- `declares_continue_tool` 只看 `tools` 声明数组，不把历史 input 中的同名调用误判为冲突。
- `reasoning_enabled`：缺省/`None`/字典都视为开；只有 `False` 关闭。
- `repair_followup_input`：仅 legacy `tool_pair + stateful` 使用。它在**已记录 id** 的 reasoning 后插入确定性 pair；若下一项已是同 call id 则跳过，因此幂等，也不会因两个自然相邻 reasoning 而错误插入。

**自测：** 为什么 continuation round 要去掉 `previous_response_id`？因为下一轮已经通过 `orig_input + replay_tail` 显式传入需要恢复的推理状态，二者并用会造成两套历史来源。
