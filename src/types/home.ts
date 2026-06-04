export type IconName =
  | 'activity'
  | 'arrow-right'
  | 'award'
  | 'book-open'
  | 'bot'
  | 'brain'
  | 'briefcase'
  | 'calendar'
  | 'chevron-right'
  | 'clock'
  | 'command'
  | 'cpu'
  | 'database'
  | 'download'
  | 'external-link'
  | 'eye'
  | 'file-code'
  | 'file-text'
  | 'git-branch'
  | 'git-commit'
  | 'github'
  | 'git-merge'
  | 'globe'
  | 'layers'
  | 'link'
  | 'mail'
  | 'map-pin'
  | 'message-circle'
  | 'message-square'
  | 'messages-square'
  | 'newspaper'
  | 'package'
  | 'puzzle'
  | 'reply'
  | 'search'
  | 'server'
  | 'settings'
  | 'shield'
  | 'shield-check'
  | 'sparkles'
  | 'star'
  | 'tags'
  | 'terminal'
  | 'thumbs-up'
  | 'user'
  | 'users'
  | 'wrench'
  | 'zap'

export interface NavLink {
  label: string
  href: string
}

export interface QuickLink extends NavLink {
  icon: IconName
  color: string
  desc: string
}

export interface FooterColumn {
  title: string
  items: NavLink[]
}

export interface FooterContact extends NavLink {
  icon: IconName
}

export interface HeroStat {
  icon: IconName
  label: string
  value: string
}

export interface ChangelogItem {
  version: string
  date: string
  title: string
  changes: string[]
}

export interface TickerItem {
  tag: string
  tagColor: string
  text: string
  author: string
}

export interface CapabilityItem {
  icon: IconName
  title: string
  desc: string
}

export interface PracticeItem {
  dept: string
  title: string
  desc: string
  tags: string[]
}

export interface ToolItem {
  icon: IconName
  title: string
  desc: string
}

export interface IntelligenceItem {
  icon: IconName
  category: string
  time: string
  title: string
  source: string
}

export interface CourseItem {
  title: string
  instructor: string
  avatar: string
  org: string
  hours: number
  rating: number
  students: number
  cover: string
  tag: string
}

export interface AtmosphereEvent {
  title: string
  date: string
  location: string
  desc: string
  image: string
  participants: number
}

export interface ForumStat {
  icon: IconName
  label: string
  value: string
}

export interface ForumTopic {
  title: string
  author: string
  avatar: string
  tag: string
  tagColor: string
  replies: number
  views: string
  likes: number
}

export interface MarketItem {
  name: string
  type: string
  desc: string
  downloads: string
  rating: number
  icon: IconName
}

export interface ActivityItem {
  date: string
  title: string
  desc: string
  location: string
  time: string
  participants: number
  type: '线上' | '线下'
  typeColor: string
}

export interface HomeSectionMeta {
  id: string
  component: string
  className?: string
}
