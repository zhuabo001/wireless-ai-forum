export interface PostAuthor {
  name: string
  avatar: string
  title: string
  initials?: string
  gradientFrom?: string
  gradientTo?: string
}

export interface PostDetail {
  id: string
  title: string
  categories: string[]
  author: PostAuthor
  publishDate: string
  viewCount: number
  commentCount: number
  likeCount: number
}

export type ContentBlockType = 'paragraph' | 'heading' | 'list' | 'code' | 'blockquote' | 'table' | 'diagram'

export type DiagramEngine = 'mermaid' | 'plantuml'

export interface ContentBlock {
  type: ContentBlockType
  html: string
  level?: number
  ordered?: boolean
  engine?: DiagramEngine
  source?: string
}

export interface ResourceLink {
  type: string
  title: string
  icon: string
  url: string
}

export interface Reply {
  id: string
  author: PostAuthor
  contentHtml: string
  time: string
  likes: number
  isLiked: boolean
  authorBadge?: string
}

export interface Comment {
  id: string
  author: PostAuthor
  contentHtml: string
  time: string
  likes: number
  isLiked: boolean
  authorBadge?: string
  replies: Reply[]
}

export interface CommentSortOption {
  id: string
  label: string
}
