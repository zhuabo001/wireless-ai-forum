import { get, type PagedResult } from './http'
import type { PageQuery } from '@/types/api'
import type {
  AgentItem,
  DownloadRankItem,
  MarketPageMeta,
  MarketSortOption,
  NewDeveloperItem,
  UsageGuide,
} from '@/types/pageDesign/market'

export interface MarketMetaResponse {
  meta: MarketPageMeta
  featured: AgentItem[]
  categoryOptions: string[]
  sortOptions: MarketSortOption[]
  downloadRank: DownloadRankItem[]
  newDevelopers: NewDeveloperItem[]
  usageGuide: UsageGuide
}

export interface MarketAgentListQuery extends PageQuery {
  type?: string
  keyword?: string
  sort?: string
}

export function fetchMarketAgents(query?: MarketAgentListQuery): Promise<PagedResult<AgentItem>> {
  return get('/api/market/agents', query)
}

export function fetchMarketMeta(): Promise<MarketMetaResponse> {
  return get('/api/market/meta')
}
