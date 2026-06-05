<script setup lang="ts">
import { computed, ref } from 'vue'
import type { TopicItem } from '@/types/pageDesign/forum'
import {
  forumMeta,
  forumTabs,
  categoryFilterOptions,
  sortFilterOptions,
  topicItems,
  sidebarData,
  defaultTabId,
  paginationConfig,
} from '@/data/pageDesign/forum'
import ForumToolbar from './ForumToolbar.vue'
import ForumTopicList from './ForumTopicList.vue'
import ForumPagination from './ForumPagination.vue'
import ForumSidebar from './ForumSidebar.vue'

const PAGE_SIZE = paginationConfig.pageSize

const activeTab = ref<string>(defaultTabId)
const selectedCategory = ref<string>('all')
const selectedSort = ref<string>('latest')
const keyword = ref<string>('')
const currentPage = ref<number>(1)

const filteredAndSortedTopics = computed<TopicItem[]>(() => {
  let result = [...topicItems]

  if (activeTab.value === 'hot') {
    result.sort((a, b) => b.likes - a.likes)
  } else if (activeTab.value !== 'all') {
    const tabName = forumTabs.find((t) => t.id === activeTab.value)?.name
    if (tabName) {
      result = result.filter((t) => t.categoryBadge === tabName)
    }
  }

  if (keyword.value.trim()) {
    const kw = keyword.value.trim().toLowerCase()
    result = result.filter(
      (t) =>
        t.title.toLowerCase().includes(kw) ||
        t.author.name.toLowerCase().includes(kw) ||
        t.tagBadge.toLowerCase().includes(kw)
    )
  }

  if (selectedSort.value === 'hottest') {
    result.sort((a, b) => b.likes - a.likes)
  }

  return result
})

const totalPages = computed<number>(() => Math.ceil(filteredAndSortedTopics.value.length / PAGE_SIZE))

const pagedTopics = computed<TopicItem[]>(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return filteredAndSortedTopics.value.slice(start, start + PAGE_SIZE)
})

function onTabChange(tabId: string): void {
  activeTab.value = tabId
  currentPage.value = 1
}

function onCategoryChange(categoryId: string): void {
  selectedCategory.value = categoryId
  currentPage.value = 1
}

function onSortChange(sortId: string): void {
  selectedSort.value = sortId
  currentPage.value = 1
}

function onKeywordChange(value: string): void {
  keyword.value = value
  currentPage.value = 1
}

function onPageChange(page: number): void {
  currentPage.value = page
}

function onCreateTopic(): void {
  console.log('发起话题')
}
</script>

<template>
  <div class="pt-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Page Header -->
      <div class="flex items-end justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-foreground mb-2">{{ forumMeta.title }}</h1>
          <p class="text-muted-foreground">{{ forumMeta.description }}</p>
        </div>
        <button
          class="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
          @click="onCreateTopic"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          {{ forumMeta.createButtonText }}
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Main Content -->
        <main class="lg:col-span-8">
          <ForumToolbar
            :active-tab="activeTab"
            :selected-category="selectedCategory"
            :selected-sort="selectedSort"
            :keyword="keyword"
            :tabs="forumTabs"
            :category-options="categoryFilterOptions"
            :sort-options="sortFilterOptions"
            @update:active-tab="onTabChange"
            @update:selected-category="onCategoryChange"
            @update:selected-sort="onSortChange"
            @update:keyword="onKeywordChange"
          />

          <ForumTopicList :topics="pagedTopics" />

          <ForumPagination
            v-if="totalPages > 1"
            :current-page="currentPage"
            :total-pages="totalPages"
            @update:current-page="onPageChange"
          />
        </main>

        <!-- Right Sidebar -->
        <ForumSidebar :sidebar-data="sidebarData" />
      </div>
    </div>
  </div>
</template>
