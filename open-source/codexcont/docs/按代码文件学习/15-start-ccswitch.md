# `start-codexcont-ccswitch.bat`：CCswitch 启动包装器

**源码路径：** [`../../start-codexcont-ccswitch.bat`](../../start-codexcont-ccswitch.bat)
**核对日期：** 2026-07-14
**总览：** [返回项目学习总览](../CODEXCONT_LEARNING_GUIDE_zh.md)

此批处理文件是面向固定本地拓扑的人工入口：先确认 CCswitch/Cockpit 在 56245 监听，再调用 `switch-upstream.ps1 ccswitch`，最后显示路由。它不自己运行 Python，也不实现上游切换逻辑。

## 逐段控制流

1. `setlocal` 限制环境变量修改在本脚本进程内；固定 `ROOT`、PowerShell 脚本路径、用户 Codex 配置和项目配置路径。
2. 通过 `Get-NetTCPConnection -LocalPort 56245 -State Listen` 检查上游本地服务；未监听则 PowerShell 退出 1，批处理以 `if errorlevel 1 goto done` 停止。
3. 执行 `switch-upstream.ps1 ccswitch`；其中预设会解析到 `http://localhost:56245/v1/responses`，并负责改写/重启。
4. 两个正则只读展示：从用户 Codex TOML 找 provider `base_url`，从项目 TOML 找 `[upstream].url`。
5. 打印预期链 `Codex → 127.0.0.1:8787/v1 → localhost:56245/v1/responses`，最后 `pause` 留住窗口。

## 边界与风险

端口 56245 是此本机集成的硬编码假设，并非 CodexCont 协议要求；未监听时脚本正确地不继续。两个 `powershell.exe` 调用使用 `-ExecutionPolicy Bypass`，只应运行已审阅的本地脚本。它间接触发 `switch-upstream.ps1` 的写配置、杀 8787 进程和后台启动副作用，故不能把它视作无害的“状态查看”。

正则展示失败只会打印提示，不阻止服务已启动；最终应以端口、日志和真实离线/受控请求验证，而非只相信显示文本。

**验证：** 需要 CCswitch/Cockpit 已启动才可运行。学习阶段可只检查命令链；实际运行后检查 56245、8787、`logs/` 和两个配置文件是否符合预期。
