# GitHub 视觉方案参考

日期：2026-08-14

本次只参考公开仓库的视觉原则和交互机制，不复制实现代码或品牌资产。

## 参考项目

- [Magic UI](https://github.com/magicuidesign/magicui)：用小幅度入场、信号线和局部指针反馈制造层次；重点不是让整个页面持续发光。
- [Codrops OnScrollTypographyAnimations](https://github.com/codrops/OnScrollTypographyAnimations)：标题动效以排版节奏为主，动画不应破坏首屏可读性。
- [Codrops ScrollBasedLayoutAnimations](https://github.com/codrops/ScrollBasedLayoutAnimations)：布局变化保持位置连续，适合案例切换和筛选反馈。
- [Dopefolio](https://github.com/rammcodes/Dopefolio)：项目内容先成立，动画作为增强层；项目标题、摘要和 case study 入口始终可见。
- [leerob/leerob.io](https://github.com/leerob/leerob.io)：使用克制的中性底色、清晰文字层级和少量交互强调，避免把个人主页做成视觉演示场。

## 对当前作品集的结论

1. 取消高饱和蓝色作为主文字色。技术档案更适合深青绿作为结构色、砖红作为结果强调色、暖纸色作为背景。
2. 标题只保留一个关键词强调，避免整句变成蓝色块；当前标题使用深色主体 + “可运行”砖红 + 细青绿下划线。
3. 白底卡片上的文字必须走深色文本规则；深色信息带才使用浅色文本。已修复方案证据条与项目来源地图的旧主题冲突。
4. 鼠标反馈只作用于项目卡片和证据容器，使用轻微透视、边框和阴影，不使用自定义光标、拖尾或全屏粒子。
5. 动效必须服从证据阅读：触屏设备不启用指针效果，`prefers-reduced-motion` 下完全静态。

## 验收

- 主标题不再出现大面积高饱和蓝色。
- 页面不存在可见白底白字文本。
- 桌面端卡片在指针移动时有轻微反馈，移动端无横向溢出。
- 作品集在无 JavaScript 时仍然能读到核心项目和交付链。
