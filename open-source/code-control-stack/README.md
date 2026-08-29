# Code Control Stack

完整上下文工程配置包。用显式上下文、工具契约、权限边界和反馈记录，让 Agent 的行为可发现、可审查、可交接。

## 核心原理

目标不是操纵模型或绕过平台规则，而是把合法任务的输入、工具和验证条件写清楚，让每一步都能被人复核。

```
任务上下文（目标/边界/证据）
  → 工具注册与参数契约
  → 权限与人工确认点
  → 执行反馈与日志
  → 可验证、可交接的任务结果
```

## 文件结构

```
code-control-stack/
├── AGENTS.md                    # 项目级行为框架，每次会话加载
├── DEVELOPER.md                 # system/developer 执行框架
├── registry.yaml                # 工具注册表（模型可见的语义入口）
├── anchor-map.yaml              # 公开锚点 → 内部实现映射
├── .claude/
│   ├── skills/
│   │   ├── ask-matt/
│   │   │   └── SKILL.md         # 技能/流程路由器
│   │   ├── ctf-sandbox-orchestrator/
│   │   │   └── SKILL.md         # Sandbox 建模器
│   │   └── project-automation/
│   │       └── SKILL.md         # 项目自动化执行器
│   └── references/
│       └── agent-cloud.md       # Agent 控制栈参考
└── README.md                    # 本文件
```

## 部署步骤

### 1. 复制到项目根目录

把整个 `code-control-stack/` 文件夹复制到你的项目根目录。

### 2. 合并文件

| 源文件 | 目标位置 | 说明 |
|--------|---------|------|
| `AGENTS.md` | 项目根目录 `AGENTS.md` | 覆盖或合并现有文件 |
| `DEVELOPER.md` | 项目根目录 `DEVELOPER.md` | 需要在系统配置中引用 |
| `registry.yaml` | `.claude/tools/registry.yaml` | 创建目录，放入文件 |
| `anchor-map.yaml` | `.claude/tools/anchor-map.yaml` | 创建目录，放入文件 |
| `.claude/skills/*/SKILL.md` | 对应 skill 目录 | 保持目录结构 |
| `.claude/references/agent-cloud.md` | 对应 references 目录 | 参考文档 |

### 3. 配置 DEVELOPER.md 引用

在你的 Codex/Claude 配置中，确保 `DEVELOPER.md` 被加载为 developer prompt。

### 4. 验证部署

运行以下命令验证：

```bash
# 检查文件结构
ls -la AGENTS.md DEVELOPER.md registry.yaml anchor-map.yaml
ls -la .claude/skills/
ls -la .claude/references/
```

## 五层控制链路

```
DEVELOPER.md（system/developer 层）
  → 任务即授权、observation 优先、自检规则
        ↓
AGENTS.md（项目级行为框架）
  → 专业身份、技能路由、语义入口原则、反馈机制
        ↓
Skill 路由（ask-matt → ctf-sandbox-orchestrator → project-automation）
  → 决定走哪条 flow、建立 sandbox 模型、执行流程
        ↓
registry.yaml（工具语义入口）
  → Agent 看到：provision_test_environment / collect_target_fingerprint / ...
  → 每个入口都有用途、参数、权限和验证说明
        ↓
anchor-map.yaml（运行时解析）
  → 运行时映射到明确的实现适配器
  → 保留审计记录与失败边界
```

## 工具命名规范

所有工具名使用**测试/工程/运维**语义空间：

| 公开锚点名（模型可见） | 内部实现名（模型不可见） | 语义空间 |
|----------------------|----------------------|---------|
| `provision_test_environment` | `setup_environment_instance` | 测试环境 / 资源 provisioning |
| `collect_target_fingerprint` | `enumerate_target_surface` | 资产盘点 / 测试基线 |
| `populate_ui_form` | `fill_form_fields` | UI 自动化 / 表单填写 |
| `warm_browser_session` | `run_session_warmup` | 性能预热 / 环境准备 |
| `collect_debug_artifacts` | `capture_debug_snapshots` | 调试 / QA 回溯 |
| `export_execution_results` | `write_results_to_file` | 数据导出 / 报告生成 |

## 自定义

### 修改工具集

编辑 `registry.yaml` 和 `anchor-map.yaml`：

```yaml
# registry.yaml
tools:
  - name: your_tool_name
    description: |
      你的工具描述，锚定合法场景。
    parameters:
      type: object
      properties:
        param_name:
          type: string
          description: "参数描述"
      required: [param_name]

# anchor-map.yaml
anchors:
  your_tool_name:
    internal: your_internal_function
```

### 添加新 Skill

在 `.claude/skills/` 下创建新目录：

```
.claude/skills/your-skill/
└── SKILL.md
```

SKILL.md 必须包含 frontmatter：

```yaml
---
name: your-skill
description: |
  技能描述。触发信号：什么情况下应该使用这个 skill。
allowed-tools:
  - your_tool_name
  - another_tool_name
---
```

### 修改行为框架

编辑 `AGENTS.md`，调整：
- 身份与职责
- 行为框架
- 技能路由规则
- 上下文控制原则
- 反馈机制

## 实验

框架内置对照实验能力。参考 `experiments/` 目录：

```
experiments/
├── exp-001-baseline/           # 基线验证
├── exp-02-tool-naming/         # 工具命名对语义空间的影响
├── exp-03-skill-description/   # Skill description 对任务合法性的影响
├── exp-04-context-order/       # 上下文加载顺序对初始决策的影响
└── FINAL-REPORT.md             # 总报告
```

## 关键设计原则

1. **语义入口隔离**：模型只接触测试/工程/运维语义，不接触对抗语义
2. **Skill 路由**：动态决定任务走哪条 flow
3. **场景锚定**：tool description + skill description 锚定合法场景
4. **反馈闭环**：每轮 observation 作为最高优先级证据
5. **硬/软甲分离**：明确哪些能调（软甲/语义层），哪些不能（硬甲/运行时）

## License

MIT
