# PROJECT_BRIEF.md — 个人作品集网站 v2.0.0

## 项目概述

个人作品集静态网站(业务流程数字化作品集),只展示已确认的原创项目与研究记录。部署于 GitHub Pages(lige48330-cell.github.io/-/),仓库 lige48330-cell/-。

## 核心规则

1. 每个案例必须标注证据等级:推进中 / 工具化实验 / 可运行原型 / 研究记录。
2. 不公开个人联系方式、源码仓库;不展示非原创项目。
3. 流程图为示意图,不伪装运行截图。

## 目录

- `index.html` 首页(hero + 能力 5 + 主案例 3 + 次级 4 + 证据 6 + 联系)
- `projects/` 详情页 5 个:esp32-iot-platform / ai-supervisor / aquaculture-prototype / profile-miniapp / ea-research
- `styles/site.css` + `liquid-glass.css`、`scripts/site.js` + `apply-liquid-glass.js`
- `scripts/verify-site.js` 确定性检查(必需文件/死链/banned 词/版本号/验证证据)
- `images/` 本地素材 6 个(SVG + PNG)
- 路径约定:`/-/` 前缀(GitHub Pages 子路径)

## 技术栈

HTML5 / CSS3 / Vanilla JS(ES2020+,零依赖)/ Node.js(仅本地验证)/ GitHub Pages 静态托管。

## 本地验证

```bash
node scripts/verify-site.js   # 结构校验
node scripts/serve-pages.js   # 本地预览 http://127.0.0.1:4173/-/
```
