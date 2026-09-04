# 三页面按钮路由至 forum-new-topic + 返回键支持 — 摘要

**日期**: 2026-06-05  
**开发计划**: `docs/plans/features/button-route-to-forum-new-topic-plan.md`  
**Commit**: `78be9ef`

## 功能概述

practices、toolbox、forum 三页面的创建按钮现在均路由到 forum-new-topic 发帖页面，且 forum-new-topic 的返回按钮根据来源动态指向正确的页面。

## 技术方案

使用 URL query 参数 `?from=<page>` 标记来源，无需引入 Pinia。

## 修改文件清单

| 文件 | 变更说明 | 是否影响其他模块 |
|------|---------|----------------|
| `src/data/pageDesign/forumNewTopic.ts` | 新增 `sourcePageConfig` 映射和 `defaultSource` | 否（仅新增导出） |
| `src/pages/practices/Index.vue` | `handlePublish` 改为 `router.push({ path: '/forum/new-topic', query: { from: 'practices' } })` | 否 |
| `src/pages/toolbox/Index.vue` | 新增 `handleSubmitManual` 和按钮 `@click` | 否 |
| `src/pages/forum/Index.vue` | `onCreateTopic` 改为 `router.push({ path: '/forum/new-topic', query: { from: 'forum' } })` | 否 |
| `src/pages/forum-new-topic/Index.vue` | 读取 `route.query.from`，动态计算 `dynamicBackLink` 和 `sourceLabel` | 否 |
| `src/pages/forum-new-topic/NewTopicBreadcrumb.vue` | 新增 `sourceLabel` prop，面包屑文字动态显示 | 否 |

## 路由行为

| 来源页面 | 跳转 URL | 返回目标 | 面包屑显示 |
|---------|---------|---------|-----------|
| practices | `/forum/new-topic?from=practices` | `/practices` | 优秀实践 > 发起新话题 |
| toolbox | `/forum/new-topic?from=toolbox` | `/toolbox` | 百宝箱 > 发起新话题 |
| forum | `/forum/new-topic?from=forum` | `/forum` | AI论坛 > 发起新话题 |
| 无 from 参数 | `/forum/new-topic` | `/forum` | AI论坛 > 发起新话题 |

## 对其他模块的影响

无破坏性影响。仅修改现有按钮的点击行为和 forum-new-topic 的返回逻辑。

## 验证结果

- TypeScript 编译通过
- Vite 构建通过
- 浏览器验证：三个按钮均可正确跳转，返回键/取消键可正确返回来源页面
- 无 from 参数时默认返回 `/forum`
