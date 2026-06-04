import type { IconName } from '../home'

export interface PracticesPageMeta {
  title: string
  description: string
  publishButtonText: string
}

export interface PracticeSubCategory {
  id: string
  name: string
  count: number
}

export interface PracticeCategory {
  id: string
  name: string
  icon: IconName
  subCategories: PracticeSubCategory[]
}

export type PracticeTag = '精华' | '模板' | '案例复盘' | '工具链'

export interface PracticeItem {
  id: string
  title: string
  summary: string
  author: string
  authorAvatar: string
  date: string
  views: number
  categoryId: string
  subCategoryId: string
  tags: PracticeTag[]
}

export interface HotPost {
  id: string
  title: string
  views: string
  replies: number
}

export interface Contributor {
  name: string
  avatar: string
  practices: number
  likes: number
  rank: number
}

export interface Team {
  name: string
  count: number
  newThisMonth: number
  badge: string
  badgeStyle: string
}
