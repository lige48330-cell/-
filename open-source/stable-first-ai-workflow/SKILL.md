# Stable-First Framework

## 用途
为 AI 编程工具提供 6 阶段规范化工作流，保证需求结构化 → 架构设计 → 核心实现 → 稳定性加固 → 复盘沉淀 → 闭环验证的完整执行。防止跳步、合并验收、遗漏约束。

## 适用场景
任何需要结构化交付的全栈 CRUD 项目，尤其：
- Node.js + Express + Prisma 后端
- Vue 3 前端
- JWT 认证
- SQLite/MySQL/PostgreSQL 数据库

## 使用方式

### 新项目
1. 切换到工作目录
2. 运行 `opencode` 并调用 Agent：`@phase-1-requirement`
3. 按提示提供项目信息
4. 完成阶段 1-6，每个阶段自动触发闸门

### 已有项目
1. 将 `templates/`、`gates/`、`.opencode/` 复制到项目根目录
2. 运行 `@phase-1-requirement` 开始

## 阶段说明
| 阶段 | Agent | 输入 | 输出 |
|------|-------|------|------|
| 1 | @phase-1-requirement | 自然语言 | PROJECT_SPEC.md |
| 2 | @phase-2-architecture | PROJECT_SPEC.md | ARCHITECTURE.md |
| 3 | @phase-3-implementation | ARCHITECTURE.md | src/ |
| 4 | @phase-4-stability | src/ | STABILITY_REPORT.md |
| 5 | @phase-5-retrospect | 全部 | RETROSPECTIVE.md + 三件套 |
| 6 | @phase-6-validation | 全部 | CHECKLIST_SIGNED.md |

## 文件结构
```
project/
├── templates/
│   ├── phase-1-requirement-spec.md
│   ├── phase-2-architecture-spec.md
│   ├── phase-3-implementation-spec.md
│   ├── phase-4-stability-spec.md
│   ├── phase-5-retrospect-spec.md
│   ├── phase-6-validation-spec.md
│   └── constraints/
│       ├── global-constraints.md
│       └── pitfall-db.json
├── gates/
│   ├── gate-run.ps1
│   ├── lib/*.ps1
│   └── phase-*.ps1
└── .opencode/
    ├── STATE.json
    ├── agents/phase-*.json
    └── hooks/phase-transition.ps1
```
