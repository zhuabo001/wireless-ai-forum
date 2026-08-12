import { get, type PagedResult } from './http'
import type { PageQuery } from '@/types/api'
import type {
  SortOption,
  ToolArticle,
  ToolCategory,
  ToolboxPageMeta,
} from '@/types/pageDesign/toolbox'

export interface ToolboxMetaResponse {
  meta: ToolboxPageMeta
  categories: ToolCategory[]
  sortOptions: SortOption[]
}

export interface ToolboxArticleListQuery extends PageQuery {
  categoryId?: string
  keyword?: string
  sort?: string
}

export function fetchToolboxArticles(
  query?: ToolboxArticleListQuery,
): Promise<PagedResult<ToolArticle>> {
  return get('/api/toolbox/articles', query)
}

export function fetchToolboxMeta(): Promise<ToolboxMetaResponse> {
  return get('/api/toolbox/meta')
}
