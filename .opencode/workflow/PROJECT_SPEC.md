# PROJECT_SPEC.md — 个人作品集网站 v2.0.0

## 项目概述

基于本机原创项目素材(D:\1 水产养殖套件、D:\2\ESP32 IoT 平台、D:\2\do AI Supervisor、D:\AI 研究与小工具),重做个人作品集静态网站,替换现有 v1.0.0(2026-07-14)。开发于仓库 lige48330-cell/- 的 dev-changes 分支,部署于 GitHub Pages(lige48330-cell.github.io/-/)。

## 技术栈(版本锁定)

| 层 | 技术 | 版本/规范 |
| --- | --- | --- |
| 标记 | HTML5 | DOCTYPE html, lang=zh-CN |
| 样式 | CSS3 | Custom Properties + Grid + Media Queries,无构建工具 |
| 脚本 | Vanilla JS | ES2020+, defer 加载,无框架无依赖 |
| 字体 | system-ui 栈 | 不加载外部字体文件 |
| 部署 | GitHub Pages 静态托管 | 保留 .nojekyll / robots.txt / sitemap.xml |
| 依赖 | 零 npm 依赖 | 无构建步骤,提交产物即线上产物 |

## 目录结构(约定)

```
portfolio-site/
  index.html                 # 首页(单页:hero/能力/主案例/次级/证据/联系)
  styles/site.css            # 主样式
  styles/liquid-glass.css    # 玻璃层效果
  scripts/site.js            # 页面增强(年份/交互)
  scripts/liquid-glass.js    # 玻璃动效
  scripts/verify-site.js     # 确定性结构检查
  projects/*.html            # 案例详情页(5 个)
  images/*.svg|png           # 案例示意图(全部本地)
  404.html                   # 404 页
  sitemap.xml / robots.txt   # SEO
  .opencode/STATE.json       # 工作流阶段状态
  .opencode/workflow/        # 六阶段产物(SPEC/ARCHITECTURE/STABILITY/RETROSPECT/CHECKLIST/ONE_CALL_TEMPLATE)
  .opencode/gates/           # 闸门脚本
```

## 核心约束(稳定性/安全/错误处理)

1. 无模糊表述:全站文案禁止模糊措辞(参照 fuzzy-text.ps1 禁用词表),每个案例必须标注证据等级(推进中/工具化实验/可运行原型/研究记录)。
2. 诚实边界:不公开个人联系方式与源码仓库;流程图为示意图,不伪装运行截图。
3. 本地资源:全部图片与样式为仓库内文件,零外链 CDN。
4. 渐进增强:禁用 JS 时页面内容完整可读,JS 仅负责增强。
5. 响应式断点:980px / 760px 两级降级,移动端单列布局。
6. 资源性能:图片显式宽高,懒加载(img loading=lazy),首页体积上限 250KB。
7. 路径约定:全站使用 /-/ 前缀(canonical 路径),与 GitHub Pages 子路径一致。
8. 错误页面:404.html 必须存在并指向首页。

## 数据结构定义(语义化数据模型)

站点数据以 HTML 语义结构内联(不引入 fetch,保证 file:// 与 Pages 均可直开),逻辑模型如下:

| 实体 | 字段 | 说明 |
| --- | --- | --- |
| project(案例记录) | id / title / kicker(技术栈标签) / evidence_level / status / description / image / link | 主案例 3 条 + 次级 4 条 |
| capability(能力主线) | seq / title / description | 4 条能力线 |
| evidence_rule(证据规则) | seq / title / description | 5 条边界规则 |
| contact(联系块) | policy / note | 不公开联系方式,仅声明沟通原则 |

project.evidence_level 枚举:推进中 / 工具化实验 / 可运行原型 / 研究记录。

## 关键配置

- canonical URL:https://lige48330-cell.github.io/-/
- 资源根路径:/-/(与 canonical 一致)
- robots.txt:Allow all + Sitemap 指向 /-/sitemap.xml
- 站点版本标记:html[data-site-version]="2026-08-07"

## 案例清单(素材来源:本机项目)

主案例:
1. ESP32 IoT 平台(D:\2\ESP32)— 智能消毒除臭设备监管平台,ESP32 固件(PlatformIO/Arduino)+ .NET 8 云平台(自研 MQTT Broker)+ uni-app 小程序;证据等级:推进中 / 部分可运行。
2. AI Supervisor(D:\2\do)— Python CLI 质量门禁,审查 AI agent 交付;证据等级:工具化实验(pytest 全通过)。
3. 智慧水产养殖应用套件(D:\1 APP+miniapp+server)— Vue3 H5 + uni-app 小程序壳 + Express/Prisma/SQLite;证据等级:可运行全栈原型(12 项 API 测试通过)。

次级项目:
4. 开发服务展示小程序(D:\AI developer-profile-miniapp)— 服务入口,uni-app。
5. AI Agent 编程学习平台(D:\2\item)— MVP 架构示范,FastAPI + Nuxt3。
6. XAU 黄金交易研究(D:\AI\EA)— MQL4 回测与研究记录。
7. 上下文工程实验(D:\2\破 code-control-stack)— Agent 行为控制对照实验(措辞按研究记录口径)。

## 交付物清单

1. index.html 首页(hero + 能力 4 + 主案例 3 + 次级 4 + 证据 5 + 联系)
2. 案例详情页 5 个(projects/esp32-iot-platform.html、ai-supervisor.html、aquaculture-prototype.html、profile-miniapp.html、ea-research.html)
3. liquid-glass 视觉层(liquid-glass.css/js)
4. verify-site.js 确定性检查脚本
5. 404.html、sitemap.xml、robots.txt
6. 六阶段工作流文档(.opencode/workflow/)
7. 提交并推送 dev-changes 分支
