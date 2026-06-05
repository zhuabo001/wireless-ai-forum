# 三页面按钮路由至 forum-new-topic + 返回键支持 — 开发计划

## Context

practices、toolbox、forum 三页面的【发布实践】【提交手册】【发起话题】按钮目前均未路由到 forum-new-topic 发帖页面，且 forum-new-topic 的返回按钮固定指回 `/forum`，无法根据跳转来源返回正确的页面。

## 关于 Pinia 的分析

**结论：不需要 Pinia。** 使用 URL query parameter `?from=<page>` 即可满足需求，理由：

- query 参数天然携带在 URL 中，浏览器前进/后退、书签均能保持来源信息
- 无需新增 store 文件、无需修改入口文件、无需处理 router/pinia 时序问题
- 代码量更少，逻辑更直观

## 修改文件清单

| # | 文件 | 变更说明 |
|---|------|---------|
| 1 | `src/pages/practices/Index.vue` | `handlePublish` 改为 `router.push` 带 `?from=practices` |
| 2 | `src/pages/toolbox/Index.vue` | 为按钮添加 `@click` 路由到 `/forum/new-topic?from=toolbox` |
| 3 | `src/pages/forum/Index.vue` | `onCreateTopic` 改为 `router.push` 带 `?from=forum` |
| 4 | `src/pages/forum-new-topic/Index.vue` | 读取 `route.query.from`，动态计算 backLink 和 sourceLabel，传入子组件 |
| 5 | `src/pages/forum-new-topic/NewTopicBreadcrumb.vue` | 支持动态 sourceLabel 显示来源页面名称 |
| 6 | `src/data/pageDesign/forumNewTopic.ts` | 新增 sourcePageConfig 映射，移除硬编码 backLink |

## 实施步骤

### Step 1: 更新数据文件 — `src/data/pageDesign/forumNewTopic.ts`

- `pageMeta` 保留在数据文件中（title, backTitle, breadcrumbItems 仍有效）
- 新增 `sourcePageConfig` 映射各来源页面信息
- 新增 `defaultSource = 'forum'`

```typescript
export const sourcePageConfig: Record<string, { label: string; href: string }> = {
  practices: { label: '优秀实践', href: '/practices' },
  toolbox: { label: '百宝箱', href: '/toolbox' },
  forum: { label: 'AI论坛', href: '/forum' },
}
export const defaultSource = 'forum'
```

### Step 2: 修改 practices/Index.vue — "发布实践"按钮

改动 `handlePublish`，从 `console.log` 改为路由跳转：

```typescript
import { useRouter } from 'vue-router'

const router = useRouter()

function handlePublish(): void {
  router.push({ path: '/forum/new-topic', query: { from: 'practices' } })
}
```

### Step 3: 修改 toolbox/Index.vue — "提交手册"按钮

- 为按钮添加 `@click="handleSubmitManual"`
- 新增函数：

```typescript
import { useRouter } from 'vue-router'

const router = useRouter()

function handleSubmitManual(): void {
  router.push({ path: '/forum/new-topic', query: { from: 'toolbox' } })
}
```

### Step 4: 修改 forum/Index.vue — "发起话题"按钮

改动 `onCreateTopic`：

```typescript
import { useRouter } from 'vue-router'

const router = useRouter()

function onCreateTopic(): void {
  router.push({ path: '/forum/new-topic', query: { from: 'forum' } })
}
```

### Step 5: 修改 forum-new-topic/Index.vue — 动态返回链接

```typescript
import { useRoute } from 'vue-router'
import { sourcePageConfig, defaultSource } from '@/data/pageDesign/forumNewTopic'

const route = useRoute()
const sourcePage = (route.query.from as string) || defaultSource
const sourceConfig = computed(() => sourcePageConfig[sourcePage] ?? sourcePageConfig[defaultSource])
const dynamicBackLink = computed(() => sourceConfig.value.href)
const sourceLabel = computed(() => sourceConfig.value.label)
```

模板中：
- `:back-link="pageMeta.backLink"` → `:back-link="dynamicBackLink"`
- `:cancel-link="pageMeta.backLink"` → `:cancel-link="dynamicBackLink"`
- NewTopicBreadcrumb 新增 `:source-label="sourceLabel"`

### Step 6: 修改 NewTopicBreadcrumb.vue — 动态面包屑

- 新增 prop `sourceLabel?: string`
- 面包屑链路：sourceLabel (or breadcrumbItems[0].label) → "发起新话题"

## 关键设计决策

1. **不用 Pinia**：query 参数方案更简洁，天然支持浏览器前进后退和书签
2. **来源缺省值**：无 `from` 参数时默认返回 `/forum`
3. **面包屑自适应**：根据来源显示正确的页面名称（"优秀实践""百宝箱""AI论坛"）

## 验证步骤

1. 启动 dev server，分别从 practices/toolbox/forum 页面点击创建按钮
2. 确认跳转到 `/forum/new-topic?from=practices|toolbox|forum`
3. 在 forum-new-topic 页面：
   - 点击返回箭头：跳回正确的来源页面
   - 面包屑显示正确的来源名称（优秀实践/百宝箱/AI论坛）
   - 点击取消按钮：跳回正确的来源页面
4. 直接访问 `/forum/new-topic`（无 from 参数）：默认返回 `/forum`
5. TypeScript 检查通过
