# `middleware/config.py`：配置作为不可变策略对象

**源码：** [`../../middleware/config.py`](../../middleware/config.py)（133 行）
**核对日期：** 2026-07-14
**总览：** [返回项目学习总览](../CODEXCONT_LEARNING_GUIDE_zh.md)

## 数据模型

`Config` 聚合六个 frozen dataclass：

| 部分 | 控制内容 |
|---|---|
| `ServerCfg` | loopback 默认 host、端口、监听路径 |
| `UpstreamCfg` | 固定/请求头上游模式、URL、末级头覆盖 |
| `AuthCfg` | 凭据模式、token、account id |
| `ContinueCfg` | 指纹步长、轮数/层级/总量限制、marker 与 legacy 修复 |
| `StreamCfg` | 是否强制 encrypted reasoning、最终文本重分块 |
| `LogCfg` | 日志等级、每轮原始 SSE dump 目录 |

`frozen=True` 的含义是配置实例创建后不能原地改字段；测试需要改变设置时用 `dataclasses.replace`，避免一个测试污染另一个。

## `load_config(path)` 的步骤

1. 文件存在则 `tomllib.loads`，不存在则从空字典开始——于是所有 dataclass 默认值生效。
2. `_section` 取每个顶层表；值不是 table 就抛 `ValueError`，防止含混配置。
3. `listen_paths` 的 TOML list 转 tuple；`upstream.headers` 从嵌套表提取并强制键值为字符串。
4. `_only_known` 过滤未知键，允许配置文件含未来/拼写外字段而不让 dataclass 构造失败。
5. 构造所有子配置，`root` 记录配置实际目录（存在时）或当前目录（不存在时）。

`with_root` 是用 `replace` 生成 root 改写后的新 Config，主要便于调用方/测试。

## 需要从配置推导的保护

- `max_continue` 是“第一轮之后可额外续写”的硬限制；状态机使用 `round_no <= max_continue`，因此例如 8 允许从第 1 至第 9 轮的最多 8 次转场。
- `max_total_output_tokens=0` 表示关闭总量限制，非零才作为额外保险。
- `method=commentary` 为默认；只有 `tool_pair` 才需要名称碰撞和 stateful repair。

**自测：** 未知配置键会怎样？它会被 `_only_known` 忽略；但若整个 `[continue]` 不是 TOML table，则会明确失败。
