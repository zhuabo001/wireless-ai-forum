# 实践/工具箱卡片路由至帖子详情 + 首页按钮路由 — 开发计划

## Context

practices 页面的实践卡片和 toolbox 页面的工具文章卡片目前有 cursor-pointer 样式但无点击行为，点击后应跳转到 forum-post-detail 帖子详情页。同时 forum-post-detail 的返回按钮目前是静态的（始终返回 `/forum`），需要支持根据来源（practices/toolbox/forum）动态返回。首页 HeroSection 的"进入论坛"和"进入优秀实践"按钮目前是 `<a href="#forum">` 锚点滚动，需要改为真正的路由跳转。

已有可复用模式：`forum-new-topic/Index.vue` 通过 `useRoute().query.from` + `sourcePageConfig` 映射表实现动态返回链接。

## 文件清单

| # | 文件 | 说明 |
|---|------|------|
| 1 | `src/types/pageDesign/practices.ts` | PracticeItem 新增 `postId?: string` |
| 2 | `src/types/pageDesign/toolbox.ts` | ToolArticle 新增 `postId?: string` |
| 3 | `src/data/pageDesign/practices.ts` | 4条数据追加 `postId: '1'` |
| 4 | `src/data/pageDesign/toolbox.ts` | 5条数据追加 `postId: '1'` |
| 5 | `src/pages/practices/PracticeCard.vue` | 添加 @click 跳转至 `/forum/post/:postId?from=practices` |
| 6 | `src/pages/toolbox/ToolArticleItem.vue` | 添加 @click 跳转至 `/forum/post/:postId?from=toolbox` |
| 7 | `src/data/pageDesign/forumPostDetail.ts` | 将静态 `backLink`/`backTitle` 替换为 `sourcePageConfig` + `defaultSource` |
| 8 | `src/pages/forum-post-detail/Index.vue` | 使用 `useRoute().query.from` 动态计算返回链接 |
| 9 | `src/data/home.ts` | heroContent.actions 的 href 改为路由路径 `/forum`、`/practices` |
| 10 | `src/sections/HeroSection.vue` | `<a>` 改为 `<router-link>` |

## 实施步骤

### Step 1: 类型扩展 — PracticeItem 和 ToolArticle 新增 postId

**`src/types/pageDesign/practices.ts`** — 在 PracticeItem 末尾追加：

```typescript
export interface PracticeItem {
  // ...现有字段不变...
  tags: PracticeTag[]
  postId?: string
}
```

**`src/types/pageDesign/toolbox.ts`** — 在 ToolArticle 末尾追加：

```typescript
export interface ToolArticle {
  // ...现有字段不变...
  date: string
  postId?: string
}
```

### Step 2: 数据补充 — 为现有条目设置 postId

**`src/data/pageDesign/practices.ts`** — 为 p1-p4 四个条目各加 `postId: '1'`。

**`src/data/pageDesign/toolbox.ts`** — 为 t1-t5 五个条目各加 `postId: '1'`。

### Step 3: PracticeCard.vue — 添加点击跳转

**`src/pages/practices/PracticeCard.vue`**

script 变更：
```typescript
import { computed } from 'vue'
import { useRouter } from 'vue-router'  // 新增
// ...existing imports...

const props = defineProps<{ practice: PracticeItem }>()
const router = useRouter()  // 新增

function goToPostDetail(): void {  // 新增
  if (props.practice.postId) {
    router.push({
      path: `/forum/post/${props.practice.postId}`,
      query: { from: 'practices' },
    })
  }
}
```

template 变更：`<article class="...">` 加 `@click="goToPostDetail"`。

### Step 4: ToolArticleItem.vue — 添加点击跳转

**`src/pages/toolbox/ToolArticleItem.vue`**

script 变更：
```typescript
import type { ToolArticle } from '@/types/pageDesign/toolbox'
import { useRouter } from 'vue-router'  // 新增

const props = defineProps<{ article: ToolArticle }>()
const router = useRouter()  // 新增

function goToPostDetail(): void {  // 新增
  if (props.article.postId) {
    router.push({
      path: `/forum/post/${props.article.postId}`,
      query: { from: 'toolbox' },
    })
  }
}
```

template 变更：`<article class="...">` 加 `@click="goToPostDetail"`。

### Step 5: forumPostDetail.ts — 新增 sourcePageConfig

**`src/data/pageDesign/forumPostDetail.ts`**

将文件末尾的：
```typescript
export const backLink = '/forum'
export const backTitle = '返回论坛'
```

替换为：
```typescript
export const sourcePageConfig: Record<string, { label: string; href: string }> = {
  practices: { label: '返回优秀实践', href: '/practices' },
  toolbox: { label: '返回百宝箱', href: '/toolbox' },
  forum: { label: '返回论坛', href: '/forum' },
}

export const defaultSource = 'forum'
```

### Step 6: forum-post-detail/Index.vue — 动态返回链接

**`src/pages/forum-post-detail/Index.vue`**

状态计算（在现有 ref 声明之后，toggleLike 之前添加）：
```typescript
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
// ...

// 从数据文件导入：移除 backLink/backTitle，新增 sourcePageConfig/defaultSource
import {
  postDetail,
  postContentBlocks,
  resourceLinks,
  commentSortOptions,
  comments as initialComments,
  sourcePageConfig,
  defaultSource,
  currentUser,
} from '@/data/pageDesign/forumPostDetail'

const route = useRoute()
const sourcePage = (route.query.from as string) || defaultSource
const sourceConfig = computed(() => sourcePageConfig[sourcePage] ?? sourcePageConfig[defaultSource])
const dynamicBackLink = computed<string>(() => sourceConfig.value.href)
const dynamicBackTitle = computed<string>(() => sourceConfig.value.label)
```

模板中 PostHeader 的 props 改为动态值：
```html
<PostHeader
  :back-link="dynamicBackLink"
  :back-title="dynamicBackTitle"
  ...
/>
```

### Step 7: 首页按钮路由跳转

**`src/data/home.ts`** — 修改 heroContent.actions：
```typescript
actions: [
  { label: '进入论坛', href: '/forum', variant: 'primary', icon: 'arrow-right' },
  { label: '进入优秀实践', href: '/practices', variant: 'secondary' },
],
```

**`src/sections/HeroSection.vue`** — 将 `<a :href="action.href">` 改为 `<router-link :to="action.href">`。

## 关键设计决策

1. **postId 设计为可选字段**：未来可能有只展示卡片但无对应帖子详情的数据项，`if (postId)` 保护避免空跳转
2. **sourcePageConfig 独立定义**：不与 forumNewTopic.ts 共享，因为返回标签文案不同（"返回优秀实践" vs "优秀实践"）
3. **HeroSection 使用 `<router-link>` 而非 `<a>` + router.push**：声明式、可访问性好（保留右键新标签打开能力）
4. **双重兜底**：`from` 参数缺失时用 `defaultSource='forum'`，非法值时再回退到 `sourcePageConfig[defaultSource]`

## 验证步骤

1. 从 `/practices` 点击实践卡片 → URL 变为 `/forum/post/1?from=practices`，详情页正常渲染
2. 从 `/toolbox` 点击工具文章 → URL 变为 `/forum/post/1?from=toolbox`
3. 从 practices 进入后点击返回按钮 → 返回 `/practices`，显示"返回优秀实践"
4. 从 toolbox 进入后点击返回按钮 → 返回 `/toolbox`，显示"返回百宝箱"
5. 直接访问 `/forum/post/1`（无 from）→ 返回按钮显示"返回论坛"，点击回 `/forum`
6. 首页点击"进入论坛"→ 跳转 `/forum`（SPA 导航，无刷新）
7. 首页点击"进入优秀实践"→ 跳转 `/practices`
8. TypeScript 检查通过，Vite 构建通过
