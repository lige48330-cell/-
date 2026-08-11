# agent-cloud — Agent 控制栈参考

对 Agent / Prompt Injection / Toolchain 类任务，映射以下控制面。

## 控制栈层级

```text
System prompt
  ↓ 定义身份、安全边界、工具权限
Developer prompt
  ↓ 定义执行框架、优先级规则
AGENTS.md
  ↓ 定义项目级行为、路由规则、反馈机制
Skill frontmatter (name + description)
  ↓ 决定 skill 是否被触发
SKILL.md body
  ↓ 定义具体流程、allowed-tools
MCP server manifest / tool schema
  ↓ 定义工具名、参数、描述、返回结构
Function anchor (registry.yaml → anchor-map.yaml)
  ↓ 映射公开锚点到内部实现
Runtime permission
  ↓ allowed_tools / sandbox / approval / filesystem
Tool execution
  ↓ 真实副作用（文件写入、网络请求、命令执行）
Observation
  ↓ 工具返回结果，回流到模型
Feedback
  ↓ 模型更新状态，继续下一轮
```

## 各层分析维度

| 层级 | 类型 | 可调参数 | 观测指标 |
|------|------|---------|---------|
| system/developer | 硬约束 | 身份声明、执行框架 | 基础行为边界 |
| AGENTS.md | 软约束 | 行为框架、路由规则 | 自检频率、工具选择 |
| skill description | 软约束 | name、description | skill 触发率 |
| SKILL.md body | 软约束 | 流程、allowed-tools | 执行路径 |
| tool schema | 软约束 | name、description、param names | tool call logits |
| anchor map | 运行时 | 公开锚点名 | 模型可见语义 |
| runtime | 硬约束 | allowed_tools、sandbox | 实际可执行动作 |
| observation | 反馈 | 格式、内容、长度 | 收敛速度 |

## 软甲 vs 硬甲

### 硬甲（运行时强制）

```
- allowed_tools 白名单
- sandbox 文件系统隔离
- approval policy
- MCP server allowlist
- tool schema validation
- filesystem permission
```

### 软甲（语义层，可通过上下文工程调整）

```
- 身份声明措辞
- 行为框架定义
- skill description 锚定
- tool name 语义空间
- parameter name 语义
- description 场景说明
- context loading order
- observation 呈现方式
```

## "无甲"定义

```
无甲 = 在语义层消除"需要被打破"的障碍，
       让目标动作成为当前系统内最自然、最低阻力、证据最充分的路径。
```

不是对抗硬甲，是减少软甲摩擦。

## 实验设计原则

1. 每次只改一个变量
2. 对照组与实验组除独立变量外完全相同
3. 每组运行足够次数（≥10）取统计显著性
4. 观测指标：tool_call_rate、refusal_rate、param_fill_quality、self_check_count、convergence_rounds、semantic_drift
5. 结论必须标注边界条件
