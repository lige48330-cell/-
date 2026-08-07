# VALIDATION_CHECKLIST.md — 作品集网站变更验收

每次变更完成后逐项核对,全部 ✔ 才可提交。

## 结构

- [ ] `node scripts/verify-site.js` 输出 "Portfolio site verified."
- [ ] 必需文件齐全(index.html / projects 5 页 / 404.html / styles / scripts / robots.txt / sitemap.xml)
- [ ] 无死链:所有 href/src 指向存在的本地文件
- [ ] 无 banned 项目引用(smartagri / career-ops / codex-cont 等)

## 内容

- [ ] 每个案例条目有证据等级标注(推进中 / 工具化实验 / 可运行原型 / 研究记录)
- [ ] 无模糊措辞(可能 / 大概 / 视情况 / TBD / TODO)
- [ ] 不公开个人联系方式与源码仓库
- [ ] 示意图未被描述为运行截图

## 资源

- [ ] 图片全部来自 images/(无外部 URL)
- [ ] 新增页面已登记 sitemap.xml 与 verify-site.js

## 部署前

- [ ] data-site-version 与当日一致
- [ ] 本地预览 http://127.0.0.1:4173/-/ 各页面 200
