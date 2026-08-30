# 作品集交接说明

## 当前目标

把个人作品集做成可信、可投递、具有辨识度的 AI Agent 工程与系统交付展示。必须突出：AI Agent 工程、需求分析与原型、ERP、ESP32 / IoT、小程序端云协同、全栈交付、团队协调和验收交接。

## 仓库与发布

- 源站：本仓库 `main` 分支
- Pages：独立发布工作树的 `gh-pages` 分支
- GitHub：`git@github.com:lige48330-cell/-.git`
- 线上：`https://lige48330-cell.github.io/-/`
- 本轮源站提交：`5e2f0c6`（`main`）
- 本轮 Pages 发布提交：`79071fd`（`gh-pages`）
- 线上核验地址：`https://lige48330-cell.github.io/-/?v=79071fd`

## 已完成

### 定位与内容

- 首屏定位：`FDE / Forward Deployed Engineer`
- 主叙事：`进入业务现场，跨栈推进系统交付。交得出，验得清，接得住。`
- AI 的位置：交付放大器，不作为职位名称前缀。
- 主标题：`进入业务现场，跨栈推进系统交付。交得出，验得清，接得住。`
- 核心证据：养殖渔业 ERP、消毒除臭设备 IoT 监管、Cockpit Tools 私有化 Codex / AI IDE 桌面工作台。
- 新增公开第一证据：TraceRAG Agent（知识摄取、检索、路由、人工闸门、引用回答与 trace / handoff）。
- 公司项目始终以“真实项目截图 · AI 辅助脱敏”展示，源码不公开。
- 公开工程按“可运行 Agent / AI 基础设施 / 方法资产 / 业务原型”分层，避免把低价值原型当成主证据。
- `China Job Channels / 有界求职运营工作台` 已从折叠档案提升为公开项目矩阵的醒目本机证据，展示 Node Dashboard、Python 离线解析、JSONL 契约、状态真源、57 项 Python 测试和 8 个 JavaScript 检查脚本。

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
- 首页新增 TraceRAG 可交互 Demo 入口与技术链，首屏明确 FDE 的 Agent / 全栈交付方式。
- 修复旧主题造成的白底白字：方案证据条和 IoT / Agent 来源列现在使用明确的深色背景与高对比文本。
- 主标题改为黑色主体 + 暖色关键词 + 细青绿色强调；桌面卡片增加轻微指针透视反馈，手机与 reduced-motion 自动关闭。
- TraceRAG 区域使用独立浅色证据面板，展示 API、测试、人工闸门和架构图；不使用白底白字。
- `docs/trace-rag-primary-research.md` 汇总 RAG、工具授权、人工闸门、trace 与评测的一手资料，并逐项标出当前原型边界。
- 视觉参考后将高饱和蓝色替换为低饱和深青绿，砖红保留为关键词色，避免页面出现模板化蓝色字。

## 动效研究

研究记录：`docs/animation-portfolio-github-research.md`

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
4. 资源版本号升级为 `20260830b`，用于避免新增项目卡样式被旧 CSS / JS 缓存。

接手后应继续关注线上复核、项目边界和新需求，不要重复实现已有的 SVG 动效。

## TraceRAG Agent（本轮新增）

- 目录：`open-source/trace-rag-agent/`
- 公开入口：`demo.html`（GitHub Pages 可直接运行）
- 本地入口：`python run.py`，API 默认 `127.0.0.1:8788`
- 测试：`python -m unittest discover -s tests -v`
- 证据边界：纯 mock 运维知识，不连接真实模型、设备或公司系统。
- 技术链：业务问题 → 摄取 / 分块 → 检索 → Agent 路由 → 人工闸门 → 引用回答 → trace / handoff。

## China Job Channels（本轮新增）

- 首页入口：`#local-project`；详情页：`projects/china-job-channels.html`。
- 技术链：边界策略 → 浏览器受控执行 → Node Dashboard / Python collector → JSONL 规范化 → records 真源 → 预览与恢复。
- 验证：本机 `npm run check` 通过，包含 57 项 Python unittest 与 8 个 JavaScript smoke / E2E 检查脚本。
- 证据边界：不公开登录态、账号、Cookie、Token、原始采集结果或运行配置；只展示脱敏架构、状态契约和验证记录。

## 验证命令

在 Pages 发布工作树中：

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
- TraceRAG 的“可运行”仅指公开静态 Demo 与本地标准库 API，不能表述为线上生产系统或真实业务上线。
- `CodexCont`、`Code Control Stack`、安全 RAG 等研究不是主招聘证据，只能按现有证据等级陈述。

## 主要文件

- 首页：`index.html`
- 样式：`portfolio-premium.css`
- FDE 样式：`fde.css`
- 简历：`resume.html`
- 交互：`portfolio.js`
- Pages 校验：`scripts/verify-site.js`
