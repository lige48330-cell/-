# `run.py`：进程入口

**源码：** [`../../run.py`](../../run.py)（24 行）
**核对日期：** 2026-07-14
**总览：** [返回项目学习总览](../CODEXCONT_LEARNING_GUIDE_zh.md)
**先决问题：** “一个 Python 文件如何把配置变成正在监听端口的 Web 服务？”

## 责任边界

此文件不处理 HTTP、不解析 SSE、不决定是否续写。它只做启动编排：定位项目根目录，读取 `config.toml`，配置日志，创建 Starlette 应用，再交给 Uvicorn。

## 控制流

```text
python run.py
  → ROOT = 此文件所在目录
  → load_config(ROOT / "config.toml")
  → logging.basicConfig(...)
  → create_app(cfg)
  → uvicorn.run(app, host, port, log_level)
```

`if __name__ == "__main__"` 是入口保护：直接执行时调用 `main()`；若其它模块 `import run`，不会意外启动服务器。

## 逐段理解

- `ROOT = Path(__file__).resolve().parent`：不用当前工作目录，而用脚本所在目录，因此从别处启动也能稳定找到同目录配置。
- `load_config(...)`：把 TOML 转为 `Config`；默认值和宽容读取在 `middleware/config.py`。
- `getattr(logging, cfg.log.level.upper(), logging.INFO)`：把如 `info` 转成日志等级；未知名字回落到 `INFO`。
- `create_app(cfg)`：此时只构建 ASGI 应用和生命周期方案；HTTP 客户端稍后在生命周期开始时创建。
- `uvicorn.run(...)`：Uvicorn 接管事件循环与网络监听，之后每个请求才会进入 `app.py`。

## 不变量与排错

`run.py` 只读取 `config.toml`，不是 `config.example.toml`。启动失败优先检查前者 TOML 语法、端口占用和依赖环境。不要在这里加入业务逻辑：那会让启动文件成为难以测试的第二入口。

**自测：** 为什么 `ROOT` 不写成 `Path.cwd()`？——因为启动命令的当前目录可变，配置位置不应随之漂移。
