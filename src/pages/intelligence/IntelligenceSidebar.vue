<script setup lang="ts">
import type { IntelligenceCategory } from '@/types/pageDesign/intelligence'

defineProps<{
  categories: IntelligenceCategory[]
  timeRanges: string[]
  selectedCategoryId: string
  selectedTimeRange: string
}>()

const emit = defineEmits<{
  'update:selectedCategoryId': [value: string]
  'update:selectedTimeRange': [value: string]
}>()

function selectCategory(id: string) {
  emit('update:selectedCategoryId', id)
}

function selectTimeRange(range: string) {
  emit('update:selectedTimeRange', range)
}
</script>

<template>
  <aside class="hidden lg:block lg:col-span-3">
    <div class="sticky top-24 space-y-6">
      <div>
        <h3 class="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          内容分类
        </h3>
        <div class="space-y-0.5">
          <button
            v-for="cat in categories"
            :key="cat.id"
            class="w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors"
            :class="
              selectedCategoryId === cat.id
                ? 'text-white bg-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            "
            @click="selectCategory(cat.id)"
          >
            <span>{{ cat.name }}</span>
            <span class="text-xs" :class="selectedCategoryId === cat.id ? 'opacity-80' : ''">
              {{ cat.count }}
            </span>
          </button>
        </div>
      </div>
      <div>
        <h3 class="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          时间范围
        </h3>
        <div class="space-y-0.5">
          <button
            v-for="range in timeRanges"
            :key="range"
            class="w-full text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors"
            :class="
              selectedTimeRange === range
                ? 'text-foreground bg-muted'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            "
            @click="selectTimeRange(range)"
          >
            {{ range }}
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>
