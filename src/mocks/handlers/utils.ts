import { http, HttpResponse } from 'msw'
import type { PagedResult } from '@/types/api'

interface ResolvedListQuery {
  page: number
  pageSize: number
}

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 10

export function parseListQuery(url: URL): ResolvedListQuery {
  const page = Number(url.searchParams.get('page'))
  const pageSize = Number(url.searchParams.get('pageSize'))
  return {
    page: Number.isInteger(page) && page > 0 ? page : DEFAULT_PAGE,
    pageSize: Number.isInteger(pageSize) && pageSize > 0 ? pageSize : DEFAULT_PAGE_SIZE,
  }
}

export function paginate<T>(items: T[], query: ResolvedListQuery): PagedResult<T> {
  const start = (query.page - 1) * query.pageSize
  return {
    list: items.slice(start, start + query.pageSize),
    total: items.length,
    page: query.page,
    pageSize: query.pageSize,
  }
}

export function matchKeyword(fields: string[], keyword: string | null): boolean {
  if (!keyword) return true
  const lower = keyword.toLowerCase()
  return fields.some(field => field.toLowerCase().includes(lower))
}

export interface ListHandlerOptions<T> {
  /** 按 query 参数过滤（分类、标签等），在关键词过滤之前执行 */
  filterByQuery?: (items: T[], url: URL) => T[]
  /** 参与 keyword 模糊匹配的字段 */
  keywordFields?: (item: T) => string[]
  /** sort 参数值到比较函数的映射 */
  sorters?: Record<string, (a: T, b: T) => number>
}

/** 生成标准列表接口：filterByQuery → keyword → sort → paginate */
export function createListHandler<T>(path: string, items: T[], options: ListHandlerOptions<T> = {}) {
  const { filterByQuery, keywordFields, sorters } = options
  return http.get(path, ({ request }) => {
    const url = new URL(request.url)
    let result = filterByQuery ? filterByQuery(items, url) : items
    if (keywordFields) {
      const keyword = url.searchParams.get('keyword')
      result = result.filter(item => matchKeyword(keywordFields(item), keyword))
    }
    const sort = url.searchParams.get('sort')
    const sorter = sort ? sorters?.[sort] : undefined
    if (sorter) {
      result = [...result].sort(sorter)
    }
    return HttpResponse.json(paginate(result, parseListQuery(url)))
  })
}
