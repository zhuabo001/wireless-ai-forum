<script setup lang="ts">
import type { PracticeCategory } from '@/types/pageDesign/practices'
import IconRenderer from '@/components/ui/IconRenderer.vue'

const props = defineProps<{
  categories: PracticeCategory[]
  expandedCategoryIds: Set<string>
  selectedCategoryId: string | null
}>()

const emit = defineEmits<{
  'update:expandedCategoryIds': [ids: Set<string>]
  'update:selectedCategoryId': [id: string | null]
}>()

function toggleCategory(id: string): void {
  const next = new Set(props.expandedCategoryIds)
  if (next.has(id)) {
    next.delete(id)
  } else {
    next.add(id)
  }
  emit('update:expandedCategoryIds', next)
}

function selectSubCategory(subId: string): void {
  emit('update:selectedCategoryId', subId)
}

function isSelected(id: string): boolean {
  return props.selectedCategoryId === id
}
</script>

<template>
  <aside class="lg:col-span-3">
    <div class="sticky top-24 bg-white rounded-xl border border-border p-4">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-sm font-semibold text-foreground">实践分类</h2>
        <span class="text-xs text-muted-foreground">
          {{ categories.reduce((sum, c) => sum + c.count, 0) }}篇
        </span>
      </div>
      <div class="space-y-4">
        <div v-for="cat in categories" :key="cat.id">
          <button
            class="w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors"
            :class="expandedCategoryIds.has(cat.id)
              ? 'text-white bg-primary'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'"
            @click="toggleCategory(cat.id)"
          >
            <span class="flex items-center gap-2">
              <IconRenderer :name="cat.icon" class="w-4 h-4" />
              {{ cat.name }}
            </span>
            <IconRenderer
              name="chevron-down"
              class="w-4 h-4 transition-transform duration-200"
              :class="expandedCategoryIds.has(cat.id) ? '' : '-rotate-90'"
            />
          </button>
          <div v-if="expandedCategoryIds.has(cat.id)" class="mt-2 space-y-0.5">
            <button
              v-for="sub in cat.children"
              :key="sub.id"
              class="w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors"
              :class="isSelected(sub.id)
                ? 'text-foreground bg-muted'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'"
              @click="selectSubCategory(sub.id)"
            >
              <span>{{ sub.name }}</span>
              <span class="text-xs" :class="isSelected(sub.id) ? 'text-muted-foreground' : ''">{{ sub.count }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>
