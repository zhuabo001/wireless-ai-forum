# 创建发起新话题页面 — 摘要

**日期**: 2026-06-05  
**方案来源**: `page-design/forum-new-topic/forum-new-topic.md`  
**开发计划**: `docs/plans/features/forum-new-topic-plan.md`  
**原始 HTML**: `page-design/forum-new-topic/forum-new-topic.html`

## 功能概述

将原始 HTML 发帖页面转换为 Vue 3 + TypeScript 工程化实现。废弃了 contenteditable + execCommand 的富文本方案和手写 Markdown 正则预览方案，改用成熟第三方编辑器组件。

## 修改文件清单

| 文件 | 变更说明 | 是否影响其他模块 |
|------|---------|----------------|
| `package.json` / `package-lock.json` | 新增依赖 `@wangeditor/editor`、`@wangeditor/editor-for-vue@next`、`md-editor-v3` | 否（仅新增） |
| `src/types/pageDesign/forumNewTopic.ts` | 新增类型定义（BreadcrumbItem、TopicCategory、EditorModeId 等 8 个接口/类型） | 否 |
| `src/data/pageDesign/forumNewTopic.ts` | 新增结构化数据（文案、分类选项、预设标签、表单限制） | 否 |
| `src/components/ui/IconRenderer.vue` | 新增 ArrowLeft、ImagePlus、Info、Type 图标导入和映射 | 否（向后兼容，仅新增） |
| `src/pages/forum-new-topic/Index.vue` | 页面入口：表单状态管理、提交校验、布局编排 | 否 |
| `src/pages/forum-new-topic/NewTopicBreadcrumb.vue` | 面包屑导航 + 返回按钮 | 否 |
| `src/pages/forum-new-topic/TopicTitleField.vue` | 标题输入 + 120字字符计数 | 否 |
| `src/pages/forum-new-topic/TopicSummaryField.vue` | 摘要文本域 + 300字字符计数 | 否 |
| `src/pages/forum-new-topic/TopicCategorySelect.vue` | 话题领域 ElSelect 下拉 | 否 |
| `src/pages/forum-new-topic/TopicTagPicker.vue` | 标签管理（预设选择+自定义输入+去重+上限+退格删除） | 否 |
| `src/pages/forum-new-topic/CoverUploader.vue` | 封面拖拽上传+预览+格式/大小校验 | 否 |
| `src/pages/forum-new-topic/EditorModeSwitch.vue` | 富文本/Markdown 切换按钮组 | 否 |
| `src/pages/forum-new-topic/RichTextEditor.vue` | wangEditor（bold/italic/underline/UL/OL/blockquote/code/link/undo/redo） | 否 |
| `src/pages/forum-new-topic/MarkdownEditor.vue` | md-editor-v3（toolbar 配置+中文语言） | 否 |
| `src/pages/forum-new-topic/PublishActions.vue` | 取消+发布按钮+社区规范提示 | 否 |
| `src/router/index.ts` | 新增 `/forum/new-topic` 路由 | 否（仅新增路由，不影响现有路由） |

## 对其他模块的影响

**无破坏性影响**。所有变更均为新增文件或仅新增图标映射（IconRenderer），不影响现有页面和组件。

## 关键技术决策

1. 富文本：wangEditor 替代 contenteditable+execCommand
2. Markdown：md-editor-v3 替代手写正则预览
3. 输入控件：标题/摘要使用原生元素（精确视觉匹配），下拉使用 ElSelect+CSS 覆盖
4. 编辑器切换：v-if 确保正确的生命周期（editor.create/destroy）
5. 状态管理：Index.vue ref 管理，不引入 Pinia

## 验证结果

- TypeScript 编译通过
- Vite 构建通过
- 浏览器验证：所有组件渲染正常、编辑器切换正常、字符计数联动正常、提交校验正常
- Verification agent 对抗性检查通过（修复后）

## Commits

| Commit | 说明 |
|--------|------|
| `9f4e7f0` | 创建发起新话题页面：类型定义、数据、11个Vue组件、路由 |
| `3545d6a` | 更新progress：所有任务标记完成，浏览器验证通过 |
| `1a08d0d` | 修复verification agent发现的问题：预设标签存name而非id、补充Type图标 |
