import type { IconName } from '../home'

export interface ToolCategory {
  id: string
  name: string
  icon: IconName
  count: number
}

export interface ToolArticle {
  id: string
  title: string
  summary: string
  categoryId: string
  author: string
  avatar: string
  date: string
}

export interface SortOption {
  key: string
  label: string
}

export interface ToolboxPageMeta {
  title: string
  description: string
}
