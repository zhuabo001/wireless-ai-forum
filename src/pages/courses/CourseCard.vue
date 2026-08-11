<script setup lang="ts">
import type { CourseItem } from '@/types/pageDesign/courses'
import TagBadge from '@/components/ui/TagBadge.vue'
import { courseCategoryGroups } from '@/data/pageDesign/courses'

defineProps<{
  course: CourseItem
}>()

function categoryName(categoryId: string): string {
  for (const group of courseCategoryGroups) {
    const child = group.children.find((c: { id: string; name: string }) => c.id === categoryId)
    if (child) return child.name
  }
  return categoryId
}
</script>

<template>
  <div class="bg-white rounded-xl border border-border hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden cursor-pointer group">
    <div
      class="relative h-36 overflow-hidden bg-gradient-to-br flex items-center justify-center"
      :class="[course.gradientFrom, course.gradientTo]"
    >
      <span class="text-white text-2xl font-bold opacity-30">{{ course.initials }}</span>
      <TagBadge
        :label="categoryName(course.categoryId)"
        class-name="absolute top-3 left-3 text-xs font-medium bg-white/90 backdrop-blur-sm text-foreground rounded-md"
      />
    </div>
    <div class="p-4">
      <h3 class="text-sm font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">{{ course.title }}</h3>
      <p class="text-xs text-muted-foreground line-clamp-2 mb-3">{{ course.summary }}</p>
      <div class="flex items-center gap-2 pt-3 border-t border-border">
        <div class="w-5 h-5 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex-shrink-0" />
        <div class="min-w-0">
          <p class="text-xs text-foreground truncate">{{ course.author.name }} · {{ course.author.employeeId }}</p>
          <p class="text-xs text-muted-foreground truncate">{{ course.author.department }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
