# 论坛帖子正文图表渲染（Mermaid / PlantUML）— 开发计划

> **当前迭代（2026-07-04）：仅实现 Mermaid 渲染。PlantUML/Kroki 步骤标记为 "deferred"，保留在本文档供后续参考。**

## Context

当前 `src/pages/forum-post-detail/PostContent.vue` 渲染帖子正文时，`ContentBlock` 只有 6 种类型（`paragraph`/`heading`/`list`/`code`/`blockquote`/`table`），所有 `type: 'code'` 的块无论内容是普通代码还是 Mermaid/PlantUML 图表源码，都统一走：

```html
<pre v-else-if="block.type === 'code'"><code v-html="block.html"></code></pre>
```

即原样输出为文本代码块，不做任何图形化渲染。这是用户反馈"Mermaid 图未生效、仍显示为一串代码"的根因。

本次需求扩展为：正文中除了 Mermaid，未来还可能出现 PlantUML / 其他 UML 类图表，因此不按单一引擎（如 `mermaid`）硬编码，而是抽象出一个可扩展的 `diagram` 分类，按 `engine` 字段分发到不同渲染策略：

- **Mermaid**：纯前端渲染，`mermaid.js` 直接把文本解析为 SVG，无需服务端参与。
- **PlantUML**：无法在浏览器本地渲染，必须依赖服务端编译（Java + Graphviz）。选择接入 **Kroki**（`https://kroki.io`）—— 一个开源统一图表渲染服务，一份 HTTP 接口即可支持 PlantUML、Mermaid（备用）、Graphviz、Ditaa 等十余种图表格式，后续再新增图表引擎时不需要重新接一套渲染逻辑。

> **需要开发者确认的风险点（务必先确认再开始 Step 5）**：PlantUML 渲染方案会把帖子正文中的图表源码发送给 **第三方公共服务** `kroki.io`（浏览器直接发起 HTTP 请求，非本项目服务器代理，因为项目目前没有后端）。如果正文可能包含未公开的内部技术细节，这里存在数据外发风险。可选替代方案：
> 1. 继续使用 kroki.io 公共实例（最简单，但数据出域）；
> 2. 自建 Kroki / PlantUML Server（Docker 部署），前端改为请求自建地址（数据不出域，但需要新增后端基础设施，超出当前纯前端项目范围）；
> 3. 仅支持 Mermaid，PlantUML 先降级为纯代码块展示，本期不做（保守方案）。
>
> 本计划默认按方案 1（kroki.io 公共实例）编写，**如果开发者选择方案 2 或 3，请在开发前调整本文档对应步骤**。

## 文件清单

| # | 文件 | 说明 |
|---|------|------|
| 1 | `src/types/pageDesign/forumPostDetail.ts` | 扩展 `ContentBlockType` 新增 `'diagram'`，新增 `DiagramEngine` 类型，`ContentBlock` 新增 `engine`/`source` 可选字段 |
| 2 | `package.json` | 新增依赖 `mermaid`（锁定精确版本） |
| 3 | `src/pages/forum-post-detail/DiagramBlock.vue` | 新建：按 `engine` 分发到具体渲染子组件的调度组件 |
| 4 | `src/pages/forum-post-detail/MermaidDiagram.vue` | 新建：调用 `mermaid.js` 客户端渲染 SVG，渲染失败时降级为原始代码块 |
| 5 | `src/pages/forum-post-detail/KrokiDiagram.vue` | **[deferred]** 新建：将 `engine + source` POST 到 Kroki 接口换回 SVG 并展示，支持 PlantUML（以及未来其他 Kroki 支持的引擎），失败时降级为原始代码块 |
| 6 | `src/pages/forum-post-detail/PostContent.vue` | 新增 `block.type === 'diagram'` 分支，交给 `DiagramBlock` 渲染；新增图表容器样式 |
| 7 | `src/data/pageDesign/forumPostDetail.ts` | 在 `postContentBlocks` 中补充 1 条 Mermaid 示例块 + 1 条 PlantUML 示例块，用于验证渲染效果（项目目前无真实接口，正文数据均为 mock） |

## 实施步骤

### Step 1: 类型定义扩展 — `src/types/pageDesign/forumPostDetail.ts`

```typescript
export type ContentBlockType =
  | 'paragraph'
  | 'heading'
  | 'list'
  | 'code'
  | 'blockquote'
  | 'table'
  | 'diagram'

export type DiagramEngine = 'mermaid' | 'plantuml'

export interface ContentBlock {
  type: ContentBlockType
  html: string
  level?: number
  ordered?: boolean
  engine?: DiagramEngine
  source?: string
}
```

说明：`diagram` 类型的块不使用 `html` 字段渲染（图表渲染器需要**未转义的原始源码**自行解析），`html` 字段此时仅作为渲染失败时的兜底展示内容（保持与 `code` 类型一致的 `<pre><code>` 结构），真正驱动渲染的是 `source` + `engine`。

### Step 2: 安装 mermaid 依赖

```bash
npm install mermaid@<当前最新稳定版精确版本号，安装时锁定，不使用 ^/~ 范围>
```

PlantUML 走 Kroki 的 HTTP 接口，无需安装额外 npm 包。

### Step 3: DiagramBlock.vue — 分发组件

```typescript
defineProps<{
  engine: DiagramEngine
  source: string
  fallbackHtml: string
}>()
```

模板：根据 `engine` 用 `<component :is>` 或 `v-if/v-else-if` 分发：
- `engine === 'mermaid'` → `<MermaidDiagram :source :fallback-html>`
- `engine === 'plantuml'` → `<KrokiDiagram engine="plantuml" :source :fallback-html>`

单一职责：本组件只做分发，不包含任何渲染逻辑，方便未来新增引擎时只改这里的判定表。

### Step 4: MermaidDiagram.vue — Mermaid 客户端渲染

```typescript
defineProps<{
  source: string
  fallbackHtml: string
}>()
```

- `onMounted` 时动态 `import('mermaid')`，调用 `mermaid.render(uniqueId, props.source)` 得到 SVG 字符串
- 用 `ref<HTMLElement>` 容器 + `innerHTML` 注入渲染结果（Mermaid 官方推荐用法，输出内容为 mermaid.js 自身生成，非用户可控 HTML）
- `try/catch` 包裹渲染调用：失败时（语法错误等）将容器内容回退为 `fallbackHtml`（即原始代码块展示），并在控制台输出错误详情辅助排查，不向用户抛出未处理异常
- 每个实例生成唯一 id（如 `mermaid-${crypto.randomUUID()}`），避免同页多个图表渲染冲突

### Step 5: **[deferred]** KrokiDiagram.vue — PlantUML（及未来 Kroki 支持的引擎）渲染

```typescript
defineProps<{
  engine: DiagramEngine
  source: string
  fallbackHtml: string
}>()
```

- `onMounted` 时 `fetch('https://kroki.io/${engine}/svg', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: props.source })`
- 请求成功：将返回的 SVG 文本通过受控容器展示（响应体是 Kroki 生成的 SVG，不包含用户输入的原始 HTML，风险等同于 Mermaid 方案）
- 请求失败（网络错误 / 4xx / 5xx，例如语法错误 Kroki 会返回 400）：降级为 `fallbackHtml` 原始代码块展示，并给出轻量提示（如"图表渲染失败，已显示原始代码"）
- 加载中状态：显示简单 loading 占位，避免布局跳动

> 本步骤会发起跨域请求到 `kroki.io`，实现前请再次确认 Context 中的风险点已经和开发者对齐。

### Step 6: PostContent.vue — 接入 diagram 分支

在现有 `v-for` 分支中新增：

```html
<DiagramBlock
  v-else-if="block.type === 'diagram' && block.engine && block.source"
  :engine="block.engine"
  :source="block.source"
  :fallback-html="block.html"
/>
```

样式：在现有 `<style>`（非 scoped）中补充 `.article-body .diagram-container` 相关样式（居中显示、最大宽度、加载态/错误态提示文字颜色），与现有 `pre`/`code` 风格保持一致的圆角、间距。

### Step 7: 数据文件补充示例 — `src/data/pageDesign/forumPostDetail.ts`

在 `postContentBlocks` 中新增 2 条示例数据用于验证：

```typescript
{
  type: 'diagram',
  engine: 'mermaid',
  source: 'graph TD\n  A[仿真环境] --> B[策略训练]\n  B --> C[策略评估]\n  C -->|未达标| B\n  C -->|达标| D[ONNX 导出]\n  D --> E[现网试点部署]',
  html: '<pre><code>graph TD\n  A[仿真环境] --&gt; B[策略训练]\n  ...</code></pre>',
},
{
  type: 'diagram',
  engine: 'plantuml',
  source: '@startuml\nUE -> gNB: 上报 CQI/PMI/RI\ngNB -> Scheduler: 状态向量\nScheduler -> Scheduler: DRL 策略推理\nScheduler -> UE: 调度决策（RBG + MCS）\n@enduml',
  html: '<pre><code>@startuml\nUE -&gt; gNB: 上报 CQI/PMI/RI\n...</code></pre>',
},
```

`html` 字段作为该 block 的兜底内容，需保持转义安全（`<` `>` 转为实体），与其他 `code` 类型块的处理方式一致。

## 关键设计决策

1. **`diagram` 是通用分类，不是 `mermaid` 专属类型** —— 通过 `engine` 字段区分具体引擎，新增图表格式（如 Graphviz、Ditaa）只需在 `DiagramEngine` 补充枚举值 + `DiagramBlock.vue` 补充一行分发判断，不改动 `PostContent.vue` 和类型结构。
2. **图表源码单独存 `source` 字段，不复用 `html`** —— 图表渲染器需要原始未转义文本自行解析，`html` 只承担渲染失败时的兜底展示职责，两者语义不同不能混用。
3. **Mermaid 与 PlantUML 采用不同渲染路径，而非强行统一** —— Mermaid 可纯前端渲染，PlantUML 必须依赖服务端编译能力，这是两者本质差异决定的架构分歧，不做不必要的抽象统一。
4. **失败兜底是强制要求** —— 无论 Mermaid 语法错误还是 Kroki 服务不可达/超时，都必须优雅降级为原始代码块展示，不能让整页因为一个图表渲染失败而报错或白屏。
5. **PlantUML 依赖第三方公共服务，需开发者知情确认** —— 项目目前是纯前端工程，没有后端可以做渲染代理，因此默认方案会将图表源码发给 `kroki.io`。此风险点已在 Context 中列出可选方案，需要开发者在动手前拍板。

## 验证步骤

1. `npm install` 后确认 `mermaid` 依赖装入 `package.json` / `package-lock.json`
2. TypeScript 检查：`ContentBlockType`/`DiagramEngine`/`ContentBlock` 类型定义无报错，`vue-tsc` 通过
3. 启动 dev server，进入帖子详情页 `/forum/post/1`
4. Mermaid 示例块正确渲染为流程图 SVG，而非代码文本
5. PlantUML 示例块正确渲染为时序图 SVG（需能访问 kroki.io，若网络受限验证降级逻辑）
6. 故意构造一段语法错误的 Mermaid/PlantUML 源码，确认渲染失败时优雅降级为原始代码块展示，不影响页面其他内容渲染，控制台有可读的错误日志
7. 弱网/断网场景下验证 PlantUML 的 loading 态和失败降级均正常触发
8. 现有 `code`/`paragraph`/`table` 等其他 block 类型渲染不受影响（回归检查）
9. `npm run build`（Vite 构建）通过，无 TS 类型错误
