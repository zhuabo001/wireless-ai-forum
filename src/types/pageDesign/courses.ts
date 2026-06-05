export interface CourseAuthor {
  name: string
  employeeId: string
  department: string
}

export interface CourseItem {
  id: string
  title: string
  summary: string
  categoryId: string
  initials: string
  gradientFrom: string
  gradientTo: string
  author: CourseAuthor
}

export interface CourseSubCategory {
  id: string
  name: string
}

export interface CourseCategoryGroup {
  id: string
  name: string
  children: CourseSubCategory[]
}

export interface CoursesPageMeta {
  title: string
  description: string
}
