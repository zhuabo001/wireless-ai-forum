<script setup lang="ts">
import { computed, ref } from 'vue'
import type { IntelligenceItem } from '@/types/pageDesign/intelligence'
import {
  intelligenceMeta,
  categoryFilters,
  timeRangeOptions,
  intelligenceItems,
  searchConfig,
} from '@/data/pageDesign/intelligence'
import IntelligenceSidebar from './IntelligenceSidebar.vue'
import IntelligenceSearch from './IntelligenceSearch.vue'
import IntelligenceList from './IntelligenceList.vue'

const INITIAL_COUNT = 6

const keyword = ref('')
const selectedCategoryId = ref('all')
const selectedTimeRange = ref('今日')
const visibleCount = ref(INITIAL_COUNT)

const filteredItems = computed<IntelligenceItem[]>(() => {
  let list = [...intelligenceItems]
  if (selectedCategoryId.value !== 'all') {
    list = list.filter((item) => item.categoryId === selectedCategoryId.value)
  }
  if (keyword.value.trim()) {
    const kw = keyword.value.trim().toLowerCase()
    list = list.filter(
      (item) =>
        item.title.toLowerCase().includes(kw) || item.summary.toLowerCase().includes(kw),
    )
  }
  return list
})

const displayedItems = computed(() => filteredItems.value.slice(0, visibleCount.value))

const hasMore = computed(() => visibleCount.value < filteredItems.value.length)

function loadMore() {
  visibleCount.value += 4
}

function onCategoryChange(id: string) {
  selectedCategoryId.value = id
  visibleCount.value = INITIAL_COUNT
}
</script>

<template>
  <div class="pt-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-foreground mb-2">{{ intelligenceMeta.title }}</h1>
        <p class="text-muted-foreground">{{ intelligenceMeta.description }}</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Left Sidebar -->
        <IntelligenceSidebar
          :categories="categoryFilters"
          :time-ranges="timeRangeOptions"
          :selected-category-id="selectedCategoryId"
          :selected-time-range="selectedTimeRange"
          @update:selected-category-id="onCategoryChange"
          @update:selected-time-range="(v) => (selectedTimeRange = v)"
        />

        <!-- Main Content -->
        <main class="lg:col-span-9 space-y-4">
          <IntelligenceSearch
            :keyword="keyword"
            :placeholder="searchConfig.placeholder"
            @update:keyword="(v) => (keyword = v)"
          />

          <!-- Mobile filter pills -->
          <div class="lg:hidden flex gap-2 overflow-x-auto pb-2">
            <button
              v-for="cat in categoryFilters"
              :key="cat.id"
              class="px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors"
              :class="
                selectedCategoryId === cat.id
                  ? 'bg-primary text-white'
                  : 'bg-white border border-border text-muted-foreground'
              "
              @click="onCategoryChange(cat.id)"
            >
              {{ cat.name }}
            </button>
          </div>

          <IntelligenceList
            :items="displayedItems"
            :has-more="hasMore"
            @load-more="loadMore"
          />
        </main>
      </div>
    </div>
  </div>
</template>
