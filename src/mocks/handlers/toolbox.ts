import { http, HttpResponse } from 'msw'
import {
  toolboxMeta,
  toolCategories,
  toolboxArticles,
  sortOptions,
} from '@/data/pageDesign/toolbox'
import { createListHandler } from './utils'

export const toolboxHandlers = [
  createListHandler('/api/toolbox/articles', toolboxArticles, {
    filterByQuery: (items, url) => {
      const categoryId = url.searchParams.get('categoryId')
      return categoryId && categoryId !== 'all'
        ? items.filter(item => item.categoryId === categoryId)
        : items
    },
    keywordFields: item => [item.title, item.summary, item.author],
    sorters: {
      date: (a, b) => b.date.localeCompare(a.date),
    },
  }),

  http.get('/api/toolbox/meta', () => {
    return HttpResponse.json({ meta: toolboxMeta, categories: toolCategories, sortOptions })
  }),
]
