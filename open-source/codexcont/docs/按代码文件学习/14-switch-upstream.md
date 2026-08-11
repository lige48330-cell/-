# `switch-upstream.ps1`：切换上游并重启本地中间件

**源码路径：** [`../../switch-upstream.ps1`](../../switch-upstream.ps1)
**核对日期：** 2026-07-14
**总览：** [返回项目学习总览](../CODEXCONT_LEARNING_GUIDE_zh.md)

这是 Windows 运维脚本，不是代理运行时模块。它会**写入本机两个配置文件、终止占用 8787 的进程并后台启动服务**，所以应先理解再执行。

## 输入、输出与调用者

参数是 `$Upstream`（预设名或 URL）、可选 `$Model` 和 `$ProxyPort`（默认 7897）。`start-codexcont-ccswitch.bat` 以 `ccswitch` 调它。输出是：改写后的项目 `config.toml`、改写后的用户目录 `.codex/config.toml`、日志文件，以及一个监听 8787 的隐藏 PowerShell 进程。

## 控制流

```text
取得/询问 Upstream
→ Get-ResponsesEndpoint：预设映射或补 /responses
→ Set-UpstreamBlock：把项目 [upstream] 写成 fixed + endpoint
→ Replace-SectionValue：把 Codex 当前 provider 的 base_url 写为 127.0.0.1:8787/v1
→ 可选 Replace-TopLevelValue：写 model
→ 找到 8787 的 PID 并 Stop-Process
→ 创建 logs/，后台启动 .venv\Scripts\python.exe run.py
→ 设置 HTTP(S)_PROXY 和 NO_PROXY，打印路由与监听结果
```

辅助函数都是文本级 TOML 修改器：按正则找到顶层键或指定 section 后替换/插入；`Write-Utf8NoBom` 保证 Windows 配置文件以无 BOM UTF-8 写出。它们不解析 TOML AST，所以格式很复杂、同名键或注释异常时应人工检查写入结果。

## 关键状态与风险

`Set-UpstreamBlock` 强制 `mode="fixed"`，所以中间件之后忽略 `Responses-API-Base`。它在执行前不创建备份；同时会强制终止任何监听 8787 的进程，未确认该 PID 是否正是 CodexCont。脚本中的 `$Root` 需要按本机目录调整，迁移目录时应先检查路径。后台进程输出写入 `logs/codexcont.out.log` / `.err.log`，排错先看这两个文件。

这里设置的 `HTTP_PROXY/HTTPS_PROXY` 只注入新启动的 CodexCont 进程，`NO_PROXY` 防止本机服务回环再走代理。它是环境布线，不改变 `middleware` 的业务判断。

**验证：** 不要为学习而直接执行。先阅读脚本，再在已准备好本机配置的环境运行 `powershell -ExecutionPolicy Bypass -File .\switch-upstream.ps1 -Upstream ccswitch`，随后检查 `config.toml`、用户 Codex 配置、8787 监听和两个日志文件。
