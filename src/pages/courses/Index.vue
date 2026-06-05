<script setup lang="ts">
import { computed, ref } from 'vue'
import type { CourseItem } from '@/types/pageDesign/courses'
import {
  coursesMeta,
  courseCategoryGroups,
  courseItems,
  defaultCategoryId,
  paginationConfig,
} from '@/data/pageDesign/courses'
import CourseCategorySidebar from './CourseCategorySidebar.vue'
import CourseGrid from './CourseGrid.vue'
import CoursePagination from './CoursePagination.vue'

const PAGE_SIZE = paginationConfig.pageSize

const selectedCategoryId = ref<string>(defaultCategoryId)
const currentPage = ref(1)

const filteredCourses = computed<CourseItem[]>(() => {
  if (!selectedCategoryId.value) return courseItems
  return courseItems.filter((item) => item.categoryId === selectedCategoryId.value)
})

const totalPages = computed(() => Math.ceil(filteredCourses.value.length / PAGE_SIZE))

const pagedCourses = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return filteredCourses.value.slice(start, start + PAGE_SIZE)
})

function onCategoryChange(id: string): void {
  selectedCategoryId.value = id
  currentPage.value = 1
}

function onPageChange(page: number): void {
  currentPage.value = page
}
</script>

<template>
  <div class="pt-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Page Header -->
      <div class="flex items-end justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-foreground mb-2">{{ coursesMeta.title }}</h1>
          <p class="text-muted-foreground">{{ coursesMeta.description }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Left Sidebar -->
        <CourseCategorySidebar
          :category-groups="courseCategoryGroups"
          :selected-category-id="selectedCategoryId"
          @update:selected-category-id="onCategoryChange"
        />

        <!-- Main Content -->
        <main class="lg:col-span-9">
          <CourseGrid :courses="pagedCourses" />

          <CoursePagination
            v-if="totalPages > 1"
            :current-page="currentPage"
            :total-pages="totalPages"
            @update:current-page="onPageChange"
          />
        </main>
      </div>
    </div>
  </div>
</template>
