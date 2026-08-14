# GitHub 动效作品集研究：特色、清晰度与低风险实现

## 结论先行

当前作品集不应继续增加全屏黑底、重模糊、滚动劫持或持续运动。更合适的方向是**明亮的技术编辑风格 + 真实项目图像 + 一条具有识别度的“交付链路动效”**。动效只承担三件事：建立浏览顺序、解释项目关系、反馈用户操作。

建议只实现以下 5 类机制，全部可用原生 HTML/CSS/JS 渐进增强，不引入动画框架：

1. 首屏按行遮罩揭示，而不是逐字乱跳或模糊文字。
2. 内容区用 `IntersectionObserver` 做一次性轻位移揭示。
3. 项目切换使用稳定布局上的交叉淡入，可选原生 View Transition 增强。
4. 技术链使用 SVG 路径脉冲，作为全站唯一“签名动效”。
5. 项目图只在精细指针设备提供局部磁性/视差反馈。

核心文字、项目截图和 CTA 在 JavaScript 失效、浏览器不支持新 API 或用户要求减弱动效时，都必须立即可见和可操作。

## 一手项目观察

### 1. Magic UI：小幅揭示和链路光束

- 仓库：[magicuidesign/magicui](https://github.com/magicuidesign/magicui)（MIT）
- `BlurFade` 源码：[blur-fade.tsx](https://github.com/magicuidesign/magicui/blob/main/apps/www/registry/magicui/blur-fade.tsx)
- `AnimatedBeam` 源码：[animated-beam.tsx](https://github.com/magicuidesign/magicui/blob/main/apps/www/registry/magicui/animated-beam.tsx)
- `Pointer` 源码：[pointer.tsx](https://github.com/magicuidesign/magicui/blob/main/apps/www/registry/magicui/pointer.tsx)
- `TextReveal` 源码：[text-reveal.tsx](https://github.com/magicuidesign/magicui/blob/main/apps/www/registry/magicui/text-reveal.tsx)

源码机制：`BlurFade` 将入场限制为约 `6px` 位移、`opacity` 和短时 `blur`，并只触发一次；`AnimatedBeam` 用 `ResizeObserver` 读取节点位置，生成 SVG 二次贝塞尔路径，再移动线性渐变；`Pointer` 隐藏系统光标并持续响应 `mousemove`；`TextReveal` 使用 `200vh` 高容器和 sticky 区域，把滚动进度映射到逐词透明度。

可借鉴：

- 把 `AnimatedBeam` 的“节点之间传递信号”改造成需求分析 → 原型 → 全栈实现 → Agent 协作 → 验收交付的技术链。原生版本只需 SVG `path`、一个渐变描边和 `stroke-dashoffset`/渐变位置动画。
- 入场位移保持在 `12–24px`，时长 `450–650ms`，一次触发。核心标题不要使用 blur，图片或次要标签最多使用 `2–4px` blur。

不应照搬：

- 不隐藏系统光标。自定义 pointer 会降低链接和文本选择的可预期性，触屏也没有 hover。
- 不使用 `200vh` 的逐词阅读动画。它延长阅读路径，在中文长句上尤其拖沓。
- 光束不应无限循环；进入视口后运行 1–2 次，随后停为静态结构线。

### 2. Codrops On-Scroll Typography：借鉴节奏，不照搬逐字特效

- 仓库：[codrops/OnScrollTypographyAnimations](https://github.com/codrops/OnScrollTypographyAnimations)（MIT）
- 核心源码：[src/js/index.js](https://github.com/codrops/OnScrollTypographyAnimations/blob/main/src/js/index.js)
- 依赖声明：[package.json](https://github.com/codrops/OnScrollTypographyAnimations/blob/main/package.json)

源码机制：项目使用 Splitting 拆分字符/单词，配合 GSAP ScrollTrigger 做位移、旋转、缩放、随机字符替换、模糊和 pin；同时用 Lenis 接管平滑滚动。其 effect 11 通过外层 `overflow: hidden` 包裹字符，再将字符从 `xPercent: 105` 移回，是最接近“编辑排版揭示”的方案。

可借鉴：首屏标题按**行**包裹遮罩，行内整体从 `translateY(105%)` 回到 `0`，三行错开约 `70–100ms`。中文不要按单字随机、旋转或打乱，避免标题在动画过程中不可读。

不应照搬：Lenis 滚动接管、滚动 pin、随机字符、逐字 blur/3D rotation。它们依赖更重，改变滚动手感，还会让招聘者必须等待文字恢复后才能阅读。

### 3. Codrops Scroll-Based Layout Animations：借鉴 FLIP 的“位置连续性”

- 仓库：[codrops/ScrollBasedLayoutAnimations](https://github.com/codrops/ScrollBasedLayoutAnimations)（MIT）
- 核心源码：[js/index.js](https://github.com/codrops/ScrollBasedLayoutAnimations/blob/main/js/index.js)

源码机制：代码先临时添加目标布局类，用 GSAP Flip 捕获终态，随后移除类并在 `ScrollTrigger` 的 300% 滚动区间中插值到终态；同时集成 Lenis。

可借鉴：项目筛选或案例切换时，让旧图和新图保持空间连续性，而不是整块页面重排。低风险原生实现是固定媒体舞台尺寸，切换 `active` 状态，以 `opacity + transform: scale(.985)` 交叉淡入；支持时再用 `document.startViewTransition()` 包住状态更新。

不应照搬：长距离 scroll pin、300% 滚动控制布局、运行时测量并重排大量图块。作品集的首要任务是快速比较项目证据，不是让用户完成一段滚动表演。

### 4. Dopefolio：动画之外必须保留内容骨架

- 仓库：[rammcodes/Dopefolio](https://github.com/rammcodes/Dopefolio)（GPL-3.0）
- 内容结构说明：[README.md](https://github.com/rammcodes/Dopefolio/blob/main/README.md)
- 原生交互：[index.js](https://github.com/rammcodes/Dopefolio/blob/main/index.js)

源码机制：主页以稳定的项目行呈现图片、标题、2–3 行摘要和 Case Study 链接；JavaScript 主要处理移动导航，核心项目内容不依赖动画才能阅读。

可借鉴：每个案例在静态状态下就应明确显示“问题、负责范围、系统能力、业务价值、证据/边界”，并保持真实截图为第一视觉证据。特殊动效应叠加在这个可读骨架上，而不是替代它。

注意：Dopefolio 是 GPL-3.0；本项目只借鉴信息架构，不复制其实现代码或样式。

## 推荐落地机制

### A. 首屏行级遮罩揭示

目标：第一眼有设计感，同时标题从第 0 帧就保留语义和布局。

- HTML 以自然语义标题为主体，每一视觉行增加一个 `overflow: clip` 包裹层。
- CSS 初态只设置在 `.js` 已启用且不要求减弱动效时；JS 就绪后再启动动画，避免脚本失败导致正文永久透明。
- 使用 `transform` 和 `opacity`，总时长控制在 800ms 内。
- 标题不模糊、不逐字、不随机；强调词可在揭示结束后做一次下划线或色块横向展开。

### B. 一次性滚动揭示

目标：建立段落浏览节奏，而不改变原生滚动。

- 用 `IntersectionObserver` 观察 section、项目标题和媒体；进入视口后增加 `.is-visible` 并 `unobserve`。
- 只动画 `opacity` 和 `transform`；位移不超过 `24px`。
- 同组卡片最多 4 个 stagger，每个间隔 `50–80ms`，不要让页面尾部持续排队播放。
- 文字先于图片或与图片同时出现，不能先给空白容器再延迟展示证据。

`IntersectionObserver` 的官方说明强调它异步观察目标与视口/祖先的交叉状态，适合替代主线程上的持续几何轮询：[MDN Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)。

### C. 项目舞台切换

目标：让 ERP、IoT、小程序和 Agent 工程案例像一套可比较的产品证据，而不是普通卡片墙。

- 左侧/上方用可聚焦的项目索引，右侧/下方保持固定 `aspect-ratio` 媒体舞台。
- 点击和键盘切换时，旧图 `opacity: 1 → 0`、`scale(1) → scale(.985)`，新图反向进入；标题和 3 个事实字段同步更新。
- DOM 更新可由 `document.startViewTransition(update)` 渐进增强；API 不存在时直接更新 class，功能不受影响。
- 移动端改为纵向项目列表或原生横向 scroll-snap，不隐藏项目信息。

原生 View Transition 会捕获更新前后的页面快照并在伪元素树中过渡；官方文档也展示了先判断 API 再回退到普通 DOM 更新的方式：[MDN `startViewTransition`](https://developer.mozilla.org/en-US/docs/Web/API/Document/startViewTransition)。

### D. 技术链 SVG 脉冲

目标：形成区别于通用作品集模板的唯一签名动效，并直接解释能力如何形成交付结果。

- 节点内容始终静态可读，SVG 只作为 `pointer-events: none` 的装饰层。
- 路径按实际节点中心连接；桌面可用 `ResizeObserver` 更新路径，移动端使用预设纵向路径以减少测量。
- 进入视口后让高亮描边沿路径运行 1–2 次，节点依次点亮；结束后保留低对比度静态线。
- 动画必须对应真实语义顺序，不能只做无意义发光边框。

原生 Web Animations API 可直接控制关键帧、时序与取消，适合在 section 入场时运行并在离开或减弱动效时取消：[MDN Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)。

### E. 局部鼠标反馈

目标：桌面端显得精细，但不改变系统光标或移动端布局。

- 仅在 `(hover: hover) and (pointer: fine)` 下启用。
- 项目媒体内层根据指针位置做最多 `4–6px` 位移或 `1–2deg` 轻微倾斜，并通过 `requestAnimationFrame` 合并更新。
- 离开时归零；CTA 仍使用标准链接/按钮 hover 与清晰 focus-visible。
- 不对正文、导航和整个页面使用跟随光标圆形、拖尾或吸附。

## 清晰度、性能与无障碍边界

### 必须提供 reduced-motion

```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

更稳妥的实现还应在 JS 中检查 `matchMedia('(prefers-reduced-motion: reduce)')`，不创建 SVG 脉冲、鼠标视差和 Web Animations 实例。该媒体特性反映用户在系统中减少非必要运动的设置：[MDN `prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)。

### 动画属性预算

- 首选 `transform` 和 `opacity`；避免在滚动过程中动画 `width`、`height`、`top`、`left`、大面积 `filter: blur()`。
- `will-change` 只在动画前短时设置，完成后移除，不要全站常驻。
- 图片使用明确尺寸/`aspect-ratio`，避免解码后布局跳动。
- 不接管滚轮，不做长时间 sticky/pin，不让进入动画遮挡正文超过约 800ms。

Chrome/web.dev 的性能指南同样建议优先使用不触发布局或绘制的属性，并特别列出 `transform` 与 `opacity`：[How to create high-performance CSS animations](https://web.dev/articles/animations-guide)。

### 应避免的效果

- 大面积黑色背景、低对比灰字、文字 blur：直接损害用户已反馈的清晰度问题。
- 无限 marquee、闪烁边框、粒子雨、全屏 Canvas：持续抢占注意力，也难与项目价值建立关系。
- 自定义光标和拖尾：影响标准交互预期，在触屏设备无意义。
- 滚动劫持、横向滚动章节、长距离 pin：浏览者难以快速定位证据。
- 每个 section 都使用不同动画语言：会形成 demo 集合，而不是专业作品集。
- 动画承载关键信息：任何关键信息都必须在动画关闭后完整存在。

WCAG 对自动开始、持续超过 5 秒且与其他内容并列的移动内容要求提供暂停、停止或隐藏机制；因此本作品集不应使用无法停止的持续装饰动画：[WCAG 2.1 Understanding 2.2.2](https://www.w3.org/WAI/WCAG21/Understanding/pause-stop-hide.html)。

## 建议实施顺序与验收

1. 先恢复明亮高对比配色、正文清晰度和真实截图尺寸，验证 1440×900 与 390×844；此时即使无动画也必须成立。
2. 添加首屏行级揭示与一次性 section reveal；禁用 JS 后复查所有内容仍可见。
3. 实现项目舞台切换，验证点击、Tab/Enter、浏览器不支持 View Transition 三条路径。
4. 最后添加技术链 SVG 脉冲，作为唯一持续辨识点；`prefers-reduced-motion` 下完全静态。
5. 在移动端低速模式下检查无横向溢出、无 CLS、无文字遮挡；动画期间核心标题与项目结论始终可读。

这套方案的特色不来自“动画数量”，而来自一个明确叙事：项目证据被逐层揭示，技术链以信号路径连接，最终落到可运行、可验收、可交接的交付结果。
