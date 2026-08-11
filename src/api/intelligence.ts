import { get, type PagedResult } from './http'
import type { PageQuery } from '@/types/api'
import type {
  IntelligenceCategory,
  IntelligenceItem,
  IntelligencePageMeta,
} from '@/types/pageDesign/intelligence'

export interface IntelligenceMetaResponse {
  meta: IntelligencePageMeta
  categories: IntelligenceCategory[]
  timeRanges: string[]
}

export interface IntelligenceListQuery extends PageQuery {
  categoryId?: string
  keyword?: string
}

export function fetchIntelligence(
  query?: IntelligenceListQuery,
): Promise<PagedResult<IntelligenceItem>> {
  return get('/api/intelligence', query)
}

export function fetchIntelligenceMeta(): Promise<IntelligenceMetaResponse> {
  return get('/api/intelligence/meta')
}
