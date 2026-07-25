# pr24-review-fixes-plan 进度面板

| 任务/步骤名称 | 任务状态 | commit 信息与哈希值 |
|---|---|---|
| 1. .gitignore 锚定 dist 规则 + 提交 public/vditor 资源（修复 P1 资源未入库） | 完成 | fix: anchor dist gitignore rule and commit vendored vditor runtime assets — b34c279 |
| 2. markdown 转换期表格包装（table_open/table_close）+ PostContent 宽表格样式恢复（修复 P1 宽表格回归） | 完成 | fix: restore wide-table scrolling via render-time .table-block wrapper — d21844d（键盘滚动依赖可聚焦 overflow 容器的浏览器原生行为，未写 JS） |
| 3. 显式覆写 validateLink（放行 data:image 白名单）+ 脚本断言验收（修复 P2 声明与行为不一致） | 完成 | fix: make validateLink URI policy explicit, allow data:image bitmaps — aec35e4（10/10 断言通过：data:image/png、webp 放行，svg/data:text/html/javascript/vbscript/file 拦截） |
| 4. mermaid ID 改用模块级递增计数器（修复 P2 HTTP 环境 randomUUID 不可用） | 完成 | fix: replace crypto.randomUUID with module-level counter for mermaid ids — 62f5e17（普通 script 块承载模块级计数器，构建通过） |
| 5. 还原 src/.DS_Store 与 src/components/.DS_Store 无关二进制变更 | 完成 | chore: revert unrelated .DS_Store binary changes from the PR — 6f79dd6（`git diff origin/main...HEAD` 已无 DS_Store 变更） |
| 6. 干净 clone 验收（npm ci + /vditor 资源 200）+ 浏览器回归（编辑器/代码块/mermaid/图片放大/375px 宽表格） | 完成 | 验收记录：干净 clone `/tmp/pr24-clean-clone` npm ci + build 通过，preview 下 lute.min.js 200；dev 下 lute/zh_CN 均 200；详情页 3 个代码块（头部/复制/hljs）、mermaid SVG、表格包装（tabindex=0 role=region）；500px 下 2962px 宽表格收敛 460px 容器内可横滚、document 无溢出、可聚焦；1280px 表格与正文同宽；复制写入剪贴板成功；图片放大开/关正常；发帖页 Markdown 模式编辑器挂载（16 工具栏项、IR 模式、可编辑） |
| 7. records 更正 data URI 声明与补充修复记录 + PR #24 描述更新 | 完成 | docs: correct data URI security claim and record pr24 review fix round — 245c54d（PR 描述已同步：安全声明更正、图片放大范围说明、修复 commit 列表） |
