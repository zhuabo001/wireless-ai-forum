# 修复分页组件不可见问题

**日期**: 2026-06-05  
**修复方案**: `docs/plans/bug-fix/fix-pagination-visibility.md`

## 问题描述

toolbox、courses、forum 三个页面的分页组件代码已存在但不可见。根本原因是 `pageSize` 设置过大，导致 `totalPages = 1`，被 `v-if="totalPages > 1"` 隐藏。

## 修改文件清单

| 文件 | 变更说明 | 是否影响其他模块 |
|------|---------|----------------|
| `src/data/pageDesign/toolbox.ts` | `paginationConfig.pageSize` 从 8 改为 4 | 否 |
| `src/data/pageDesign/courses.ts` | `paginationConfig.pageSize` 从 6 改为 4 | 否 |
| `src/data/pageDesign/forum.ts` | `paginationConfig.pageSize` 从 6 改为 4 | 否 |

## 修改后效果

| 页面 | 原 totalPages | 新 totalPages | 分页可见？ |
|------|--------------|--------------|-----------|
| toolbox | 1（5条/8每页） | 2（5条/4每页） | 是 |
| courses | 1（6条/6每页） | 2（6条/4每页） | 是 |
| forum | 1（6条/6每页） | 2（6条/4每页） | 是 |

## 对其他模块的影响

无破坏性影响。仅修改了三个数据文件中的 `pageSize` 常数值，翻页逻辑和组件实现均未改动。
