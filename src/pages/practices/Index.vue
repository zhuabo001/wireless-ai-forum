<script setup lang="ts">
import { ref, computed } from 'vue'
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

const totalPages = computed(() => Math.max(1, Math.ceil(filteredItems.value.length / pageSize)))

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

const paginationModel = computed({
  get: () => currentPage.value,
  set: (val: number) => { currentPage.value = val },
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-bold text-foreground mb-2">{{ practicesMeta.title }}</h1>
        <p class="text-muted-foreground">{{ practicesMeta.description }}</p>
      </div>
      <button class="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm">
        <IconRenderer name="plus" class="w-4 h-4" />
        发布实践
      </button>
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
        />

        <div class="space-y-4">
          <PracticeCard
            v-for="item in pagedItems"
            :key="item.id"
            :item="item"
          />
        </div>

        <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-6">
          <button
            class="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            :disabled="currentPage <= 1"
            @click="currentPage--"
          >
            <IconRenderer name="chevron-left" class="w-4 h-4" />
          </button>

          <template v-for="page in totalPages" :key="page">
            <button
              v-if="totalPages <= 6 || page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1"
              class="px-3 py-1.5 text-sm font-medium rounded-lg transition-colors"
              :class="page === currentPage
                ? 'text-white bg-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'"
              @click="currentPage = page"
            >{{ page }}</button>
            <span
              v-else-if="page === 2 || page === totalPages - 1"
              :key="'ellipsis-' + page"
              class="text-muted-foreground px-1"
            >...</span>
          </template>

          <button
            class="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            :disabled="currentPage >= totalPages"
            @click="currentPage++"
          >
            <IconRenderer name="chevron-right" class="w-4 h-4" />
          </button>
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
