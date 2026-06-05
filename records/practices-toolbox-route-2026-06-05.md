# 实践/工具箱卡片路由至帖子详情 + 首页按钮路由 — 摘要

**日期**: 2026-06-05  
**开发计划**: `docs/practices-toolbox-route-to-forum-post-detail-plan.md`  
**Commits**: `486832c`, `84cfd7e`

## 功能概述

1. practices 和 toolbox 页面的列表卡片点击后跳转到 forum-post-detail 帖子详情页（带 `?from=practices|toolbox`）
2. forum-post-detail 返回按钮根据 `?from` 参数动态返回来源页面
3. 首页"进入论坛"/"进入优秀实践"按钮从锚点滚动改为真正的路由跳转

## 技术方案

- 沿用 `sourcePageConfig` + `route.query.from` 模式（与 forum-new-topic 一致）
- PracticeItem/ToolArticle 新增 `postId?: string` 字段桥接到论坛帖子
- HeroSection 的 `<a>` 改为 `<router-link>`

## 修改文件清单

| 文件 | 变更说明 | 是否影响其他模块 |
|------|---------|----------------|
| `src/types/pageDesign/practices.ts` | PracticeItem 新增 `postId?: string` | 否（新增可选字段） |
| `src/types/pageDesign/toolbox.ts` | ToolArticle 新增 `postId?: string` | 否（新增可选字段） |
| `src/data/pageDesign/practices.ts` | p1-p4 各加 `postId: '1'` | 否 |
| `src/data/pageDesign/toolbox.ts` | t1-t5 各加 `postId: '1'` | 否 |
| `src/pages/practices/PracticeCard.vue` | 新增 useRouter + goToPostDetail + @click | 否（仅添加交互行为） |
| `src/pages/toolbox/ToolArticleItem.vue` | 新增 useRouter + goToPostDetail + @click | 否（仅添加交互行为） |
| `src/data/pageDesign/forumPostDetail.ts` | backLink/backTitle → sourcePageConfig + defaultSource | 否（Index.vue 同步更新） |
| `src/pages/forum-post-detail/Index.vue` | 动态计算 backLink/backTitle 从 route.query.from | 否 |
| `src/data/home.ts` | heroContent.actions href 改为实际路由路径 | 否 |
| `src/sections/HeroSection.vue` | `<a>` → `<router-link>` | 否 |

## 路由行为

| 来源 | URL | 返回按钮文字 | 返回目标 |
|------|-----|------------|---------|
| practices | `?from=practices` | 返回优秀实践 | `/practices` |
| toolbox | `?from=toolbox` | 返回百宝箱 | `/toolbox` |
| forum | `?from=forum` | 返回论坛 | `/forum` |
| 无 from | — | 返回论坛 | `/forum` |
| 首页 → /forum | — | — | `/forum` |
| 首页 → /practices | — | — | `/practices` |

## 对其他模块的影响

无破坏性影响。仅添加可选字段、click行为和路由跳转。

## 验证结果

- TypeScript 编译通过
- Vite 构建通过
- 验证 Agent：7 步全部 PASS，5 项对抗检查 PASS
