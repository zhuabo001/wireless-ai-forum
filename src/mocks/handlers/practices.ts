import { http, HttpResponse } from 'msw'
import {
  practicesMeta,
  practiceCategories,
  practiceItems,
  hotPosts,
  contributors,
  teams,
} from '@/data/pageDesign/practices'
import { createListHandler } from './utils'

export const practiceHandlers = [
  createListHandler('/api/practices', practiceItems, {
    filterByQuery: (items, url) => {
      const categoryId = url.searchParams.get('categoryId')
      const subCategoryId = url.searchParams.get('subCategoryId')
      const tag = url.searchParams.get('tag')

      let result = items
      if (categoryId) {
        result = result.filter(item => item.categoryId === categoryId)
      }
      if (subCategoryId) {
        result = result.filter(item => item.subCategoryId === subCategoryId)
      }
      if (tag) {
        result = result.filter(item => item.tags.some(t => t === tag))
      }
      return result
    },
    keywordFields: item => [item.title, item.summary, item.author],
  }),

  http.get('/api/practices/meta', () => {
    return HttpResponse.json({
      meta: practicesMeta,
      categories: practiceCategories,
      hotPosts,
      contributors,
      teams,
    })
  }),
]
