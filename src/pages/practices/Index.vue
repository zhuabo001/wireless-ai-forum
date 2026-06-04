<script setup lang="ts">
import { computed, ref } from 'vue'
import type { PracticeItem } from '@/types/pageDesign/practices'
import {
  practicesMeta,
  practiceCategories,
  practiceItems,
  hotPosts,
  contributors,
  teams,
} from '@/data/pageDesign/practices'
import PracticeCategorySidebar from './PracticeCategorySidebar.vue'
import PracticeToolbar from './PracticeToolbar.vue'
import PracticeList from './PracticeList.vue'
import PracticeSidebar from './PracticeSidebar.vue'
import IconRenderer from '@/components/ui/IconRenderer.vue'

const PAGE_SIZE = 4

const selectedSubCategoryId = ref<string>('protocol-analysis')
const selectedCategoryId = ref<string>('wireless-rd')
const currentPage = ref<number>(1)

function onCategorySelect(categoryId: string, subCategoryId: string) {
  selectedCategoryId.value = categoryId
  selectedSubCategoryId.value = subCategoryId
  currentPage.value = 1
}

const currentCategoryName = computed<string>(() => {
  for (const cat of practiceCategories) {
    for (const sub of cat.subCategories) {
      if (sub.id === selectedSubCategoryId.value) return sub.name
    }
  }
  return '全部'
})

const filteredItems = computed<PracticeItem[]>(() =>
  practiceItems.filter((item) => item.subCategoryId === selectedSubCategoryId.value),
)

const filteredCount = computed(() => filteredItems.value.length)

const totalPages = computed(() => Math.ceil(filteredItems.value.length / PAGE_SIZE))

const pagedItems = computed<PracticeItem[]>(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return filteredItems.value.slice(start, start + PAGE_SIZE)
})

const pageNumbers = computed<(number | string)[]>(() => {
  const pages: (number | string)[] = []
  const total = totalPages.value
  for (let i = 1; i <= total; i++) {
    pages.push(i)
  }
  return pages
})

function goToPage(page: number | string) {
  if (typeof page === 'number') {
    currentPage.value = page
  }
}

function handlePublish() {
  // 打桩：后续接入发布实践功能
  console.log('发布实践')
}
</script>

<template>
  <div class="pt-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-bold text-foreground mb-2">{{ practicesMeta.title }}</h1>
          <p class="text-muted-foreground">{{ practicesMeta.description }}</p>
        </div>
        <button
          class="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
          @click="handlePublish"
        >
          <IconRenderer name="plus" class="w-4 h-4" />
          {{ practicesMeta.publishButtonText }}
        </button>
      </div>

      <!-- Three-column Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Left Sidebar: Categories -->
        <aside class="lg:col-span-3">
          <PracticeCategorySidebar
            :categories="practiceCategories"
            :selected-sub-category-id="selectedSubCategoryId"
            @select="onCategorySelect"
          />
        </aside>

        <!-- Main Content: Practice List + Pagination -->
        <main class="lg:col-span-6">
          <PracticeToolbar
            :current-category-name="currentCategoryName"
            :filtered-count="filteredCount"
            sort-label="最新发布"
            @filter="() => {}"
          />

          <PracticeList :items="pagedItems" />

          <!-- Pagination -->
          <div class="flex items-center justify-center gap-2 mt-6">
            <button
              class="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
              :disabled="currentPage <= 1"
              @click="goToPage(currentPage - 1)"
            >
              <IconRenderer name="chevron-left" class="w-4 h-4" />
            </button>
            <button
              v-for="p in pageNumbers"
              :key="p"
              class="px-3 py-1.5 text-sm font-medium rounded-lg transition-colors"
              :class="
                currentPage === p
                  ? 'text-white bg-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              "
              @click="goToPage(p)"
            >
              {{ p }}
            </button>
            <button
              class="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
              :disabled="currentPage >= totalPages"
              @click="goToPage(currentPage + 1)"
            >
              <IconRenderer name="chevron-right" class="w-4 h-4" />
            </button>
          </div>
        </main>

        <!-- Right Sidebar -->
        <aside class="lg:col-span-3">
          <PracticeSidebar :hot-posts="hotPosts" :contributors="contributors" :teams="teams" />
        </aside>
      </div>
    </div>
  </div>
</template>
