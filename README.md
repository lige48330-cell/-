# 系统交付作品集

独立开源作品集，展示 CodexCont 流式中间件、Code Control Stack 工程方法与 Stable-First 工作流等可验证的交付案例。

线上入口：`https://lige48330-cell.github.io/-/`

## 内容架构

- 10 区块单页：Hero → 价值主张 → 六段技术链 → 能力画像 → 主案例 → 方案与 AI 工程 → Agent 设计 → 项目雷达 → 能力沉淀 → 联系
- 暖纸色设计系统，零构建（HTML5 / CSS3 Custom Properties / Vanilla JS）
- 所有图片标注 AI 泛化 / 方法示意，不伪装运行截图

## 本地预览与验证

```bash
node scripts/verify-site.js
```

部署到 `gh-pages` 分支前运行验证，检查文件完整性、链接有效性、图片存在性与核心内容。

## 维护范围

- `index.html`：单页全部 10 区块
- `styles/site.css`：暖纸色设计系统
- `scripts/site.js`：证据切换器、雷达筛选、滚动渐入
- `scripts/verify-site.js`：确定性检查
- `images/`：本地示意图（全部 AI 泛化 / 原型示意）
- `404.html` / `robots.txt` / `sitemap.xml`
- `.opencode/workflow/`：六阶段工作流产物

## 证据纪律

- 每张图标注 AI 泛化 / 方法示意
- 每个能力卡标注证据来源
- 案例区分我负责 / 系统协同
- 不公开联系方式、凭据、私有数据