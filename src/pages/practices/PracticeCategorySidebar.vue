<script setup lang="ts">
import { computed, ref } from 'vue'
import type { PracticeCategory } from '@/types/pageDesign/practices'
import IconRenderer from '@/components/ui/IconRenderer.vue'

const props = defineProps<{
  categories: PracticeCategory[]
  selectedSubCategoryId: string
}>()

const emit = defineEmits<{
  select: [categoryId: string, subCategoryId: string]
}>()

const totalCount = computed(() =>
  props.categories.reduce((sum, cat) => {
    return sum + cat.subCategories.reduce((s, sub) => s + sub.count, 0)
  }, 0),
)

const expandedCategories = ref<Set<string>>(new Set(['wireless-rd']))

function toggleCategory(categoryId: string) {
  const next = new Set(expandedCategories.value)
  if (next.has(categoryId)) {
    next.delete(categoryId)
  } else {
    next.add(categoryId)
  }
  expandedCategories.value = next
}
</script>

<template>
  <div class="sticky top-24 bg-white rounded-xl border border-border p-4">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-sm font-semibold text-foreground">实践分类</h2>
      <span class="text-xs text-muted-foreground">{{ totalCount }}篇</span>
    </div>
    <div class="space-y-4">
      <div v-for="cat in categories" :key="cat.id">
        <button
          class="w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors"
          :class="
            expandedCategories.has(cat.id)
              ? 'text-white bg-primary'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          "
          @click="toggleCategory(cat.id)"
        >
          <span class="flex items-center gap-2">
            <IconRenderer :name="cat.icon" class="w-4 h-4" />
            {{ cat.name }}
          </span>
          <IconRenderer name="chevron-down" class="w-4 h-4" />
        </button>
        <div v-if="expandedCategories.has(cat.id)" class="mt-2 space-y-0.5">
          <button
            v-for="sub in cat.subCategories"
            :key="sub.id"
            class="w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors"
            :class="
              selectedSubCategoryId === sub.id
                ? 'text-foreground bg-muted'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            "
            @click="emit('select', cat.id, sub.id)"
          >
            <span>{{ sub.name }}</span>
            <span class="text-xs" :class="selectedSubCategoryId === sub.id ? 'text-foreground' : 'text-muted-foreground'">
              {{ sub.count }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
