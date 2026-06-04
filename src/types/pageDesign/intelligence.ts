import type { IconName } from '../home'

export interface IntelligenceCategory {
  id: string
  name: string
  count: number
}

export interface IntelligenceItem {
  id: string
  title: string
  summary: string
  source: string
  publishedAt: string
  categoryId: string
  icon: IconName
}

export interface IntelligencePageMeta {
  title: string
  description: string
}
