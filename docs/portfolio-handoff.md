# 作品集交接说明

## 当前目标

把个人作品集做成可信、可投递、具有辨识度的 AI Agent 工程与系统交付展示。必须突出：AI Agent 工程、需求分析与原型、ERP、ESP32 / IoT、小程序端云协同、全栈交付、团队协调和验收交接。

## 仓库与发布

- 源站：`D:\2\pojie\portfolio`，分支 `main`
- Pages：`D:\2\pojie\portfolio-gh-pages`，分支 `gh-pages`
- GitHub：`git@github.com:lige48330-cell/-.git`
- 线上：`https://lige48330-cell.github.io/-/`
- 最新已发布：`7a1bda6`（`gh-pages`）
- 最新源站提交：`27230ca`（`main`）
- 最新线上缓存 URL：`https://lige48330-cell.github.io/-/?v=7a1bda6`

## 已完成

### 定位与内容

- 首屏定位：`FDE / Forward Deployed Engineer`
- 主叙事：`把现场问题，推进成可运行、可交接的系统。`
- AI 的位置：交付放大器，不作为职位名称前缀。
- 主标题：`把现场问题，推进成可运行、可交接的系统。`
- 核心证据：养殖渔业 ERP、消毒除臭设备 IoT 监管、Cockpit Tools 私有化 Codex / AI IDE 桌面工作台。
- 公司项目始终以“真实项目截图 · AI 辅助脱敏”展示，源码不公开。

### 视觉与交互

- 已从黑色低对比主题改为明亮冷白工程编辑风格。
- 真实项目截图取消暗色滤镜，固定为 16:9 媒体舞台，避免裁剪和布局跳动。
- ERP / IoT / 小程序 tab 支持鼠标点击、方向键、Home / End。
- 已实现一次性滚动揭示、顶部阅读进度、案例切换扫描线、轻微图片 hover、原生 View Transition 渐进增强。
- 首屏只做位移动画，标题和 CTA 始终可读。
- `prefers-reduced-motion` 下所有装饰动画静态降级。

### FDE 改版与简历

- 新增 `fde.css`：克制的纸张、工程蓝、严格网格、证据优先的视觉系统，覆盖旧暗色主题。
- 新增 `resume.html`：可编辑、可打印、A4 友好的 FDE 中文简历。
- 新增 `docs/fde-positioning-brief.zh-CN.md`：定位、证据结构、主案例排序和验收标准。
- 首页新增简历入口，首页与简历统一使用现场问题 → 交付链 → 证据边界的叙事。
- 修复旧主题造成的白底白字：方案证据条和 IoT / Agent 来源列现在使用明确的深色背景与高对比文本。
- 主标题改为黑色主体 + 暖色关键词 + 细蓝色强调；桌面卡片增加轻微指针透视反馈，手机与 reduced-motion 自动关闭。

## 动效研究

研究记录：`D:\2\pojie\portfolio\docs\animation-portfolio-github-research.md`

参考 GitHub 的 Magic UI、Codrops OnScrollTypographyAnimations、Codrops ScrollBasedLayoutAnimations 与 Dopefolio。结论：不引入 GSAP、Lenis、Three.js 等依赖；不使用自定义光标、滚动劫持、无限 marquee、全屏粒子或文字 blur。

## 本次接手已完成

技术链 SVG 已补齐静态轨道与一次性脉冲：

```html
<svg class="tech-chain-signal" viewBox="0 0 100 16" preserveAspectRatio="none" aria-hidden="true">
  <path class="tech-chain-signal-base" d="M1 8H99" pathLength="1" />
  <path class="tech-chain-signal-run" d="M1 8H99" pathLength="1" />
</svg>
```

已完成事项：

1. `portfolio-premium.css` 定义静态轨道和 `stroke-dashoffset` 脉冲。
2. `portfolio.js` 使用 `IntersectionObserver` 只触发一次，reduced-motion 下静态降级。
3. 桌面与 390px 手机端验证通过，无横向溢出。
4. 资源版本号升级为 `20260814d`，用于避免旧 CSS / JS 缓存。

接手后应继续关注线上复核和新需求，不要重复实现这条 SVG 动效。

## 验证命令

在 `D:\2\pojie\portfolio-gh-pages`：

```powershell
node scripts\verify-site.js
node --check portfolio.js
git diff --check
```

还应检查：

```powershell
git status --short --branch
```

浏览器验收：桌面 `1440x900`、手机 `390x844`、项目 tab、键盘切换、无横向溢出（`scrollWidth <= innerWidth`）、线上资源版本号正确。

## 安全和证据边界

- 不公开公司 ERP、ESP32 固件、小程序源码、账号、密码、手机号、API Key、Bearer Token、业务数据或内部地址。
- 只公开已允许开源的个人项目；公司项目只展示脱敏截图、职责、技术链与可面试说明。
- 不伪造量化结果，不使用无法被源码、测试、截图或文档支撑的“主导”“全链路”等表述。
- `CodexCont`、`Code Control Stack`、安全 RAG 等研究不是主招聘证据，只能按现有证据等级陈述。

## 主要文件

- 首页：`D:\2\pojie\portfolio\index.html`
- 样式：`D:\2\pojie\portfolio\portfolio-premium.css`
- FDE 样式：`D:\2\pojie\portfolio\fde.css`
- 简历：`D:\2\pojie\portfolio\resume.html`
- 交互：`D:\2\pojie\portfolio\portfolio.js`
- Pages 校验：`D:\2\pojie\portfolio-gh-pages\scripts\verify-site.js`
