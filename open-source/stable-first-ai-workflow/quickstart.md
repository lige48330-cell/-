# Stable-First Framework 快速上手

## 前置条件
- opencode / Claude Code / Cursor 等 AI 编程工具
- Node.js >= 18
- npm / yarn

## 5 分钟接入

### 1. 复制规范层到项目
```bash
# 从模板项目复制
cp -r path/to/stable-first-framework/* ./project/
```

### 2. 配置 opencode
```jsonc
// opencode.json 或 .opencode/config.json
{
  "agents": { "require": [".opencode/agents/phase-*.json"] },
  "customCommands": [
    { "name": "gate",  "command": "powershell -File gates/gate-run.ps1 -Phase ..." },
    { "name": "phase", "command": "cat .opencode/STATE.json" }
  ]
}
```

### 3. 开始第一个阶段
```
@phase-1-requirement  描述你的项目需求...
```

### 4. 每阶段完成后
```
/gate    # 手动触发闸门检查（如果自动钩子未生效）
/phase   # 查看当前阶段状态
```

## 自定义模板
编辑 `templates/phase-*.md` 修改验收标准。修改 `gates/phase-*.ps1` 修改闸门规则。
