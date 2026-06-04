import type { IconName } from '../home'

export interface PracticeSubCategory {
  id: string
  name: string
  count: number
}

export interface PracticeCategory {
  id: string
  name: string
  icon: IconName
  count: number
  defaultExpanded?: boolean
  children: PracticeSubCategory[]
}

export interface PracticeItem {
  id: string
  title: string
  summary: string
  categoryId: string
  tags: string[]
  author: string
  time: string
  views: string
  isFeatured?: boolean
}

export interface HotPost {
  title: string
  views: string
  replies: string
}

export interface Contributor {
  name: string
  surname: string
  articles: string
  likes: string
  rank: number
}

export interface Team {
  name: string
  total: string
  monthlyNew: string
  badge: string
  badgeStyle: string
}
