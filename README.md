# Lige · FDE 技术交付档案

独立开源作品集。定位为 FDE（Forward Deployed Engineer / 现场交付工程师）：把现场问题推进成可运行、可交接的系统。

线上入口：`https://lige48330-cell.github.io/-/`

## 内容架构

- 10 区块单页架构：Hero → 价值主张 → FDE 交付链 → 能力画像 → 项目案例 → 工作台与 AI 工程 → Agent 工程方法 → 工程索引（项目地图 + 雷达） → 能力蒸馏 → 联系
- 暖纸色设计系统，零构建（HTML5 / CSS3 Custom Properties / Vanilla JS）
- 证据分级：公开开源 / 公司脱敏 / 私有改造 / 研究实验

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
- `images/`：本地示意图 + 脱敏案例截图
- `404.html` / `robots.txt` / `sitemap.xml`

## 证据与边界纪律

- 公司项目：真实截图经 AI 辅助脱敏，明示"脱敏案例 · 面试可讲"
- 私有改造与研究实验：仅提供方法、边界与面试说明
- 方法图明确标注 AI 泛化 / 示意，不伪装运行截图
- 每个能力卡标注证据来源
- 不公开联系方式、凭据、私有数据