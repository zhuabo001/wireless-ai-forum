<script setup lang="ts">
import { computed } from 'vue'
import IconRenderer from '@/components/ui/IconRenderer.vue'

const props = defineProps<{
  currentPage: number
  totalPages: number
}>()

const emit = defineEmits<{
  'update:currentPage': [page: number]
}>()

const pages = computed<number[]>(() => {
  const result: number[] = []
  for (let i = 1; i <= props.totalPages; i++) {
    result.push(i)
  }
  return result
})
</script>

<template>
  <div class="flex items-center justify-center gap-2 mt-6">
    <button
      class="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
      :class="{ 'pointer-events-none opacity-40': currentPage <= 1 }"
      @click="emit('update:currentPage', currentPage - 1)"
    >
      <IconRenderer name="chevron-left" class="w-4 h-4" />
    </button>
    <button
      v-for="page in pages"
      :key="page"
      class="px-3 py-1.5 text-sm font-medium rounded-lg transition-colors"
      :class="page === currentPage ? 'text-white bg-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted'"
      @click="emit('update:currentPage', page)"
    >
      {{ page }}
    </button>
    <button
      class="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
      :class="{ 'pointer-events-none opacity-40': currentPage >= totalPages }"
      @click="emit('update:currentPage', currentPage + 1)"
    >
      <IconRenderer name="chevron-right" class="w-4 h-4" />
    </button>
  </div>
</template>
