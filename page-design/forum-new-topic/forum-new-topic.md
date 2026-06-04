# forum-new-topic.html Vue 工程化转换方案

## 转换目标

- 将 `forum-new-topic.html` 转换为 Vue 发帖页面，保留原表单布局、间距、卡片边框和按钮视觉。
- 不再使用 contenteditable 加 `document.execCommand` 的内联脚本。
- 富文本编辑器使用 wangEditor Vue3 组件，Markdown 编辑器使用 `md-editor-v3`。
- 标题、摘要、分类、标签、封面上传、编辑器模式、发布须知等静态文案全部抽为结构化数据。

## 推荐 npm 依赖

- 富文本：`@wangeditor/editor`、`@wangeditor/editor-for-vue@next`。
- Markdown：`md-editor-v3`。
- 表单与反馈：继续使用项目内 `element-plus`。

## 推荐文件结构

- `src/pages/ForumNewTopicPage.vue`：发起话题页面入口。
- `src/data/pageDesign/forumNewTopic.ts`：表单文案、分类选项、预设标签、编辑器模式、Markdown 快捷项、发布须知。
- `src/types/pageDesign/forumNewTopic.ts`：表单模型、标签、编辑器模式、上传状态类型。
- `src/components/page-design/forum-new-topic/NewTopicBreadcrumb.vue`：返回与面包屑。
- `src/components/page-design/forum-new-topic/NewTopicForm.vue`：表单容器。
- `src/components/page-design/forum-new-topic/TopicTitleField.vue`：标题输入和字数统计。
- `src/components/page-design/forum-new-topic/TopicSummaryField.vue`：摘要 textarea 和字数统计。
- `src/components/page-design/forum-new-topic/TopicCategorySelect.vue`：分类选择。
- `src/components/page-design/forum-new-topic/TopicTagPicker.vue`：预设标签、自定义标签、标签 chip。
- `src/components/page-design/forum-new-topic/CoverUploader.vue`：封面上传和预览。
- `src/components/page-design/forum-new-topic/EditorModeSwitch.vue`：富文本/Markdown 模式切换。
- `src/components/page-design/forum-new-topic/RichTextEditor.vue`：wangEditor 封装。
- `src/components/page-design/forum-new-topic/MarkdownEditor.vue`：md-editor-v3 封装。
- `src/components/page-design/forum-new-topic/PublishNotice.vue`：发布须知。
- `src/components/page-design/forum-new-topic/PublishActions.vue`：取消、保存草稿、发布。

## 结构化数据

建议包括：

- `pageMeta`：标题、返回入口、面包屑。
- `formLabels`：字段 label、placeholder、说明文案、错误文案。
- `formLimits`：标题最大长度、摘要最大长度、标签最大数量、封面大小限制。
- `topicCategories`：分类 id、名称、说明。
- `presetTags`：标签 id、名称、分类。
- `editorModes`：`rich`、`markdown` 的按钮文案、图标。
- `markdownShortcuts`：H2、粗体、斜体、代码、引用、链接等按钮配置。
- `publishNotices`：底部发布须知列表。

## Element Plus 替换点

- 表单外层使用 `ElForm`，但表单项间距和 label 样式保留原 class。
- 标题和摘要使用 `ElInput`，textarea 使用 `type="textarea"`。
- 分类和预设标签使用 `ElSelect`。
- 标签 chip 使用 `ElTag`，关闭事件替代原 `removeTag(index)` DOM 操作。
- 封面上传使用 `ElUpload` 的拖拽模式，覆盖样式匹配当前虚线上传框。
- 模式切换可用 `ElSegmented` 或保留自定义按钮组；优先选择保留视觉更稳定的方案。
- 发布、取消、保存草稿使用 `ElButton`。
- 校验提示、发布成功/失败使用 `ElMessage`。

## 脚本迁移为 TypeScript

原脚本转换为组合式逻辑：

- `useTopicDraftForm.ts`：维护表单模型、校验、保存草稿、发布。
- `useTopicTags.ts`：处理自定义标签输入、预设标签添加、去重、数量限制。
- `useCoverUpload.ts`：处理上传前校验、预览 URL、移除封面。
- `useEditorMode.ts`：处理富文本和 Markdown 模式切换。
- `useMarkdownDraft.ts`：如果使用 `md-editor-v3`，只保留内容值和配置，不再手写 Markdown replace 预览。

需要删除或替代：

- `switchEditor(mode)` 改为 `activeEditorMode` 响应式状态。
- `execCmd()`、`insertCodeBlock()` 由 wangEditor toolbar 接管。
- `insertMd()`、`toggleMdPreview()`、`updateMdPreview()` 由 `md-editor-v3` 接管。
- 文件上传 DOM click、drop、FileReader 逻辑由 `ElUpload` 和 `URL.createObjectURL` 状态封装。

## 不建议替换的区域

- 页面整体卡片、顶部说明、发布须知外观不建议换成 Element Plus 默认布局组件。
- wangEditor 和 md-editor-v3 的默认 toolbar 需要通过容器 class 和 CSS override 适配原页面，而不是接受默认视觉。
- 不建议继续使用 `contenteditable` 实现富文本，它会让 Vue 状态、清理和安全处理复杂化。

## 验收标准

- 页面视觉与 `forum-new-topic.html` 一致，包括编辑器容器高度、toolbar 边框、上传框和底部按钮。
- 所有字段文案、分类、标签、须知来自数据文件。
- 富文本和 Markdown 内容都由 Vue v-model 管理。
- 无内联脚本、无 CDN、无 `document.getElementById`。

