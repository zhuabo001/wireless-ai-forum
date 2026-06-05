import type {
  FormLimits,
  ForumNewTopicMeta,
  FormLabels,
  TopicCategory,
  PresetTag,
  EditorMode,
} from '@/types/pageDesign/forumNewTopic'

export const formLimits: FormLimits = {
  titleMax: 120,
  summaryMax: 300,
  tagsMax: 5,
  coverMaxSizeMB: 5,
}

export const pageMeta: ForumNewTopicMeta = {
  title: '发起新话题',
  backLink: '/forum',
  backTitle: '返回论坛',
  breadcrumbItems: [
    { label: 'AI论坛', href: '/forum' },
  ],
}

export const formLabels: FormLabels = {
  titleLabel: '帖子标题',
  titlePlaceholder: '用一句话清晰描述你的问题或分享内容',
  summaryLabel: '内容概述',
  summaryPlaceholder: '用几句话概括帖子核心内容，帮助他人快速了解',
  categoryLabel: '话题领域',
  categoryPlaceholder: '请选择领域',
  tagLabel: '标签',
  tagPlaceholder: '或手动输入标签后回车添加',
  tagPresetPlaceholder: '选择预设标签',
  tagHelperText: '最多添加 5 个标签，回车确认',
  coverLabel: '封面图片',
  coverPlaceholder: '点击或拖拽上传封面',
  coverFormatHint: '支持 JPG、PNG 格式，最大 5MB',
  coverDeleteText: '删除图片',
  editorLabel: '正文内容',
  cancelText: '取消',
  submitText: '发布话题',
  noticeText: '发布前请确认内容符合社区规范',
}

export const topicCategories: TopicCategory[] = [
  { id: 'help', name: '求助', description: '遇到问题需要帮助' },
  { id: 'share', name: '分享', description: '分享知识和经验' },
  { id: 'practice', name: '实践', description: '实践案例和项目' },
  { id: 'discuss', name: '讨论', description: '开放讨论和观点交流' },
]

export const presetTags: PresetTag[] = [
  { id: 'tool-faq', name: '工具FAQ' },
  { id: 'tech-discussion', name: '技术探讨' },
  { id: 'industry-trends', name: '业界趋势' },
  { id: 'engineering-capability', name: '工程能力全景' },
]

export const editorModes: EditorMode[] = [
  { id: 'rich', label: '富文本', icon: 'type' },
  { id: 'md', label: 'Markdown', icon: 'file-code' },
]
