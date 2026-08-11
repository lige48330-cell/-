# `middleware/store.py`：有限期的 reasoning ID 记忆

**源码：** [`../../middleware/store.py`](../../middleware/store.py)（44 行）
**核对日期：** 2026-07-14
**总览：** [返回项目学习总览](../CODEXCONT_LEARNING_GUIDE_zh.md)

这是一个仅给 `repair_followup="stateful"` + `tool_pair` 使用的小型进程内集合。它记录“某 reasoning id 后曾插入 synthetic continue pair”，从而下一个客户端回合携带该 reasoning 时能按 id 重插 pair。

## 表示与操作

内部 `_d` 是 `OrderedDict[str, float]`：key 是 reasoning id，value 是基于 `time.monotonic()` 的过期时刻。单调时钟不受系统时间被手工调整影响。

- `add(key)`：写入 `now + ttl`、移动到末尾（最新使用），然后 `_purge`。
- `key in store`：不存在为假；过期则删除并为假；有效则移动到末尾并为真。
- `_purge(now)`：从队首连续删过期项；随后当长度超过 `maxsize` 时从队首删最久未使用项。

这既是 TTL 又是 LRU：容量不会无限增长，旧会话也不会永久影响未来输入。

## 重要限制

它不持久化、不跨进程、不加锁，也不存推理文本。文件注释已明确它只适合单实例。它的正确性来自“按 recorded id 精确匹配”，而非“看到 reasoning 就猜测相邻应有 pair”；实际插入逻辑位于 `codex.repair_followup_input`。

**自测：** 为什么 `__contains__` 命中时也 `move_to_end`？因为一次使用应刷新 LRU 顺序，减少仍活跃会话被容量淘汰的概率。
