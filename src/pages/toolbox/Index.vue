<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { ToolArticle } from '@/types/pageDesign/toolbox'
import {
  toolboxMeta,
  toolCategories,
  toolboxArticles,
  sortOptions,
  searchConfig,
  paginationConfig,
} from '@/data/pageDesign/toolbox'
import ToolCategorySidebar from './ToolCategorySidebar.vue'
import ToolboxSearchBar from './ToolboxSearchBar.vue'
import ToolArticleList from './ToolArticleList.vue'
import ToolboxPagination from './ToolboxPagination.vue'
import IconRenderer from '@/components/ui/IconRenderer.vue'

const PAGE_SIZE = paginationConfig.pageSize

const keyword = ref('')
const selectedCategoryId = ref('debug')
const sortKey = ref('latest')
const currentPage = ref(1)

const filteredArticles = computed<ToolArticle[]>(() => {
  let list = toolboxArticles.filter((item) => item.categoryId === selectedCategoryId.value)

  if (keyword.value.trim()) {
    const kw = keyword.value.trim().toLowerCase()
    list = list.filter(
      (item) =>
        item.title.toLowerCase().includes(kw) ||
        item.summary.toLowerCase().includes(kw) ||
        item.author.toLowerCase().includes(kw),
    )
  }

  const sorter = (a: ToolArticle, b: ToolArticle) => {
    switch (sortKey.value) {
      case 'latest':
        return b.date.localeCompare(a.date)
      case 'popular':
        return b.title.localeCompare(a.title)
      case 'recommended':
        return a.title.localeCompare(b.title)
      default:
        return 0
    }
  }
  list.sort(sorter)

  return list
})

const totalPages = computed(() => Math.ceil(filteredArticles.value.length / PAGE_SIZE))

const pagedArticles = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return filteredArticles.value.slice(start, start + PAGE_SIZE)
})

function onCategoryChange(id: string) {
  selectedCategoryId.value = id
  currentPage.value = 1
}

function onSearch() {
  currentPage.value = 1
}

function onSortChange(key: string) {
  sortKey.value = key
  currentPage.value = 1
}

function onPageChange(page: number) {
  currentPage.value = page
}

watch(keyword, () => {
  currentPage.value = 1
})
</script>

<template>
  <div class="pt-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-bold text-foreground mb-2">{{ toolboxMeta.title }}</h1>
          <p class="text-muted-foreground">{{ toolboxMeta.description }}</p>
        </div>
        <button
          class="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
        >
          <IconRenderer name="file-plus-2" class="w-4 h-4" />提交手册
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Left Sidebar -->
        <ToolCategorySidebar
          :categories="toolCategories"
          :selected-category-id="selectedCategoryId"
          @update:selected-category-id="onCategoryChange"
        />

        <!-- Main Content -->
        <main class="lg:col-span-9">
          <ToolboxSearchBar
            :keyword="keyword"
            :placeholder="searchConfig.placeholder"
            :sort-key="sortKey"
            :sort-options="sortOptions"
            @update:keyword="(v) => (keyword = v)"
            @update:sort-key="onSortChange"
            @search="onSearch"
          />

          <ToolArticleList :articles="pagedArticles" />

          <ToolboxPagination
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
