# 业务流程数字化作品集

这是 `lige48330-cell/-` 的 GitHub Pages 静态作品集，只展示已确认的原创项目。

线上入口：

```text
https://lige48330-cell.github.io/-/
```

## 项目分层

- 主案例：ESP32 IoT 平台、AI Supervisor、智慧水产养殖应用套件。
- 次级项目：AI Agent 编程学习平台、开发服务展示小程序。
- 不公开源码仓库、个人联系方式或非原创项目内容。

项目页面必须诚实标注证据等级；架构和流程图不应被描述为运行截图。

## 本地预览与验证

```bash
node scripts/serve-pages.js
node scripts/verify-site.js
```

本地预览地址：`http://127.0.0.1:4173/-/`。

## 维护范围

- `index.html`：首页和项目分层。
- `projects/*.html`：主案例详情页。
- `images/`：仅存放当前公开页面使用的素材。
- `styles/site.css`、`scripts/site.js`：通用样式与前端增强。
- `scripts/verify-site.js`：公开站点的确定性检查。
