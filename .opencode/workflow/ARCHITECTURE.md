# ARCHITECTURE.md — 个人作品集网站 v2.0.0

## 1. 数据流图

本站为纯静态站,无后端服务。数据流=资源加载与页面导航:

```
浏览器 → GitHub Pages 静态托管(CDN 边缘)
   ├─ GET /-/            → index.html → styles/site.css + liquid-glass.css
   │                                    → scripts/site.js(增强,defer)
   │                                    → images/*.svg|lazy
   ├─ GET /-/projects/*.html → 案例详情页(共享同一套样式与脚本)
   ├─ GET /-/sitemap.xml | robots.txt | 404.html
   └─ 资源 404 → 404.html(指向首页)
```

对比 SPEC 基线(前端→proxy→路由→ORM→数据库):本站裁剪为"前端→静态资源层",无 proxy/ORM/数据库层。案例数据以 HTML 语义结构内联,无 API 请求,无动态渲染。

## 2. 通信协议规范(静态站适配)

- 响应格式:静态 HTML 文档,状态码由托管层保证(200/404);无 `{code, message, data, timestamp}` JSON 协议——该协议在 SPEC 技术栈(无后端)下不适用,此处显式声明裁剪。
- 状态码使用:页面存在=200;缺失路径=404.html(全站可访问,含指向首页的链接)。
- 分页:全站无列表 API,项目列表(主案例 3 + 次级 4)全部静态渲染,无分页需求;图片加载以懒加载替代分页式降载(loading=lazy + 显式宽高,防 CLS)。
- 错误处理:JS 异常不阻断页面(脚本全部 defer + 独立模块,异常捕获输出 console 不影响内容渲染);图片缺失以 CSS 背景兜底。

## 3. 组件层次结构

页面结构树(index.html):

```
html[data-site-version]
├─ head(meta/OG/canonical/样式/脚本)
├─ header.site-header
│   ├─ a.brand(返回首页)
│   └─ nav.main-nav(#capabilities #projects #evidence #contact)
├─ main
│   ├─ section.hero(eyebrow + h1 + lead + CTA + metric-strip + hero-panel)
│   ├─ section#capabilities(能力主线 ×4:capability-grid article)
│   ├─ section#projects
│   │   ├─ 主案例 ×3(project-card:image + kicker + h3 + status-note + link)
│   │   └─ 次级项目 ×4(project-card 精简版)
│   ├─ section#evidence(证据规则 ×5:method-list)
│   └─ section#contact(沟通原则 + contact-card)
└─ footer.site-footer(版权年 + 返回链接)
```

详情页结构树(projects/*.html,5 个):

```
article.case
├─ header(eyebrow + h1 + status-note)
├─ section.case-meta(技术栈标签/模块清单 dl)
├─ section.case-body(证据分级说明)
└─ footer(返回首页 + 相邻案例导航)
```

脚本模块(scripts/):

```
site.js(年份注入/锚点平滑) 独立无依赖
liquid-glass.js(玻璃动效,PointerEvents 能力检测,禁用时无行为)
verify-site.js(结构校验:断言节点存在,CI 用途)
```

样式模块(styles/):

```
site.css(设计变量+全站布局+响应式断点 980/760)
liquid-glass.css(backdrop-filter 玻璃层,fallback 纯色背景)
```

## 4. 防阻塞与稳定性策略

1. 资源防阻塞:全部样式/脚本本地化,零外链 CDN;页面首屏资源上限 250KB。
2. 渲染防阻塞:脚本 defer,JS 失败不影响 HTML 内容可读(渐进增强)。
3. 图片防阻塞:loading=lazy + width/height 显式声明,防布局偏移(CLS)。
4. 视觉防阻塞:liquid-glass 效果含 PointerEvent/CSS backdrop-filter 能力检测,不支持时回退为半透明纯色,不抛错。
5. 降级策略:无 JS 环境页面完整;移动端 760px 单列;高对比度颜色(正文 #f4f1e8 对 #0e1412,对比度 >12:1)。
6. 导航兜底:每个详情页含返回首页链接;404.html 提供首页入口,避免死链。

## 5. 组件层次与数据契约

- 数据以内联 HTML 语义结构承载(article/h3/dl),无 JSON 注入层;SPEC 中的 project/capability/evidence_rule/contact 四实体映射为固定 HTML 模式。
- 案例卡片模式:image + kicker(技术栈标签) + title + status-note(证据等级) + description + text-link(详情页)。
- 证据等级枚举(与 SPEC 一致):推进中 / 工具化实验 / 可运行原型 / 研究记录。

## 6. 配置与路由表

| 路径 | 文件 | 说明 |
| --- | --- | --- |
| /-/ | index.html | 首页 |
| /-/projects/esp32-iot-platform.html | 详情页 | ESP32 IoT 平台 |
| /-/projects/ai-supervisor.html | 详情页 | AI Supervisor |
| /-/projects/aquaculture-prototype.html | 详情页 | 水产养殖套件 |
| /-/projects/profile-miniapp.html | 详情页 | 开发服务小程序 |
| /-/projects/ea-research.html | 详情页 | XAU 交易研究 |
| /-/404.html | 错误页 | 404 兜底 |
| /-/sitemap.xml | SEO | 全站页面清单 |
| /-/robots.txt | SEO | Allow all + Sitemap |
