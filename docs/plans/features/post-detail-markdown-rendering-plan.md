# 贴文详情 Markdown 渲染重构 plan

## 背景与问题

当前贴文详情页（`forum-post-detail`）存在架构性渲染问题：

1. **没有 markdown 渲染管线**：发帖页 `MarkdownEditor.vue` 产出 markdown 字符串，但详情页 `PostContent.vue` 接收的是手工预切好的 `ContentBlock[]`（`html` 字段假定已是转好的 HTML），两者之间不存在任何 markdown 解析器。原始 markdown 的 ` ``` ` 代码围栏进入组件后会掉到 `<p>` 兜底分支，换行缩进被 HTML 空白折叠压成一行。
2. **代码块 `v-html` 未转义**：`PostContent.vue:18` 中 `<pre><code v-html="block.html"></code></pre>`，代码内容含 `<`、`>`、`&` 时会被浏览器当作标签解析，内容被吞、结构崩坏，且存在 XSS 风险。
3. **无语法高亮、无语言标识、无复制按钮**：与编辑器预览观感落差大。
4. **样式瑕疵**：`.article-body code` 的 `font-size: 0.875em` 在 `pre code` 嵌套下二次缩小（约 0.77rem）。

## 对齐基准（内部实际项目现状）

- 编辑器使用 **Vditor**（本仓库目前用的 md-editor-v3 需同步替换）。
- 详情页数据来自后端 API，`page.content` 是**整段 HTML 字符串**，整体渲染，不做 markdown 的 blocks 拆分。
- 详情组件对**内嵌图片 / mermaid 做挂载后二次解析**。
- 内部项目同样不存在 markdown → blocks 的转换逻辑。

## 已确认的方案决策（与开发者逐项确认）

1. 发帖编辑器 `md-editor-v3` → **Vditor**，本仓库同步更换。
2. 详情数据模型 `ContentBlock[]` → **整段 HTML 字符串**（`page.content` 风格）；mock 层以 markdown 原文为源，用 markdown-it 转换，模拟后端返回。
3. 代码块增强（语言标识 + 复制按钮）采用**转换期生成头部栏结构**（markdown-it 自定义 fence 渲染规则），Vue 侧只挂事件委托，不做渲染后 DOM 扫描。
4. **保留 mermaid / 内嵌图片的挂载后二次解析**能力；plantuml 维持现有 fallback 行为（KrokiDiagram 留待后续迭代，见 `DiagramBlock.vue` 注释）。

## 技术设计

### 渲染链路（改造后）

```
markdown 原文（数据层，模拟编辑器提交内容）
  → markdown-it + highlight.js 转换为整段 HTML（模拟后端 page.content）
  → PostContent.vue 整段 v-html 渲染
  → onMounted 二次解析：mermaid 渲染、代码块复制按钮事件委托
```

### 代码块 HTML 结构（转换期生成）

```html
<div class="code-block" data-lang="js">
  <div class="code-header">
    <span class="code-lang">JavaScript</span>
    <button class="code-copy-btn" type="button">复制</button>
  </div>
  <pre><code class="hljs language-js">...已转义并高亮...</code></pre>
</div>
```

- fence 内容经 hljs 高亮（内部完成 HTML 转义），未识别语言时纯转义输出。
- 复制行为：`.article-body` 容器上挂 click 事件委托，命中 `.code-copy-btn` 时取同 `.code-block` 内 `pre code` 的 textContent 写入剪贴板，按钮文案短暂变为"已复制"。

### mermaid 二次解析

- ```mermaid 围栏 → 转换期输出占位结构（隐藏 source + 渲染容器）。
- `PostContent.vue` 挂载后查找占位节点，复用现有 `MermaidDiagram.vue` 的动态 `import('mermaid')` + `mermaid.render` 方案渲染 SVG；失败时回退展示源码。
- plantuml 围栏维持 fallback（展示转义后的源码），不新增 Kroki 依赖。

### 关键风险与对策

- **Vditor 静态资源**：Vditor 默认从 CDN 加载部分资源（emoji / hljs 主题 / mermaid 等），离线环境需评估 `cdn` 配置或将 dist 资源本地化；实现时验证 dev/build 两种模式。
- **Tailwind preflight 冲突**：preflight 清零了 `h1-h6`、`ul/ol` 默认样式，`.article-body` 已有对应样式，新增结构（代码头部栏等）样式需显式书写，不依赖浏览器默认值。
- **Vditor 体积**：全量依赖较大，mermaid/katex 等按需懒加载；编辑器页本就独立路由，配合路由级代码分割可接受。

## 任务拆分

| # | 任务 | 产出 |
|---|------|------|
| 1 | 依赖调整 | 卸载 md-editor-v3；安装 vditor、markdown-it、highlight.js、@types/markdown-it |
| 2 | 发帖页编辑器迁移 | `MarkdownEditor.vue` 迁移到 Vditor，保持 `v-model` API 不变 |
| 3 | markdown → HTML 工具 | `src/utils/markdown.ts`：markdown-it + hljs + 自定义 fence 渲染（代码头部栏 / mermaid 占位） |
| 4 | 数据层改造 | `forumPostDetail.ts`：markdown 原文 + 导出整段 `contentHtml` |
| 5 | 详情渲染组件改造 | `PostContent.vue`：整段 v-html + 复制事件委托 + mermaid 二次解析 |
| 6 | 样式完善 | hljs 主题、代码头部栏样式、`pre code` 字号修复、preflight 兼容 |
| 7 | 退役清理 | 移除 `DiagramBlock.vue`、`TableBlock.vue`、`ContentBlock` 相关类型与引用 |
| 8 | 构建与效果验证 | `vite build` 通过 + dev 页面实际效果核验 |
