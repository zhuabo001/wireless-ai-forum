# 论坛页面（ForumPage）Vue 工程化转换

**日期**: 2026-06-05  
**转换来源**: `page-design/forum/forum.html`  
**转换方案**: `page-design/forum/forum.md`

## 功能概述

将 forum.html（352行，Tab导航 + 筛选行 + 话题列表 + 分页 + 右侧栏）转为 Vue 3 + TypeScript + Tailwind 工程化页面，包含：
- 6 个分类 Tab（全部/热门/工具FAQ/技术探讨/业界趋势/工程能力全景）
- 筛选行：分类下拉（全部帖子/我的回复/我的发帖）+ 排序下拉（最新发布/最高热度/最新回复）+ 搜索框
- 6 条话题（渐变圆形头像 + 分类徽章 + 标签徽章 + 标题 + 作者/时间 + 回复/浏览/点赞统计）
- 分页组件（上一页/下一页 + 页码按钮）
- 右侧栏：热帖排行（5条）+ 活跃用户（5人）+ 热门标签（8个）+ 社区规范（4条）

## 修改文件清单

### 修改已有文件
| 文件 | 变更说明 | 是否影响其他模块 |
|------|---------|----------------|
| `src/router/index.ts` | 新增 `/forum` 懒加载路由 | 否，仅追加 |

### 新建文件
| 文件 | 说明 |
|------|------|
| `src/types/pageDesign/forum.ts` | 类型定义：ForumTab, ForumFilterOption, TopicAuthor, TopicItem, HotTopic, ActiveUser, HotTag, ForumRule, ForumPageMeta, ForumSidebarData, PaginationConfig |
| `src/data/pageDesign/forum.ts` | 结构化数据：6个Tab、3个分类选项、3个排序选项、6条话题、5条热帖、5个活跃用户、8个标签、4条规范、分页配置 |
| `src/pages/forum/Index.vue` | 页面入口，含 Tab/分类/排序/搜索筛选逻辑 + 分页 |
| `src/pages/forum/ForumToolbar.vue` | Tab导航 + 分类/排序下拉 + 搜索输入框 |
| `src/pages/forum/ForumTopicList.vue` | 话题列表容器 |
| `src/pages/forum/ForumTopicItem.vue` | 单条话题行：头像 + 分类/标签徽章 + 标题 + 作者时间 + 统计数据 |
| `src/pages/forum/ForumPagination.vue` | 传统分页组件 |
| `src/pages/forum/ForumSidebar.vue` | 右侧栏聚合容器 |
| `src/pages/forum/HotTopicRank.vue` | 热帖排行（flame图标 + 序号 + 标题） |
| `src/pages/forum/ActiveUserList.vue` | 活跃用户列表（头像 + 姓名 + 发帖数 + 奖牌） |
| `src/pages/forum/HotTagCloud.vue` | 热门标签云（彩色标签） |
| `src/pages/forum/CommunityRules.vue` | 社区规范列表（图标 + 文本） |

## 对其他模块的影响

- **无破坏性影响**。所有变更均为追加式。
- 复用现有组件：`IconRenderer`，无需修改。
- 新路由与其他页面独立，无 Pinia store 依赖。
- 筛选控件使用原生 `<select>` 元素，不依赖 Element Plus 的 ElSelect。
- 导航栏中 `/forum` 链接在 `src/data/navigation.ts` 中已存在，无需额外修改。

## 验证修复记录

验证 agent 发现并修复 2 个问题：
1. "热门"Tab 按 categoryBadge="热门" 过滤导致空列表（改为按点赞数降序排列）
2. ForumToolbar 的 category/sort 事件未绑定到 Index.vue（补全事件绑定和排序逻辑）
