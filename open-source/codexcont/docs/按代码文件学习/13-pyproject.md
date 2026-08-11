# `pyproject.toml`：运行环境的最小声明

**源码路径：** [`../../pyproject.toml`](../../pyproject.toml)
**核对日期：** 2026-07-14
**总览：** [返回项目学习总览](../CODEXCONT_LEARNING_GUIDE_zh.md)

此文件是 Python 项目元数据和直接依赖声明，不参与每一次请求，但它决定项目在哪种解释器和库 API 范围中被安装、运行和测试。

## 声明内容与运行连接

- `requires-python = ">=3.12"`：源码可使用 Python 3.12+ 的语言/标准库能力；`config.py` 的 `tomllib` 也属于标准库。
- `httpx>=0.27`：`app.py` 和 `proxy.py` 用它构造异步 HTTP 客户端、发送流式上游请求。
- `starlette>=0.37`：`app.py` 用它接请求、定义路由、生命周期与流式响应。
- `uvicorn>=0.30`：`run.py` 用它启动 ASGI server。
- `dev=[]`：当前没有额外开发依赖；测试文件是一个可直接执行的 Python 脚本，而非依赖 pytest。

项目名 `gptpoc` 与目录名 CodexCont 不一致是元数据事实，不影响 `python run.py` 的 import 路径；不要据此推断存在名为 `gptpoc` 的运行包。

## 不变量与边界

版本约束是下限而非锁定的精确版本；精确解析结果由 `uv.lock` 记录，但本学习资料不逐项解释锁文件的机器生成依赖图。升级依赖可能改变第三方行为，不能只改此文件就宣称代理逻辑仍正确；需要重新运行离线测试和必要的真实兼容性验证。

**验证：** `./.venv/Scripts/python.exe --version` 应满足 3.12+；`./.venv/Scripts/python.exe tests/test_middleware.py` 验证当前已安装依赖下的项目契约。
