# 业务流程数字化作品集

这是 `lige48330-cell/-` 的 GitHub Pages 作品集站点，目标是展示一种清晰能力：把现场业务流程、设备数据和交付约束拆成模块、字段、表单、状态、API、看板和验证清单，再用低代码、IoT 后端和 AI Agent 推进到可交付系统。

线上入口：

```text
https://lige48330-cell.github.io/-/
```

本地预览：

```bash
node scripts/serve-pages.js
```

打开：

```text
http://127.0.0.1:4173/-/
```

## 当前结构

- `index.html`：首页，展示能力主线、项目证据等级和联系方式。
- `projects/smartagri-erp.html`：智慧养殖 ERP 项目详情页。
- `projects/ai-career-ops.html`：CareerOps 项目详情页。
- `projects/esp32-iot-platform.html`：ESP32 IoT 平台项目详情页。
- `projects/ai-supervisor.html`：AI Supervisor 项目详情页。
- `404.html`：GitHub Pages 404 页面。
- `styles/site.css`：主样式。
- `scripts/site.js`：小型前端增强。
- `scripts/serve-pages.js`：本地预览服务器，模拟 GitHub Pages 的 `/-/` 路径。
- `scripts/verify-site.js`：确定性验证脚本。
- `images/`：作品集使用的本地图片素材。

## 证据说明

- 智慧养殖 ERP：当前最强证据，首页使用 `images/smartagri-erp.png` 展示验证报告和关键通过项。
- CareerOps：原型流程证据，重点展示信息结构、自动化边界和流程产品化能力。
- ESP32 IoT 平台：推进中项目，适合展示三端联调思维，不包装成已完成上线。
- AI Supervisor：工具化实验，展示把 AI 协作变成 spec、plan、review、guard、hook、doctor 的质量门禁思路。
- SVG 流程图用于解释架构或流程，不等同于真实运行截图。

## 安全编辑范围

日常维护优先编辑：

- `index.html`
- `projects/*.html`
- `404.html`
- `styles/site.css`
- `scripts/site.js`
- `README.md`
- `DEPLOYMENT.md`

谨慎编辑：

- `scripts/verify-site.js`：只有当站点验收规则改变时才改。
- `scripts/serve-pages.js`：只有当本地预览路径规则改变时才改。

保留：

- `.nojekyll`：GitHub Pages 需要它正常服务下划线目录。
- `images/`：当前作品集使用的本地素材。

## 验证

每次改完运行：

```bash
node scripts/verify-site.js
```

可选检查：

```bash
git status --short
git diff --name-only
```

如果验证失败，优先修页面、样式、路径或文档，不要为了绕过错误随手降低验证规则。


