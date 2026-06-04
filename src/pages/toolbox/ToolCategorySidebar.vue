<script setup lang="ts">
import type { ToolCategory } from '@/types/pageDesign/toolbox'
import IconRenderer from '@/components/ui/IconRenderer.vue'

defineProps<{
  categories: ToolCategory[]
  selectedCategoryId: string
}>()

const emit = defineEmits<{
  'update:selectedCategoryId': [value: string]
}>()
</script>

<template>
  <aside class="hidden lg:block lg:col-span-3">
    <div class="sticky top-24">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-sm font-semibold text-foreground">智能体工具</h2>
        <span class="text-xs text-muted-foreground">42 个</span>
      </div>
      <div class="grid sm:grid-cols-2 lg:grid-cols-1 gap-3">
        <button
          v-for="cat in categories"
          :key="cat.id"
          class="rounded-xl p-4 text-left transition-all"
          :class="
            selectedCategoryId === cat.id
              ? 'bg-primary text-white shadow-sm'
              : 'bg-white border border-border hover:shadow-md hover:-translate-y-0.5'
          "
          @click="emit('update:selectedCategoryId', cat.id)"
        >
          <div class="flex items-center justify-between">
            <span
              class="text-sm font-semibold"
              :class="selectedCategoryId === cat.id ? 'text-white' : 'text-foreground'"
            >
              {{ cat.name }}
            </span>
            <IconRenderer
              :name="cat.icon"
              :class="selectedCategoryId === cat.id ? 'w-4 h-4 opacity-90' : 'w-4 h-4 text-muted-foreground'"
            />
          </div>
          <p
            class="text-xs mt-2"
            :class="selectedCategoryId === cat.id ? 'text-white/75' : 'text-muted-foreground'"
          >
            {{ cat.count }} 篇帖子
          </p>
        </button>
      </div>
    </div>
  </aside>
</template>
