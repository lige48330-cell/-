# Lige / AI 辅助全栈系统工程作品集

这是 `lige48330-cell/-` 的 GitHub Pages 静态作品集，展示需求分析、原型建设、ERP、IoT、AI 工具开发和团队协同能力。公司项目、个人改造、原型与研究实验按证据边界分层呈现。

线上入口：

```text
https://lige48330-cell.github.io/-/
```

## 页面结构

- `能力画像`：AI 辅助开发、需求分析与原型、ERP、团队协同、学习系统。
- `项目案例`：养殖渔业 ERP、设备监管平台、ESP32 小程序。
- `项目地图`：从 D1、D2、AI 三个项目域提炼能力来源。
- `工程档案`：17 个公开档案，标注可运行系统、MVP、原型、私有改造和研究实验。

项目页面必须诚实标注证据等级；架构和流程图不应被描述为运行截图。

## 本地预览与验证

```bash
node scripts/serve-pages.js
node scripts/verify-site.js
```

本地预览地址：`http://127.0.0.1:4173/`（若使用 `scripts/serve-pages.js`，则为 `http://127.0.0.1:4173/-/`）。

## 维护范围

- `index.html`：首页和项目分层。
- `projects/*.html`：主案例详情页。
- `images/`：仅存放当前公开页面使用的素材。
- `styles/site.css`、`scripts/site.js`：通用样式与前端增强。
- `scripts/verify-site.js`：公开站点的确定性检查。
