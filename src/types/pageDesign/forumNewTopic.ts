export interface BreadcrumbItem {
  label: string
  href: string
}

export interface TopicCategory {
  id: string
  name: string
  description?: string
}

export interface PresetTag {
  id: string
  name: string
}

export type EditorModeId = 'rich' | 'md'

export interface EditorMode {
  id: EditorModeId
  label: string
  icon: string
}

export interface FormLimits {
  titleMax: number
  summaryMax: number
  tagsMax: number
  coverMaxSizeMB: number
}

export interface ForumNewTopicMeta {
  title: string
  breadcrumbItems: BreadcrumbItem[]
  backLink: string
  backTitle: string
}

export interface FormLabels {
  titleLabel: string
  titlePlaceholder: string
  summaryLabel: string
  summaryPlaceholder: string
  categoryLabel: string
  categoryPlaceholder: string
  tagLabel: string
  tagPlaceholder: string
  tagPresetPlaceholder: string
  tagHelperText: string
  coverLabel: string
  coverPlaceholder: string
  coverFormatHint: string
  coverDeleteText: string
  editorLabel: string
  cancelText: string
  submitText: string
  noticeText: string
}

export interface TopicFormData {
  title: string
  summary: string
  category: string
  tags: string[]
  coverFile: File | null
  editorMode: EditorModeId
  richContent: string
  mdContent: string
}
