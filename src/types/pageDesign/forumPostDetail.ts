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
