# 发起新话题页面 Vue 工程化转换 — 开发计划

## Context

将 `page-design/forum-new-topic/forum-new-topic.html` 转换为 Vue 3 + TypeScript 发帖页面。原始 HTML 包含：面包屑导航、标题输入（120字限制）、摘要文本域（300字限制）、话题领域选择、标签管理（预设+自定义，最多5个）、封面图片上传（拖拽+预览）、富文本/Markdown编辑器切换、表单操作按钮。

关键决策（来自 `forum-new-topic.md`）：
- 富文本编辑器使用 `@wangeditor/editor` + `@wangeditor/editor-for-vue@next`
- Markdown 编辑器使用 `md-editor-v3`
- 表单组件使用 Element Plus（ElSelect, ElTag, ElUpload, ElButton, ElMessage）
- 废弃原始 contenteditable + execCommand 和手写 Markdown 正则预览

## 文件清单

| # | 文件 | 说明 |
|---|------|------|
| 1 | `src/types/pageDesign/forumNewTopic.ts` | 类型定义 |
| 2 | `src/data/pageDesign/forumNewTopic.ts` | 结构化数据（文案、选项、限制） |
| 3 | `src/pages/forum-new-topic/NewTopicBreadcrumb.vue` | 面包屑 + 返回按钮 |
| 4 | `src/pages/forum-new-topic/TopicTitleField.vue` | 标题输入 + 字符计数 |
| 5 | `src/pages/forum-new-topic/TopicSummaryField.vue` | 摘要文本域 + 字符计数 |
| 6 | `src/pages/forum-new-topic/TopicCategorySelect.vue` | 话题领域下拉（ElSelect） |
| 7 | `src/pages/forum-new-topic/TopicTagPicker.vue` | 标签管理（预设选择+自定义输入+标签药丸+去重+上限） |
| 8 | `src/pages/forum-new-topic/CoverUploader.vue` | 封面拖拽上传+预览（ElUpload） |
| 9 | `src/pages/forum-new-topic/EditorModeSwitch.vue` | 富文本/Markdown 切换按钮组 |
| 10 | `src/pages/forum-new-topic/RichTextEditor.vue` | wangEditor 封装 |
| 11 | `src/pages/forum-new-topic/MarkdownEditor.vue` | md-editor-v3 封装 |
| 12 | `src/pages/forum-new-topic/PublishActions.vue` | 取消+发布按钮+社区规范提示 |
| 13 | `src/pages/forum-new-topic/Index.vue` | 页面入口（状态管理+布局编排） |
| 修改 | `src/router/index.ts` | 添加 `/forum/new-topic` 路由 |
| 修改 | `src/components/ui/IconRenderer.vue` | 添加 `arrow-left`、`image-plus`、`info` 图标；`type` 图标已存在（lucide Type），Markdown 模式使用 `file-code` 图标 |

## 实施步骤

### Step 0: 安装依赖

```bash
npm install @wangeditor/editor @wangeditor/editor-for-vue@next md-editor-v3
```

### Step 1: 类型定义 — `src/types/pageDesign/forumNewTopic.ts`

```typescript
export interface BreadcrumbItem { label: string; href: string }
export interface TopicCategory { id: string; name: string; description?: string }
export interface PresetTag { id: string; name: string }
export type EditorModeId = 'rich' | 'md'
export interface EditorMode { id: EditorModeId; label: string; icon: string }
export interface FormLimits { titleMax: number; summaryMax: number; tagsMax: number; coverMaxSizeMB: number }
export interface ForumNewTopicMeta { title: string; breadcrumbItems: BreadcrumbItem[]; backLink: string; backTitle: string }
export interface FormLabels { titleLabel: string; titlePlaceholder: string; summaryLabel: string; summaryPlaceholder: string; categoryLabel: string; categoryPlaceholder: string; tagLabel: string; tagPlaceholder: string; tagPresetPlaceholder: string; tagHelperText: string; coverLabel: string; coverPlaceholder: string; coverFormatHint: string; coverDeleteText: string; editorLabel: string; cancelText: string; submitText: string; noticeText: string }
export interface TopicFormData { title: string; summary: string; category: string; tags: string[]; coverFile: File | null; editorMode: EditorModeId; richContent: string; mdContent: string }
```

### Step 2: 数据文件 — `src/data/pageDesign/forumNewTopic.ts`

提取以下数据：
- **formLimits**: titleMax=120, summaryMax=300, tagsMax=5, coverMaxSizeMB=5
- **pageMeta**: title="发起新话题", backLink="/forum", breadcrumbItems=[{label:"AI论坛", href:"/forum"}]
- **formLabels**: 所有字段 label、placeholder、帮助文本
- **topicCategories**: 求助/分享/实践/讨论
- **presetTags**: 工具FAQ/技术探讨/业界趋势/工程能力全景
- **editorModes**: rich(富文本, icon="type") / md(Markdown, icon="file-code")

### Step 3: 修改 IconRenderer — 添加缺失图标

在 `src/components/ui/IconRenderer.vue` 中：
- 新增导入：`ArrowLeft`, `ImagePlus`, `Info` from `lucide-vue-next`
- 图标映射新增：`arrow-left`, `image-plus`, `info`

注意：`Markdown` 不是 lucide 标准图标，使用已有的 `FileCode`/`file-code` 代替。

### Step 4: NewTopicBreadcrumb.vue

Props: `{ backLink: string; backTitle: string; breadcrumbItems: BreadcrumbItem[]; currentLabel: string }`

- `<router-link>` 返回按钮 + arrow-left 图标
- 面包屑链：v-for breadcrumbItems → chevron-right 分隔 → 当前页文本
- h1 标题

### Step 5: TopicTitleField.vue

Props: `{ modelValue: string; maxLength: number }`
Emits: `{ 'update:modelValue': [string] }`

- 标签 "帖子标题 *"
- 原生 `<input>` + Tailwind 样式（保持原始精确视觉效果）
- 右下角字符计数 `{{ modelValue.length }}/{{ maxLength }}`
- HTML `maxlength` 属性截断

### Step 6: TopicSummaryField.vue

Props: `{ modelValue: string; maxLength: number }`
Emits: `{ 'update:modelValue': [string] }`

- 标签 "内容概述"（无必填星号）
- `<textarea rows="3">` + Tailwind 样式（resize-none）
- 字符计数同上

### Step 7: TopicCategorySelect.vue

Props: `{ modelValue: string; options: TopicCategory[] }`
Emits: `{ 'update:modelValue': [string] }`

- 标签 "话题领域 *"
- `ElSelect` + `ElOption` v-for，placeholder="请选择领域"
- `<style scoped>` 覆盖 ElSelect 样式匹配原始外观

### Step 8: TopicTagPicker.vue（最复杂组件）

Props: `{ modelValue: string[]; presetTags: PresetTag[]; maxTags: number }`
Emits: `{ 'update:modelValue': [string[]] }`

内部状态：`inputValue: ref<string>`，`presetSelectValue: ref<string>`

逻辑函数（均带类型标注）：
- `addTag(tag: string): void` — trim + 上限检查 + 去重 + emit
- `removeTag(index: number): void` — filter + emit
- `handlePresetTagChange(value: string): void` — addTag + reset select
- `handleKeydown(event: KeyboardEvent): void` — Enter/Comma=addTag + Backspace(空输入时)=removeLast

模板：
- 预设标签 `ElSelect`（每次选择后重置）
- 标签容器（flex-wrap, border, focus-within ring）
  - `ElTag` v-for（closable, @close, tagIn 动画）
  - 原生 `<input>`（inline, @keydown）
- 帮助文本 "最多添加 5 个标签，回车确认"

边界情况：重复静默忽略、上限静默忽略、空字符串不添加、退格删除末位、上限时隐藏 placeholder

### Step 9: CoverUploader.vue

Props: `{ modelValue: File | null; maxSizeMB: number }`
Emits: `{ 'update:modelValue': [File | null] }`

内部状态：`previewUrl: ref<string | null>`（通过 URL.createObjectURL）

- `ElUpload`（drag, accept="image/*", :auto-upload="false", :show-file-list="false", :on-change）
- handleFileChange: 校验类型(image/*) + 大小(maxSizeMB) → ElMessage.warning 提示
- 预览模式：`<img :src="previewUrl">` + 删除按钮
- 占位模式：image-plus 图标 + 提示文字
- onUnmounted 时 revokeObjectURL

### Step 10: EditorModeSwitch.vue

Props: `{ modelValue: EditorModeId; modes: EditorMode[] }`
Emits: `{ 'update:modelValue': [EditorModeId] }`

- inline-flex 按钮组容器（border, rounded-lg）
- v-for modes：active=bg-primary text-white / inactive=text-muted-foreground
- IconRenderer + label 文字

### Step 11: RichTextEditor.vue（wangEditor）

Props: `{ modelValue: string }`
Emits: `{ 'update:modelValue': [string] }`

- 导入 `@wangeditor/editor-for-vue` 的 `<Editor>` + `<Toolbar>`
- 导入 `@wangeditor/editor/dist/css/style.css`
- toolbarConfig: 仅保留 bold/italic/underline | unorderedList/orderedList | blockquote/codeBlock/link | undo/redo
- editorConfig: placeholder + MENU_CONF
- handleCreated: 设置 editorRef, setHtml(初始值)
- handleChange: emit getHtml()
- watch modelValue: setHtml 同步外部变更
- onBeforeUnmount: editor.destroy()
- `<style>` (非scoped) 覆盖 wangEditor 内部样式：toolbar 边框、内容区 min-height 240px、blockquote/code/pre 样式匹配原始

### Step 12: MarkdownEditor.vue（md-editor-v3）

Props: `{ modelValue: string }`
Emits: `{ 'update:modelValue': [string] }`

- 导入 `MdEditor` from `md-editor-v3`
- 导入 `md-editor-v3/lib/style.css`
- v-model 计算属性桥接 props/emit
- toolbars 配置匹配原始快捷按钮
- `<style>` (非scoped) 覆盖 md-editor-v3 样式匹配原始外观

### Step 13: PublishActions.vue

Props: `{ noticeText: string; cancelLink: string; cancelText: string; submitText: string; isSubmitting: boolean }`
Emits: `{ submit: []; cancel: [] }`

- flex between 布局，顶部 border-t 分隔
- 左侧：info 图标 + 提示文字
- 右侧：取消 `<router-link>` + `ElButton` type="primary" :loading="isSubmitting"

### Step 14: Index.vue — 页面入口

状态（全部 ref + 类型标注）：
```typescript
const title = ref<string>('')
const summary = ref<string>('')
const category = ref<string>('')
const tags = ref<string[]>([])
const coverFile = ref<File | null>(null)
const editorMode = ref<EditorModeId>('rich')
const richContent = ref<string>('')
const mdContent = ref<string>('')
const isSubmitting = ref<boolean>(false)
```

提交逻辑 `handleSubmit(): void`：
1. 校验 title 非空 → ElMessage.warning
2. 校验 category 非空 → ElMessage.warning
3. 校验当前编辑器内容非空 → ElMessage.warning
4. isSubmitting=true → setTimeout 模拟 API → ElMessage.success → isSubmitting=false

布局：`pt-16 > w-full lg:w-2/3 xl:w-3/5 mx-auto > ElForm > 各字段组件`

编辑器使用 `v-if`（非 v-show）确保切换时正确初始化/销毁实例。

### Step 15: 路由 — 修改 `src/router/index.ts`

```typescript
{
  path: '/forum/new-topic',
  name: 'forum-new-topic',
  component: () => import('@/pages/forum-new-topic/Index.vue'),
}
```

## 关键设计决策

1. **组件位置**：`src/pages/forum-new-topic/`（遵循 html-convert-to-vue.md 规则：同名目录 + Index.vue 入口）
2. **输入控件**：标题/摘要使用原生 `<input>`/`<textarea>` + Tailwind（非 ElInput），精确匹配原始视觉
3. **下拉控件**：使用 ElSelect + CSS 覆盖匹配原始外观
4. **编辑器切换**：使用 `v-if` 而非 `v-show`，确保 wangEditor 生命周期正确（editor.create/destroy）
5. **表单状态**：全部在 Index.vue 用 ref 管理，不引入 Pinia（无跨页面共享需求）
6. **图标**：Markdown 模式使用 `file-code` 图标替代（lucide 无 `Markdown` 图标）

## 验证步骤

1. 启动 dev server，访问 `/forum/new-topic`
2. 面包屑导航可点击返回论坛列表
3. 标题输入：输入文字，字符计数实时更新，不超过 120 字
4. 摘要输入：同上，不超过 300 字
5. 话题领域：下拉选择，必填校验
6. 标签管理：预设选择添加、自定义输入回车/逗号添加、去重、上限 5、删除、退格删除末位
7. 封面上传：点击/拖拽上传、图片预览、删除、格式校验、大小校验
8. 编辑器切换：富文本 ↔ Markdown 切换正常，编辑器实例正确初始化/销毁
9. 富文本编辑器：工具栏功能正常，内容 v-model 同步
10. Markdown 编辑器：工具栏功能正常，预览切换正常
11. 提交校验：空标题/空领域/空内容时提示，通过后模拟成功
12. 取消按钮返回论坛列表
13. 无 CDN 引用、无内联脚本
14. TypeScript 检查：所有变量/参数/返回值有类型标注
