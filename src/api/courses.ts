import { get, type PagedResult } from './http'
import type { PageQuery } from '@/types/api'
import type {
  CourseCategoryGroup,
  CourseItem,
  CoursesPageMeta,
} from '@/types/pageDesign/courses'

export interface CourseMetaResponse {
  meta: CoursesPageMeta
  categoryGroups: CourseCategoryGroup[]
}

export interface CourseListQuery extends PageQuery {
  categoryId?: string
  keyword?: string
}

export function fetchCourses(query?: CourseListQuery): Promise<PagedResult<CourseItem>> {
  return get('/api/courses', query)
}

export function fetchCourseMeta(): Promise<CourseMetaResponse> {
  return get('/api/courses/meta')
}
