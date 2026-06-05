# 论坛帖子详情页 Vue 工程化转换 — 开发计划

## Context

将 `page-design/forum-post-detail/forum-post-detail.html` 转换为 Vue 3 + TypeScript 帖子详情页。原始 HTML 包含：返回导航、文章头部（分类标签/标题/作者/统计数据）、文章正文（富文本 prose）、资源链接、桌面浮动操作栏（点赞/评论/收藏）、移动端底部操作栏、评论区（排序/主评论编辑器/评论列表/回复编辑器/加载更多）。

关键决策（来自 `forum-post-detail.md`）：
- 评论编辑器和回复编辑器使用 `@wangeditor/editor` + `@wangeditor/editor-for-vue@next`
- 表单/交互组件使用 Element Plus（ElSelect, ElButton, ElTag, ElTooltip, ElMessage, ElAvatar）
- 废弃原始 contenteditable + execCommand 和内联脚本
- 帖子正文保留 prose 风格排版，不做 El 组件替换

## 文件清单

| # | 文件 | 说明 |
|---|------|------|
| 1 | `src/types/pageDesign/forumPostDetail.ts` | 类型定义（帖子/评论/回复/操作状态） |
| 2 | `src/data/pageDesign/forumPostDetail.ts` | 结构化数据（帖子详情/正文块/资源链接/评论/排序选项） |
| 3 | `src/pages/forum-post-detail/PostHeader.vue` | 返回导航 + 分类标签 + 标题 + 作者 + 统计信息 |
| 4 | `src/pages/forum-post-detail/PostContent.vue` | 文章正文（prose 渲染器） |
| 5 | `src/pages/forum-post-detail/PostResourceLinks.vue` | 资源链接（GitHub/文档等） |
| 6 | `src/pages/forum-post-detail/PostFloatingActions.vue` | 桌面右侧浮动操作栏（点赞/评论/收藏） |
| 7 | `src/pages/forum-post-detail/PostMobileActions.vue` | 移动端底部操作栏 |
| 8 | `src/pages/forum-post-detail/CommentSortSelect.vue` | 评论排序下拉（ElSelect） |
| 9 | `src/pages/forum-post-detail/CommentEditor.vue` | 主评论编辑器（wangEditor） |
| 10 | `src/pages/forum-post-detail/CommentItem.vue` | 单条评论（含回复编辑器/嵌套回复） |
| 11 | `src/pages/forum-post-detail/CommentList.vue` | 评论列表 + 加载更多按钮 |
| 12 | `src/pages/forum-post-detail/CommentSection.vue` | 评论区容器（组合排序/主编辑器/列表） |
| 13 | `src/pages/forum-post-detail/Index.vue` | 页面入口（状态管理 + 布局编排） |
| 修改 | `src/components/ui/IconRenderer.vue` | 添加 `bookmark`、`calendar-clock` 图标（如 lucide 有） |
| 修改 | `src/router/index.ts` | 添加 `/forum/post/:id` 路由 |
| 修改 | `src/pages/forum/ForumTopicItem.vue` | 添加 `@click` 导航至帖子详情页 |

## 实施步骤

### Step 1: 类型定义 — `src/types/pageDesign/forumPostDetail.ts`

```typescript
export interface PostAuthor {
  name: string
  avatar: string
  title: string
  initials?: string
  gradientFrom?: string
  gradientTo?: string
}

export interface PostDetail {
  id: string
  title: string
  categories: string[]
  author: PostAuthor
  publishDate: string
  viewCount: number
  commentCount: number
  likeCount: number
}

export type ContentBlockType = 'paragraph' | 'heading' | 'list' | 'code' | 'blockquote' | 'table'

export interface ContentBlock {
  type: ContentBlockType
  html: string
  level?: number
  ordered?: boolean
}

export interface ResourceLink {
  type: string
  title: string
  icon: string
  url: string
}

export interface Reply {
  id: string
  author: PostAuthor
  contentHtml: string
  time: string
  likes: number
  isLiked: boolean
  authorBadge?: string
}

export interface Comment {
  id: string
  author: PostAuthor
  contentHtml: string
  time: string
  likes: number
  isLiked: boolean
  authorBadge?: string
  replies: Reply[]
}

export interface CommentSortOption {
  id: string
  label: string
}
```

### Step 2: 数据文件 — `src/data/pageDesign/forumPostDetail.ts`

提取以下数据：
- **postDetail**：id="1", title="基于强化学习的5G调度算法优化实践...", categories=["实践分享","5G","强化学习"], author, publishDate="2024年12月15日", viewCount=3842, commentCount=36, likeCount=128
- **postContentBlocks**：ContentBlock[] 数组，每个 block 包含 type 和 html。从原始 HTML `<article class="article-body">` 内提取所有块级元素（h2/h3/p/ul/ol/pre/blockquote/table），type 映射为 heading/paragraph/list/code/blockquote/table
- **resourceLinks**：开源代码（github图标）、技术白皮书（file-text图标）
- **commentSortOptions**：[{id:"hottest",label:"最热"},{id:"latest",label:"最新"}]
- **comments**：4条评论，第1条有1条嵌套回复。每条 comment 包含 id/author/contentHtml/time/likes/isLiked；第1条的 replies 包含1条回复
- **backLink**：`/forum`
- **backTitle**：`返回论坛`

注意：内容中的 `<img>` 标签需要保留，但本数据中无图片。所有 contentHtml 字段保留安全 HTML（无 script/事件处理器）。

### Step 3: 修改 IconRenderer — 添加缺失图标

检查 `src/components/ui/IconRenderer.vue`：

已有图标（无需添加）：`arrow-left`、`thumbs-up`、`message-square`、`message-circle`、`eye`、`github`、`file-text`、`reply`、`chevron-right`、`calendar`、`clock`

需要添加的图标（检查 lucide-vue-next 是否存在后决定）：

| 图标名 | lucide 组件 | 用途 |
|--------|------------|------|
| `bookmark` | `Bookmark` | 收藏按钮 |
| `calendar-clock` | `CalendarClock` | 发布时间图标；若不存在，使用已有 `calendar` 的 `data-lucide="calendar"` 风格渲染 |

### Step 4: PostHeader.vue

Props:
```typescript
defineProps<{
  backLink: string
  backTitle: string
  categories: string[]
  title: string
  author: PostAuthor
  publishDate: string
  viewCount: number
  commentCount: number
}>()
```

模板结构：
- `<router-link>` 返回按钮（arrow-left 图标 + backTitle）
- 分类标签（v-for + 不同背景色：blue/emerald/violet）
- h1 标题（responsive text-2xl/sm:text-3xl/lg:text-4xl font-bold）
- 作者行：img 头像 + 姓名 + 职位 + 分隔线 + calendar-clock 图标 + 日期 + eye 图标 + 浏览数 + message-square 图标 + 评论数

样式精确匹配原始 HTML 的 spacing 和字体。

### Step 5: PostContent.vue

Props:
```typescript
defineProps<{
  blocks: ContentBlock[]
}>()
```

模板：v-for blocks，根据 `type` 渲染对应 HTML 元素：
- `paragraph` → `<p>`
- `heading` → `<h2>` 或 `<h3>`（根据 level）
- `list` → `<ul>` 或 `<ol>`（根据 ordered）
- `code` → `<pre><code>`
- `blockquote` → `<blockquote>`
- `table` → `<table>`（直接 innerHTML）

内容通过 `v-html` 渲染以保留内联格式（strong/em/a/code），数据来源可控（不存在 XSS 风险）。

样式：必须使用 `<style>`（非 scoped）定义 `.article-body` 及其子元素样式（h2/h3/p/ul/ol/li/blockquote/pre/code/img/a/table/th/td），精确匹配原始 HTML 的 prose 排版。

### Step 6: PostResourceLinks.vue

Props:
```typescript
defineProps<{
  links: ResourceLink[]
}>()
```

模板：v-for links，每个链接使用 IconRenderer + 标题，外链用 `<a target="_blank">`。

### Step 7: PostFloatingActions.vue（桌面端）

Props:
```typescript
defineProps<{
  likeCount: number
  commentCount: number
  isLiked: boolean
  isBookmarked: boolean
}>()

defineEmits<{
  toggleLike: []
  scrollToComments: []
  toggleBookmark: []
}>()
```

模板：
- `hidden lg:flex` 容器（fixed right-6 top-1/2 -translate-y-1/2 z-40）
- 点赞按钮：thumbs-up 图标 + 数字，liked 状态时显示 text-rose-500 bg-rose-50
- 评论按钮：message-square 图标 + 数字，触发 scrollToComments
- 收藏按钮：bookmark 图标 + "收藏"文字，bookmarked 状态时显示 text-amber-500 bg-amber-50
- 点赞动画：通过 CSS class heart-anim 实现（已在原 HTML 中定义）

### Step 8: PostMobileActions.vue（移动端）

与 PostFloatingActions 相同逻辑，但布局为 `lg:hidden` 的 fixed bottom-0 横向分布条。

两个组件共享同一套 props/emits 签名，Index.vue 同时传入相同状态。

### Step 9: CommentSortSelect.vue

Props/Emits:
```typescript
defineProps<{
  modelValue: string
  options: CommentSortOption[]
}>()
defineEmits<{
  'update:modelValue': [string]
}>()
```

模板：`ElSelect` 内联样式，无外框，配合文字"排序："。

### Step 10: CommentSection.vue

评论区容器组件，组合 CommentSortSelect + CommentEditor + CommentList。

Props:
```typescript
defineProps<{
  comments: Comment[]
  commentCount: number
  sortOptions: CommentSortOption[]
  currentSort: string
  currentUserName: string
  currentUserAvatar: string
}>()

defineEmits<{
  'update:currentSort': [string]
  submitComment: [html: string]
  submitReply: [commentId: string, html: string]
  toggleCommentLike: [commentId: string]
  loadMore: []
}>()
```

模板：标题"评论 (N)" + CommentSortSelect + CommentEditor + CommentList。

### Step 11: CommentEditor.vue（主评论编辑器，wangEditor）

Props/Emits:
```typescript
defineEmits<{
  submit: [html: string]
}>()
```

- 导入 `@wangeditor/editor-for-vue` 的 `<Editor>` + `<Toolbar>`
- 导入 `@wangeditor/editor/dist/css/style.css`
- toolbarConfig：bold/italic/underline | bulletedList/numberedList | blockquote/codeBlock | undo/redo（使用 wangEditor 内置插入链接/插入代码）
- editorConfig：placeholder="分享你的观点、经验或疑问..."
- handleCreated / handleChange / onBeforeUnmount：生命周期管理（参照 RichTextEditor.vue 模式）
- 当前用户头像（dicebear 生成）
- 发表按钮：点击时 emit('submit', editor.getHtml()) 并清空编辑器
- `<style>`（非 scoped）覆盖 wangEditor 内部样式：matching 原始 comment-editor 外观

### Step 12: CommentItem.vue

Props/Emits:
```typescript
defineProps<{
  comment: Comment
  currentUserAvatar: string
}>()

defineEmits<{
  toggleLike: [commentId: string]
  submitReply: [commentId: string, html: string]
}>()
```

模板结构（匹配原始 HTML 评论卡片）：
- 作者头像 + 姓名 + 职位 + 时间
- 评论内容（v-html）
- 点赞按钮（toggleCommentLike 状态）+ 回复按钮
- 回复编辑器：默认隐藏，点击"回复"展开（使用内部 `expandedReplyEditorIds` ref set 管理）
  - 回复对象名称显示
  - 回复编辑器使用 wangEditor（内联，参照 CommentEditor 简化版）
  - 取消/回复按钮
- 嵌套回复列表：v-for comment.replies，缩进显示 + border-l 分隔 + 作者标签（"作者"）

### Step 13: CommentList.vue

Props/Emits:
```typescript
defineProps<{
  comments: Comment[]
  currentUserAvatar: string
}>()

defineEmits<{
  toggleLike: [commentId: string]
  submitReply: [commentId: string, html: string]
  loadMore: []
}>()
```

模板：CommentItem v-for + "加载更多评论"按钮。

### Step 14: Index.vue — 页面入口

状态（全部 ref + 类型标注）：
```typescript
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import type { Comment } from '@/types/pageDesign/forumPostDetail'
import { postDetail, postContentBlocks, resourceLinks, commentSortOptions, comments as initialComments, backLink, backTitle } from '@/data/pageDesign/forumPostDetail'

const route = useRoute()
const postId = computed<string>(() => route.params.id as string)

const isLiked = ref<boolean>(false)
const isBookmarked = ref<boolean>(false)
const likeCount = ref<number>(postDetail.likeCount)
const comments = ref<Comment[]>(initialComments)
const currentSort = ref<string>('hottest')

// 当前用户信息（模拟）
const currentUserName = ref<string>('当前用户')
const currentUserAvatar = ref<string>('https://api.dicebear.com/7.x/avataaars/svg?seed=currentuser')
```

操作函数（全部带类型标注）：
- `toggleLike(): void` — isLiked 取反，likeCount +/- 1
- `toggleBookmark(): void` — isBookmarked 取反
- `scrollToComments(): void` — 通过 ref 滚动到评论区 `document.getElementById('comments')?.scrollIntoView({behavior:'smooth'})`
- `handleCommentLike(commentId: string): void` — 递归查找 comment/reply，取反 isLiked，更新 likes 计数
- `handleSubmitComment(html: string): void` — ElMessage.success('评论已发表')，可扩展 prepend 到 comments
- `handleSubmitReply(commentId: string, html: string): void` — ElMessage.success('回复已发表')
- `handleLoadMore(): void` — ElMessage.info('暂无更多评论')

布局：
```
pt-16 lg:pt-20 pb-20 lg:pb-12
  max-w-3xl mx-auto
    PostFloatingActions（桌面浮动操作栏）
    PostMobileActions（移动端底部操作栏）
    PostHeader
    article.article-body > PostContent + PostResourceLinks
    CommentSection
```

注意：
- Index.vue 只负责编排子组件，不写内联逻辑
- 点赞/收藏状态通过 props 传入 FloatingActions 和 MobileActions，二者同步
- `v-html` 使用需确保数据来源可信（所有 html 字段来自数据文件，无用户生成内容）

### Step 15: 路由 — 修改 `src/router/index.ts`

```typescript
{
  path: '/forum/post/:id',
  name: 'forum-post-detail',
  component: () => import('@/pages/forum-post-detail/Index.vue'),
}
```

### Step 16: 论坛列表跳转 — 修改 `src/pages/forum/ForumTopicItem.vue`

为根级 `<div>` 添加 `@click`：
```typescript
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps<{ topic: TopicItem }>()

function goToDetail(): void {
  router.push(`/forum/post/${props.topic.id}`)
}
```

模板：`<div @click="goToDetail" ...>`

## 关键设计决策

1. **组件位置**：`src/pages/forum-post-detail/`（遵循 `html-convert-to-vue.md` 规则，与 forum-new-topic 模式一致）
2. **文章正文**：使用 ContentBlock 数组 + 类型驱动的渲染器，不用单一 HTML 字符串（更结构化、更易维护）
3. **评论区状态**：所有评论/回复状态在 Index.vue 用 ref 管理，不引入 Pinia（无跨页面共享需求）
4. **评论编辑器**：CommentItem 内部嵌入简化的 wangEditor 作为回复编辑器，每个回复框独立管理显示/隐藏
5. **浮动操作栏**：PostFloatingActions 和 PostMobileActions 是两个独立组件，但共享同一套 props/emits 签名和 Index.vue 的状态源，确保桌面和移动端操作同步
6. **wangEditor 复用**：评论主编辑器关注 CommentEditor，回复编辑器内嵌在 CommentItem 中，均使用 wangEditor
7. **图标**：bookmark 和 calendar-clock 需要新增至 IconRenderer；若 calendar-clock 在 lucide 中不存在，使用已有 `clock` 图标替代

## 验证步骤

1. 启动 dev server，从论坛列表点击某帖，跳转到 `/forum/post/1`
2. 返回按钮可回到 `/forum`
3. 文章头部：分类标签、标题、作者头像/姓名/职位、日期、浏览/评论数正确显示
4. 文章正文：prose 排版正确，标题、段落、列表、代码块、引用块、表格均渲染
5. 资源链接：GitHub/白皮书链接可点击，图标正确
6. 桌面浮动操作栏：点赞（动画+计数变化）、跳转评论区、收藏（颜色切换）
7. 移动端底部操作栏：同上功能，仅在移动端/小屏可见
8. 评论区：
   - 排序下拉可切换
   - 主评论编辑器（wangEditor）：工具栏功能正常，发表评论（演示）
   - 评论列表：点赞/回复按钮可交互
   - 回复编辑器：点击展开/取消关闭，内容可编辑，提交回复（演示）
   - 加载更多按钮：点击反馈
9. 移动端操作栏与桌面操作栏状态同步（点赞/收藏）
10. 无 CDN 引用、无内联脚本、无 contenteditable、无 execCommand
11. TypeScript 检查：所有变量/参数/返回值有类型标注
12. Vite 构建通过
