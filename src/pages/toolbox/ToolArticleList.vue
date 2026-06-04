<script setup lang="ts">
import type { ToolArticle } from '@/types/pageDesign/toolbox'
import ToolArticleItem from './ToolArticleItem.vue'

defineProps<{
  articles: ToolArticle[]
}>()
</script>

<template>
  <div class="bg-white rounded-xl border border-border overflow-hidden">
    <div class="divide-y divide-border/60">
      <ToolArticleItem
        v-for="item in articles"
        :key="item.id"
        :article="item"
      />
    </div>
    <div v-if="articles.length === 0" class="text-center py-12 text-muted-foreground text-sm">
      没有找到匹配的文章
    </div>
  </div>
</template>
