<script setup lang="ts">
import { computed } from 'vue'
import IconRenderer from '@/components/ui/IconRenderer.vue'

const props = defineProps<{
  currentPage: number
  totalPages: number
}>()

const emit = defineEmits<{
  'update:currentPage': [value: number]
}>()

interface PageItem {
  type: 'page' | 'ellipsis'
  value?: number
}

const pages = computed<PageItem[]>(() => {
  const result: PageItem[] = []
  const total = props.totalPages

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      result.push({ type: 'page', value: i })
    }
  } else {
    result.push({ type: 'page', value: 1 })
    if (props.currentPage > 3) {
      result.push({ type: 'ellipsis' })
    }
    const start = Math.max(2, props.currentPage - 1)
    const end = Math.min(total - 1, props.currentPage + 1)
    for (let i = start; i <= end; i++) {
      result.push({ type: 'page', value: i })
    }
    if (props.currentPage < total - 2) {
      result.push({ type: 'ellipsis' })
    }
    result.push({ type: 'page', value: total })
  }

  return result
})
</script>

<template>
  <div class="flex items-center justify-center gap-2 mt-8">
    <button
      class="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
      :class="{ 'opacity-50 pointer-events-none': currentPage === 1 }"
      :disabled="currentPage === 1"
      @click="emit('update:currentPage', currentPage - 1)"
    >
      <IconRenderer name="chevron-left" class-name="w-4 h-4" />
    </button>

    <template v-for="(page, index) in pages" :key="index">
      <span v-if="page.type === 'ellipsis'" class="text-muted-foreground">...</span>
      <button
        v-else
        class="px-3 py-1.5 text-sm font-medium rounded-lg transition-colors"
        :class="
          currentPage === page.value
            ? 'text-white bg-primary'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
        "
        @click="emit('update:currentPage', page.value!)"
      >
        {{ page.value }}
      </button>
    </template>

    <button
      class="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
      :class="{ 'opacity-50 pointer-events-none': currentPage === totalPages }"
      :disabled="currentPage === totalPages"
      @click="emit('update:currentPage', currentPage + 1)"
    >
      <IconRenderer name="chevron-right" class-name="w-4 h-4" />
    </button>
  </div>
</template>
