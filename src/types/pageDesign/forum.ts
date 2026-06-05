export interface ForumTab {
  id: string
  name: string
}

export interface ForumFilterOption {
  id: string
  name: string
}

export interface TopicAuthor {
  name: string
  initials: string
  gradientFrom: string
  gradientTo: string
}

export interface TopicItem {
  id: string
  author: TopicAuthor
  categoryBadge: string
  tagBadge: string
  title: string
  time: string
  replies: number
  views: string
  likes: number
}

export interface HotTopic {
  rank: number
  title: string
  rankColor: string
  flameColor: string
}

export interface ActiveUser {
  name: string
  initials: string
  gradientFrom: string
  gradientTo: string
  weeklyPosts: number
  medalColor?: string
}

export interface HotTag {
  name: string
  bgClass: string
  textClass: string
}

export interface ForumRule {
  content: string
}

export interface ForumPageMeta {
  title: string
  description: string
  createButtonText: string
}

export interface ForumSidebarData {
  hotTopics: HotTopic[]
  activeUsers: ActiveUser[]
  hotTags: HotTag[]
  rules: ForumRule[]
}

export interface PaginationConfig {
  pageSize: number
}
