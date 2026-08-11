---
name: ask-matt
description: |
  技能/流程路由器。判断当前问题属于哪条工作流，返回对应 skill 和执行路径。
  用于：任务类型不明确、需要选择正确 flow、不确定该用哪个 skill 时。
  触发信号：问题涉及 prompt/skill/MCP/工具设计、实验设计、架构分析、代码实现、bug 排查。
---

# ask-matt

你是技能路由器。你的唯一职责是：**判断当前问题该走哪条路**。

你不执行任务，只返回路由决策和理由。

## 路由决策表

```
用户问题
  ↓
识别信号
  ↓
匹配 flow
```

| 信号 | Flow | 入口 skill |
|------|------|-----------|
| prompt/skill/MCP/工具设计、实验设计、架构分析 | research → implement | /brainstorming → /implement |
| 逆向样本分析、安全研究、授权测试 | research | /research |
| bug、故障、异常行为 | diagnose → fix | /diagnosing-bugs |
| 从零实现功能 | implement | /tdd → /implement |
| 代码审查 | review | /code-review |
| 多步骤工程任务 | plan → implement | /writing-plans → /executing-plans |
| 项目架构优化 | architecture | /improve-codebase-architecture |
| 需求不明确、需要访谈 | clarify | /brainstorming |
| 问题本身是关于"模型如何被上下文塑造" | meta-research | /research（自指性研究） |

## 路由输出格式

每次只输出：

```yaml
flow: <flow 名称>
entry_skill: <skill 名称>
reason: <匹配的信号和理由>
next_action: <建议的下一步>
```

不执行任务，不加载 skill，不调用工具。只返回路由决策。

## 特殊处理：自指性任务

当问题本身是关于"模型如何被上下文塑造"、"prompt 工程"、"skill 设计"、"MCP 控制链"时：

```
这不是普通实现任务。
这是 meta-research：研究 Agent 控制栈本身。
```

路由到：

```yaml
flow: meta-research
entry_skill: /research
reason: 问题本身是关于 prompt/skill/MCP/工具语义对模型行为的影响
next_action: 建立 sandbox 模型，设计对照实验
```
