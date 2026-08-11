import { get, type PagedResult } from './http'
import type { PageQuery } from '@/types/api'
import type {
  Contributor,
  HotPost,
  PracticeCategory,
  PracticeItem,
  PracticesPageMeta,
  Team,
} from '@/types/pageDesign/practices'

export interface PracticeMetaResponse {
  meta: PracticesPageMeta
  categories: PracticeCategory[]
  hotPosts: HotPost[]
  contributors: Contributor[]
  teams: Team[]
}

export interface PracticeListQuery extends PageQuery {
  categoryId?: string
  subCategoryId?: string
  tag?: string
  keyword?: string
}

export function fetchPractices(query?: PracticeListQuery): Promise<PagedResult<PracticeItem>> {
  return get('/api/practices', query)
}

export function fetchPracticeMeta(): Promise<PracticeMetaResponse> {
  return get('/api/practices/meta')
}
