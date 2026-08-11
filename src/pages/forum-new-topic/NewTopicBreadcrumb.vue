<script setup lang="ts">
import type { BreadcrumbItem } from '@/types/pageDesign/forumNewTopic'
import IconRenderer from '@/components/ui/IconRenderer.vue'

defineProps<{
  backLink: string
  backTitle: string
  breadcrumbItems: BreadcrumbItem[]
  currentLabel: string
  sourceLabel?: string
}>()
</script>

<template>
  <div class="mb-8">
    <div class="flex items-center gap-3 mb-3">
      <router-link
        :to="backLink"
        :title="backTitle"
        class="w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center hover:bg-muted transition-colors"
      >
        <IconRenderer name="arrow-left" class="w-4 h-4 text-muted-foreground" />
      </router-link>
      <div class="flex items-center gap-2 text-sm text-muted-foreground">
        <template v-for="item in breadcrumbItems" :key="item.href">
          <router-link :to="item.href" class="hover:text-primary transition-colors">
            {{ sourceLabel ?? item.label }}
          </router-link>
          <IconRenderer name="chevron-right" class="w-3.5 h-3.5" />
        </template>
        <span class="text-foreground">{{ currentLabel }}</span>
      </div>
    </div>
    <h1 class="text-2xl font-bold text-foreground">{{ currentLabel }}</h1>
  </div>
</template>
