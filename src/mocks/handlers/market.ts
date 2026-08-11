import { http, HttpResponse } from 'msw'
import {
  marketMeta,
  featuredAgents,
  agentItems,
  categoryOptions,
  sortOptions,
  downloadRank,
  newDevelopers,
  usageGuide,
} from '@/data/pageDesign/market'
import { createListHandler } from './utils'

export const marketHandlers = [
  createListHandler('/api/market/agents', agentItems, {
    filterByQuery: (items, url) => {
      const type = url.searchParams.get('type')
      return type && type !== '全部' ? items.filter(item => item.type === type) : items
    },
    keywordFields: item => [item.name, item.desc, item.developer],
    sorters: {
      rating: (a, b) => b.rating - a.rating,
    },
  }),

  http.get('/api/market/meta', () => {
    return HttpResponse.json({
      meta: marketMeta,
      featured: featuredAgents,
      categoryOptions,
      sortOptions,
      downloadRank,
      newDevelopers,
      usageGuide,
    })
  }),
]
