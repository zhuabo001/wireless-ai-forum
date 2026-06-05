<script setup lang="ts">
import type { ForumTab, ForumFilterOption } from '@/types/pageDesign/forum'
import IconRenderer from '@/components/ui/IconRenderer.vue'

defineProps<{
  activeTab: string
  selectedCategory: string
  selectedSort: string
  keyword: string
  tabs: ForumTab[]
  categoryOptions: ForumFilterOption[]
  sortOptions: ForumFilterOption[]
}>()

const emit = defineEmits<{
  'update:activeTab': [tabId: string]
  'update:selectedCategory': [categoryId: string]
  'update:selectedSort': [sortId: string]
  'update:keyword': [keyword: string]
}>()

function onTabClick(tabId: string): void {
  emit('update:activeTab', tabId)
}

function onCategoryChange(event: Event): void {
  const target = event.target as HTMLSelectElement
  emit('update:selectedCategory', target.value)
}

function onSortChange(event: Event): void {
  const target = event.target as HTMLSelectElement
  emit('update:selectedSort', target.value)
}

function onKeywordInput(event: Event): void {
  const target = event.target as HTMLInputElement
  emit('update:keyword', target.value)
}
</script>

<template>
  <div>
    <!-- Tab Navigation -->
    <div class="flex items-center gap-1 mb-3 bg-white border border-border rounded-xl p-1 overflow-x-auto">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="px-4 py-2 text-sm font-medium whitespace-nowrap rounded-lg transition-colors"
        :class="activeTab === tab.id ? 'text-white bg-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted'"
        @click="onTabClick(tab.id)"
      >
        {{ tab.name }}
      </button>
    </div>

    <!-- Filter Row -->
    <div class="flex items-center gap-3 mb-6">
      <select
        :value="selectedCategory"
        class="px-3 py-2 text-sm border border-border rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors cursor-pointer appearance-none"
        @change="onCategoryChange"
      >
        <option v-for="opt in categoryOptions" :key="opt.id" :value="opt.id">
          {{ opt.name }}
        </option>
      </select>
      <select
        :value="selectedSort"
        class="px-3 py-2 text-sm border border-border rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors cursor-pointer appearance-none"
        @change="onSortChange"
      >
        <option v-for="opt in sortOptions" :key="opt.id" :value="opt.id">
          {{ opt.name }}
        </option>
      </select>
      <div class="relative flex-1">
        <IconRenderer name="search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="搜索话题..."
          :value="keyword"
          class="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          @input="onKeywordInput"
        >
      </div>
    </div>
  </div>
</template>
