<script setup lang="ts">
import type { ResourceLink } from '@/types/pageDesign/forumPostDetail'
import IconRenderer from '@/components/ui/IconRenderer.vue'

defineProps<{
  links: ResourceLink[]
}>()
</script>

<template>
  <div class="flex flex-wrap gap-2 mt-8 pt-6 border-t border-border">
    <span class="text-sm text-muted-foreground mr-2">相关链接：</span>
    <a
      v-for="link in links"
      :key="link.title"
      :href="link.url"
      target="_blank"
      class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-muted rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
    >
      <IconRenderer :name="link.icon" class="w-3.5 h-3.5" />
      {{ link.title }}
    </a>
  </div>
</template>
