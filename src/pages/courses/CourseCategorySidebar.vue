<script setup lang="ts">
import { ref } from 'vue'
import type { CourseCategoryGroup } from '@/types/pageDesign/courses'
import IconRenderer from '@/components/ui/IconRenderer.vue'

const props = defineProps<{
  categoryGroups: CourseCategoryGroup[]
  selectedCategoryId: string
}>()

const emit = defineEmits<{
  'update:selectedCategoryId': [value: string]
}>()

const expandedGroups = ref<Set<string>>(new Set(props.categoryGroups.map((g) => g.id)))

function toggleGroup(groupId: string): void {
  if (expandedGroups.value.has(groupId)) {
    expandedGroups.value.delete(groupId)
  } else {
    expandedGroups.value.add(groupId)
  }
}

function selectCategory(categoryId: string): void {
  emit('update:selectedCategoryId', categoryId)
}
</script>

<template>
  <aside class="lg:col-span-3 hidden lg:block">
    <div class="sticky top-24 space-y-1">
      <div v-for="group in categoryGroups" :key="group.id">
        <button
          class="flex items-center justify-between w-full px-3 py-2 text-sm font-semibold text-foreground rounded-lg hover:bg-muted transition-colors"
          @click="toggleGroup(group.id)"
        >
          <span>{{ group.name }}</span>
          <IconRenderer
            name="chevron-down"
            class-name="w-4 h-4 text-muted-foreground transition-transform"
            :class="{ 'rotate-180': expandedGroups.has(group.id) }"
          />
        </button>
        <div v-if="expandedGroups.has(group.id)" class="ml-2 pl-2 border-l border-border space-y-0.5 mt-0.5">
          <button
            v-for="child in group.children"
            :key="child.id"
            class="block w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors"
            :class="
              selectedCategoryId === child.id
                ? 'text-primary bg-primary/10 font-medium'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            "
            @click="selectCategory(child.id)"
          >
            {{ child.name }}
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>
