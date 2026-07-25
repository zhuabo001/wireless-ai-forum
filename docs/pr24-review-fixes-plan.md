# PR #24 Code Review 修复计划

**日期**: 2026-07-25

**分支**: `feat/post-detail-markdown-rendering`（在现有 PR 分支上继续提交）

**评审来源**: `docs/handoff/pr24-code-review-comment.md`（审查提交 `5e601f7`，基线 `384b7a8`）

**关联文档**: `docs/post-detail-markdown-rendering-plan.md`、`records/post-detail-markdown-rendering-2026-07-22.md`

## 背景

PR #24（贴文详情 markdown 渲染重构）经本地 code review 发现 2 个阻断合并问题（P1）、2 个需修复问题（P2）及若干清理建议。已逐条对照代码核实，**全部属实**，本计划为对应修复方案。

## 已确认的两项决策

1. 新建本 plan 文档（非复用 handoff 文档作为计划）。
2. P2-1 data URI 策略：**放行 `data:image/*`**（markdown-it 上游默认白名单 `png|gif|jpeg|webp`），理由：`MarkdownEditor.vue` 未配置 upload handler，Vditor 粘贴图片默认即生成 base64 data URI，禁掉会导致用户粘贴图片在详情页消失；data 位图不可执行脚本，风险仅为体积/追踪。同时把实施记录/PR 描述中"拦截 data: 链接与图片"的不准确声明更正，并用显式 `md.validateLink` 覆写将策略固化为代码。

## 修复项与方案

### 1.（P1）Vditor 离线资源未纳入版本控制

**问题**：`.gitignore` 第 3 行未锚定的 `dist` 忽略 `public/vditor/dist/**`，1d692b9 提交时 `git add` 静默跳过全部约 8.5MB 资源。干净 clone 后 `/vditor/dist/**` 全部 404，编辑器初始化卡死。

**方案**：
- `.gitignore`：`dist` → `/dist`（锚定根目录，仅忽略构建产物；`node_modules` 已有独立规则，无连带影响）。
- `git add public/vditor/` 提交全部资源。
- 验收：临时目录干净 clone + `npm ci` + 启动，访问 `/forum/new-topic`，网络面板 `/vditor/dist/**` 全部 200，编辑器可输入、可读取初始 modelValue。

### 2.（P1）删除 TableBlock 引入宽表格回归

**问题**：基线 `TableBlock.vue` 提供 `overflow-x:auto` 容器、`width:max-content; min-width:100%`、`min-inline-size:8rem`、`white-space:nowrap`、tabindex 键盘滚动；当前仅剩 `.article-body table { width:100% }`，多列表格被压回正文宽度逐字换行，移动端无独立滚动区。

**方案**（转换期生成包装结构，与代码块头部栏同一思路，不做运行时 DOM 扫描）：
- `src/utils/markdown.ts`：覆写 `renderer.rules.table_open` / `table_close`，输出 `<div class="table-block" role="region" aria-label="可横向滚动的文章表格" tabindex="0"><table>` … `</table></div>`。
- `src/pages/forum-post-detail/PostContent.vue`：恢复等价样式——`.table-block { width:100%; max-width:100%; margin:1.25rem 0; overflow-x:auto; overscroll-behavior-inline:contain; -webkit-overflow-scrolling:touch; }`、`:focus-visible` 轮廓、`.table-block table { width:max-content; min-width:100%; margin:0; }`、`th/td { min-inline-size:8rem; white-space:nowrap; }`。
- 键盘滚动不写 JS：`tabindex="0"` + `overflow-x:auto` 的可聚焦容器由浏览器原生支持方向键滚动（基线的 48px 步进 handler 是重复造轮子）。
- 验收：375px 下 `document` 无横向溢出、表格容器内可横滚、中文/长英文标识符/数字不逐字换行；1024px 及宽屏下表格与正文同宽。

### 3.（P2）data URI 策略固化 + 文档更正

**问题**：实施记录声称默认 `validateLink` 拦截 `data:` 链接与图片，实测 `![x](data:image/png;base64,...)` 被放行（默认白名单四种位图格式），`javascript:` 与 `data:text/html` 链接均被正确拦截。声明与行为不一致。

**方案**（按决策 2）：
- `src/utils/markdown.ts`：显式覆写 `md.validateLink`——放行 `data:image/png|gif|jpeg|webp`，其余非常见 scheme（`javascript:`/`vbscript:`/`file:`/其他 `data:`）一律拦截，附注释说明业务理由（Vditor 粘贴图片依赖 data URI）。
- 更正 `records/post-detail-markdown-rendering-2026-07-22.md` 第 43 行安全决策表述；PR 描述同步更正。
- 验收：脚本断言 `data:image/png` 图片放行、`javascript:` 图片/链接拦截、`data:text/html` 链接拦截、`https:` 正常放行。

### 4.（P2）HTTP 内网 `crypto.randomUUID()` 导致 mermaid 降级

**问题**：`PostContent.vue:111` 使用 `crypto.randomUUID()`，仅安全上下文可用；HTTP 内网部署抛错 → mermaid 全部降级为源码展示（与组件已为 `navigator.clipboard` 做的 HTTP 防御不一致）。

**方案**：模块级递增计数器 `let mermaidIdSeed = 0`，ID 改为 `` `mermaid-${++mermaidIdSeed}` ``（页面内唯一性足够，不依赖任何环境 API，且避免失败重试时 ID 复用）。
- 验收：无 `crypto.randomUUID` 的环境下 mermaid 仍产出 SVG；语法错误的 mermaid 仍正确回退源码展示。

### 5.（清理）移除无关 .DS_Store 二进制变更

**问题**：`git diff origin/main...HEAD` 显示 `src/.DS_Store`、`src/components/.DS_Store` 两个无关二进制变更混入 PR。

**方案**：`git checkout origin/main -- src/.DS_Store src/components/.DS_Store` 还原，PR diff 即消失（不动本地其他未提交文件）。

### 6. 整体验收

- 干净 clone 验收（见任务 1）。
- 浏览器回归：详情页代码块（高亮/语言标识/复制）、mermaid、图片放大预览、375px 宽表格、发帖页编辑器。
- `npm run build` 通过。

### 7. 文档与 PR 收尾

- 更新 `records/post-detail-markdown-rendering-2026-07-22.md`：更正 data URI 安全声明（任务 3 内容）、补充本轮 review 修复记录。
- 更新 PR #24 描述：补充图片点击放大功能的范围说明（review 非阻断建议）、更正安全声明、附本轮修复 commit 列表。

## 不做的事

- 不修改与 review 无关的代码；不触碰本地未提交的无关文件（`Bn`、`refactor-chat.txt` 等）。
- 图片点击放大功能保留在本 PR（评审建议拆分，但该功能是需求方明确追加的），仅以 PR 描述说明范围。
- 不引入运行时 DOM 扫描（表格包装在转换期生成，与既有架构一致）。

## 任务分解（与 progress 面板对应）

| # | 任务 | 产出 |
|---|------|------|
| 1 | .gitignore 锚定 + 提交 public/vditor 资源 | `.gitignore`、8.5MB vendored 资源入库 |
| 2 | 表格包装结构 + 宽表格样式恢复 | `markdown.ts`、`PostContent.vue` |
| 3 | validateLink 显式策略 + 断言验收 | `markdown.ts` |
| 4 | mermaid ID 计数器 fallback | `PostContent.vue` |
| 5 | 还原 .DS_Store 变更 | 2 个文件恢复基线 |
| 6 | 干净 clone + 浏览器回归验收 | 验收记录 |
| 7 | records 更正 + PR 描述更新 | records 文档、PR #24 描述 |
