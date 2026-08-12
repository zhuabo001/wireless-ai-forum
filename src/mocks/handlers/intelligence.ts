import { http, HttpResponse } from 'msw'
import {
  intelligenceMeta,
  categoryFilters,
  timeRangeOptions,
  intelligenceItems,
} from '@/data/pageDesign/intelligence'
import { createListHandler } from './utils'

export const intelligenceHandlers = [
  createListHandler('/api/intelligence', intelligenceItems, {
    filterByQuery: (items, url) => {
      const categoryId = url.searchParams.get('categoryId')
      return categoryId && categoryId !== 'all'
        ? items.filter(item => item.categoryId === categoryId)
        : items
    },
    keywordFields: item => [item.title, item.summary, item.source],
  }),

  http.get('/api/intelligence/meta', () => {
    return HttpResponse.json({
      meta: intelligenceMeta,
      categories: categoryFilters,
      timeRanges: timeRangeOptions,
    })
  }),
]
