# 项目复盘报告

> 项目：个人作品集网站 v2.0.0(业务流程数字化作品集)
> 范围：静态站重建 + 六阶段工作流(需求/架构/实现/稳定/复盘/验证)
> 日期：2026-08-07
> 分支：dev-changes(仓库 lige48330-cell/-)

---

## 1. 架构审计

### 1.1 技术栈清单

| 层 | 技术 | 版本/规范 | 用途 |
|----|------|------|------|
| 标记 | HTML5 | DOCTYPE html, zh-CN | 单页 + 5 详情页 |
| 样式 | CSS3 | Custom Properties + Grid | site.css + liquid-glass.css |
| 脚本 | Vanilla JS | ES2020+, defer | site.js / apply-liquid-glass.js |
| 校验 | Node.js | v24.13.0 | verify-site.js 确定性检查 |
| 部署 | GitHub Pages | 子路径 /-/ | 零构建,提交即产物 |

### 1.2 合理性评估

- **保留 v1 设计系统正确**:liquid-glass 视觉层 + 暗色主题是既有特色,重建仅更新内容与结构,避免无谓重写。
- **资产继承有风险**:GitHub 仓库是混合历史(v1 Next.js 残留 + 本机最新手写版),直接复制本机 assets 到克隆仓库时产生嵌套目录与遗留图片,清理成本约 20% 工作量。
- **工作流闸门需适配**:原 gates 面向 Express 项目(检查 prisma/路由/vite proxy),对静态站完全不适用;按阶段重写为静态站检查(文件存在/模糊词/死链/懒加载/断点/外链),保留闸门精神。

---

## 2. 设计失误

### 2.1 素材盘点先于动手

- **现象**：实施中才发现克隆仓库 images/ 含大量被屏蔽项目素材(smartagri/career-ops 等 13 个文件)与嵌套 images/images 目录
- **根因**：只探查了本机最新版目录(D:\AI\zz\portfolio),未先核对克隆仓库(GitHub 版)的内容差异
- **改进**：复制前先 diff 两棵目录树,明确"继承哪些、删除哪些"

### 2.2 复制策略

- **现象**：`Copy-Item src\images dst\images` 在目标已存在时把内容塞进 `dst\images\images`
- **根因**：未考虑目标目录存在性对 Copy-Item 行为的影响
- **改进**：目录同步一律先清空目标或用 robocopy;复制后立即列目录验证

### 2.3 verify-site.js 的 banned 词机制

- **现象**：v1 用字符串拼接(`"Smart"+"Agri"`)绕过源码内 banned 词自检查,间接证明"刻意排除项目"是作品集纪律的一部分
- **结论**：保留该机制,新增的上下文工程实验条目用研究记录口径呈现,不引用被排除项目

---

## 3. 代码错误(踩坑汇总)

| # | 现象 | 根因 | 修复 |
|---|------|------|------|
| 1 | gates 脚本找不到 lib/fuzzy-text.ps1 | PowerShell 路径拼接用了 `/` 分隔符,且 Copy-Item 展平了 lib 子目录 | 改 `\` 分隔 + 重建 lib/ 目录 |
| 2 | `$home = Get-Content ...` 报只读变量 | PowerShell 内置 `$HOME` 环境变量为只读 | 变量改名 `$homeContent` |
| 3 | gate 正则引号解析失败 | 单引号未转义导致 ParserError | 简化正则,移除 `'` 字符类 |
| 4 | phase-4 误报外链 | canonical/OG 链接含自身 https URL | 检查范围收窄到 `rel="stylesheet"` |
| 5 | verify 报 images 缺文件 | 复制事故 + 旧图残留 | 清理嵌套目录,补拷 aquaculture-prototype-flow.svg |
| 6 | 404 页无样式 | site.css 缺 .not-found-* 类 | 补充 12 行样式 |

---

## 4. AI 盲区/未预见项

### 4.1 Copy-Item 目标目录已存在的语义差异

- **遗漏**：`-Recurse` 复制到已存在目录时按"合并"处理,产生嵌套
- **改进**：目录级复制前先验证目标状态,复制后立即 Get-ChildItem 验证

### 4.2 PowerShell 全局只读变量冲突

- **遗漏**：`$home`、`$error` 等内置变量不可赋值
- **改进**：脚本变量统一使用项目语义前缀(如 `$homeContent`)

### 4.3 克隆仓库与本地最新版不同步

- **遗漏**：GitHub 仓库(11 提交)是 v1 混合历史,本机 D:\AI\zz\portfolio 是 v1 后期手写版
- **改进**：以"本机最新版为内容基准 + GitHub 仓库为提交目标"双源策略,先列差异再动手

---

## 5. 改进策略汇总

| 领域 | 问题 | 改进策略 | 优先级 |
|------|------|----------|--------|
| 流程 | 素材盘点不全 | 复制前 diff 源/目标目录树 | P1 |
| 流程 | 复制事故 | 清空目标后复制 + 复制后验证 | P1 |
| 工具 | gates 静态站适配 | 沉淀静态站 gate 模板到本仓库 .opencode/gates | P2 |
| 工具 | 404 样式缺失 | 已补齐,纳入 verify-site.js 断言(后续) | P2 |
| 内容 | 次级条目证据 | XAU 研究/上下文工程实验按研究记录口径持续补数据 | P2 |
