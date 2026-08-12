import { http, HttpResponse } from 'msw'
import {
  coursesMeta,
  courseCategoryGroups,
  courseItems,
} from '@/data/pageDesign/courses'
import { createListHandler } from './utils'

export const courseHandlers = [
  createListHandler('/api/courses', courseItems, {
    filterByQuery: (items, url) => {
      const categoryId = url.searchParams.get('categoryId')
      return categoryId ? items.filter(item => item.categoryId === categoryId) : items
    },
    keywordFields: item => [item.title, item.summary, item.author.name],
  }),

  http.get('/api/courses/meta', () => {
    return HttpResponse.json({ meta: coursesMeta, categoryGroups: courseCategoryGroups })
  }),
]
