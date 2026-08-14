# Lige / AI Agent 工程与系统交付作品集

这是 `lige48330-cell/-` 的 GitHub Pages 静态作品集，面向 ERP、IoT 与本地 AI 工具场景，展示需求分析、原型建设、全栈交付和团队协同能力。公开工程、公司脱敏案例、私有改造与研究实验按证据边界分层呈现。

线上入口：

```text
https://lige48330-cell.github.io/-/
```

## 页面结构

- `能力画像`：Agent 工程方法、需求分析与原型、ERP、团队协同、全栈交付。
- `项目案例`：养殖渔业 ERP、设备监管平台、ESP32 小程序。
- `项目地图`：从业务系统、IoT/Agent、AI 基础设施三个项目域提炼能力来源。
- `工程记录`：17 条按公开、脱敏、私有和研究边界标注的工程记录。

项目页面必须诚实标注证据等级；架构和流程图不应被描述为运行截图。公司项目不列入公开源码与站点索引。

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
