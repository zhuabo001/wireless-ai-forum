<script setup lang="ts">
import type { IntelligenceItem } from '@/types/pageDesign/intelligence'
import IntelligenceCard from './IntelligenceCard.vue'

defineProps<{
  items: IntelligenceItem[]
  hasMore: boolean
}>()

const emit = defineEmits<{
  loadMore: []
}>()
</script>

<template>
  <div class="space-y-4">
    <IntelligenceCard v-for="item in items" :key="item.id" :item="item" />

    <div v-if="items.length === 0" class="text-center py-12 text-muted-foreground text-sm">
      没有找到匹配的情报
    </div>

    <button
      v-if="hasMore"
      class="w-full py-3 text-sm font-medium text-muted-foreground hover:text-foreground bg-white border border-border rounded-xl hover:shadow-sm transition-all"
      @click="emit('loadMore')"
    >
      加载更多
    </button>
  </div>
</template>
