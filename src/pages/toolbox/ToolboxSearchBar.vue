<script setup lang="ts">
import type { SortOption } from '@/types/pageDesign/toolbox'
import IconRenderer from '@/components/ui/IconRenderer.vue'

defineProps<{
  keyword: string
  placeholder: string
  sortKey: string
  sortOptions: SortOption[]
}>()

const emit = defineEmits<{
  'update:keyword': [value: string]
  'update:sortKey': [value: string]
  search: []
}>()

function onInput(e: Event) {
  const target = e.target as HTMLInputElement
  emit('update:keyword', target.value)
}

function currentSortLabel(options: SortOption[], key: string): string {
  return options.find((o) => o.key === key)?.label ?? '最新'
}
</script>

<template>
  <div class="bg-white rounded-xl border border-border p-4 mb-4">
    <div class="flex flex-col sm:flex-row sm:items-center gap-3">
      <div class="relative flex-1">
        <IconRenderer name="search" class="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          :value="keyword"
          :placeholder="placeholder"
          class="w-full pl-9 pr-4 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          @input="onInput"
        />
      </div>
      <button
        class="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        @click="emit('search')"
      >
        <IconRenderer name="search" class="w-4 h-4" />搜索
      </button>
      <button
        class="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium bg-white border border-border text-muted-foreground rounded-lg hover:bg-muted hover:text-foreground transition-colors"
        @click="emit('update:sortKey', sortOptions[0].key === sortKey ? sortOptions[1]?.key ?? sortKey : sortOptions[0].key)"
      >
        <IconRenderer name="arrow-down-up" class="w-4 h-4" />{{ currentSortLabel(sortOptions, sortKey) }}
      </button>
    </div>
  </div>
</template>
