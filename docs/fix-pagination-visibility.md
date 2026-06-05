# 修复分页组件不可见问题 — 开发计划

## Context

用户反馈 toolbox、courses、forum 三个页面的分页组件未显示。经排查，**分页组件代码本身已存在**（`ToolboxPagination.vue`、`CoursePagination.vue`、`ForumPagination.vue`），但因为 `pageSize` 设置过大导致 `totalPages = 1`，被 `v-if="totalPages > 1"` 隐藏。

### 当前数据与 pageSize

| 页面 | pageSize | 单分类内条目数 | totalPages | 分页可见？ |
|------|----------|---------------|------------|-----------|
| toolbox | 8 | 5（debug 分类） | 1 | 否 |
| courses | 6 | 6（全部课程） | 1 | 否 |
| forum | 6 | 6（全部话题） | 1 | 否 |
| practices | 4 | 4 | 1 | 是（无 v-if 守卫） |

原始 HTML 中四个页面均包含分页组件（practices 最后页=6，toolbox 最后页=8，courses 最后页=8，forum 最后页=12）。

## 修改方案

降低 `pageSize` 使现有 mock 数据能产生多页：

| 页面 | 原 pageSize | 新 pageSize | 修改后 totalPages |
|------|------------|------------|-------------------|
| toolbox | 8 | 4 | ceil(5/4) = 2 |
| courses | 6 | 4 | ceil(6/4) = 2 |
| forum | 6 | 4 | ceil(6/4) = 2 |

## 文件修改清单

| # | 文件 | 修改内容 |
|---|------|---------|
| 1 | `src/data/pageDesign/toolbox.ts` | `paginationConfig.pageSize` 从 8 改为 4 |
| 2 | `src/data/pageDesign/courses.ts` | `paginationConfig.pageSize` 从 6 改为 4 |
| 3 | `src/data/pageDesign/forum.ts` | `paginationConfig.pageSize` 从 6 改为 4 |

## 验证步骤

1. 启动 dev server，分别访问 `/toolbox`、`/courses`、`/forum`
2. 确认各页面底部出现分页组件（上一页/下一页 + 页码按钮）
3. 点击页码按钮验证翻页逻辑正常
4. 确认选中分类/切换 Tab 后页码重置为第 1 页
