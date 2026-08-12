import { get, type PagedResult } from './http'
import type { PageQuery } from '@/types/api'
import type {
  ForumFilterOption,
  ForumPageMeta,
  ForumSidebarData,
  ForumTab,
  TopicItem,
} from '@/types/pageDesign/forum'
import type {
  Comment,
  CommentSortOption,
  PostDetail,
  ResourceLink,
} from '@/types/pageDesign/forumPostDetail'
import type { ForumStat, ForumTopic } from '@/types/home'

export interface TopicListQuery extends PageQuery {
  tab?: string
  category?: string
  sort?: string
  keyword?: string
}

export interface ForumMetaResponse {
  meta: ForumPageMeta
  tabs: ForumTab[]
  categoryFilters: ForumFilterOption[]
  sortFilters: ForumFilterOption[]
  sidebar: ForumSidebarData
}

export interface ForumStatsResponse {
  stats: ForumStat[]
  hotTopics: ForumTopic[]
}

export interface PostDetailResponse {
  post: PostDetail
  contentHtml: string
  resourceLinks: ResourceLink[]
}

export interface CommentListResponse extends PagedResult<Comment> {
  sortOptions: CommentSortOption[]
}

export function fetchTopics(query?: TopicListQuery): Promise<PagedResult<TopicItem>> {
  return get('/api/forum/topics', query)
}

export function fetchForumMeta(): Promise<ForumMetaResponse> {
  return get('/api/forum/meta')
}

export function fetchForumStats(): Promise<ForumStatsResponse> {
  return get('/api/forum/stats')
}

export function fetchPostDetail(id: string): Promise<PostDetailResponse> {
  return get(`/api/forum/posts/${id}`)
}

export function fetchPostComments(
  id: string,
  query?: { sort?: string } & PageQuery,
): Promise<CommentListResponse> {
  return get(`/api/forum/posts/${id}/comments`, query)
}
