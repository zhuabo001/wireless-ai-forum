<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElButton, ElPagination } from 'element-plus'
import { practicesMeta, practiceCategories, practiceItems, hotPosts, contributors, teams } from '@/data/pageDesign/practices'
import IconRenderer from '@/components/ui/IconRenderer.vue'
import PracticeCategorySidebar from './PracticeCategorySidebar.vue'
import PracticeToolbar from './PracticeToolbar.vue'
import PracticeCard from './PracticeCard.vue'
import PracticeSidebar from './PracticeSidebar.vue'

const defaultExpanded = new Set(
  practiceCategories.filter(c => c.defaultExpanded).map(c => c.id),
)

const expandedCategoryIds = ref<Set<string>>(defaultExpanded)
const firstSubId = practiceCategories[0]?.children[0]?.id ?? null
const selectedCategoryId = ref<string | null>(firstSubId)
const currentPage = ref(1)
const pageSize = 4

const filteredItems = computed(() => {
  if (!selectedCategoryId.value) return practiceItems
  return practiceItems.filter(item => item.categoryId === selectedCategoryId.value)
})

const totalItems = computed(() => filteredItems.value.length)

const pagedItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredItems.value.slice(start, start + pageSize)
})

const activeCategoryInfo = computed(() => {
  for (const cat of practiceCategories) {
    const sub = cat.children.find(s => s.id === selectedCategoryId.value)
    if (sub) return { name: sub.name, count: sub.count }
  }
  return { name: '全部实践', count: practiceItems.length }
})

function onSelectCategory(id: string | null): void {
  selectedCategoryId.value = id
  currentPage.value = 1
}

function onToggleExpanded(ids: Set<string>): void {
  expandedCategoryIds.value = ids
}

function onPageChange(page: number): void {
  currentPage.value = page
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-bold text-foreground mb-2">{{ practicesMeta.title }}</h1>
        <p class="text-muted-foreground">{{ practicesMeta.description }}</p>
      </div>
      <ElButton type="primary" size="default" class="!inline-flex !items-center gap-2">
        <IconRenderer name="plus" class="w-4 h-4" />
        发布实践
      </ElButton>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <PracticeCategorySidebar
        :categories="practiceCategories"
        :expanded-category-ids="expandedCategoryIds"
        :selected-category-id="selectedCategoryId"
        @update:expanded-category-ids="onToggleExpanded"
        @update:selected-category-id="onSelectCategory"
      />

      <main class="lg:col-span-6">
        <PracticeToolbar
          :category-name="activeCategoryInfo.name"
          :category-count="activeCategoryInfo.count"
          :active-category-id="selectedCategoryId ?? ''"
        />

        <div class="space-y-4">
          <PracticeCard
            v-for="item in pagedItems"
            :key="item.id"
            :item="item"
          />
        </div>

        <div v-if="totalItems > pageSize" class="flex justify-center mt-6">
          <ElPagination
            :current-page="currentPage"
            :page-size="pageSize"
            :total="totalItems"
            :pager-count="5"
            layout="prev, pager, next"
            size="small"
            @current-change="onPageChange"
            class="practices-pagination"
          />
        </div>
      </main>

      <PracticeSidebar
        :hot-posts="hotPosts"
        :contributors="contributors"
        :teams="teams"
      />
    </div>
  </div>
</template>

<style scoped>
.practices-pagination :deep(.el-pager li) {
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.5rem;
  min-width: 2rem;
  height: 2rem;
  margin: 0 0.125rem;
}
.practices-pagination :deep(.el-pager li.is-active) {
  color: #fff;
  background-color: #0d55c9;
}
.practices-pagination :deep(.el-pagination button) {
  border-radius: 0.5rem;
  height: 2rem;
  min-width: 2rem;
}
</style>
