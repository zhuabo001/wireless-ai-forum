<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { ToolArticle } from '@/types/pageDesign/toolbox'

const props = defineProps<{
  article: ToolArticle
}>()

const router = useRouter()

function goToPostDetail(): void {
  if (props.article.postId) {
    router.push({
      path: `/forum/post/${props.article.postId}`,
      query: { from: 'toolbox' },
    })
  }
}
</script>

<template>
  <article class="p-5 hover:bg-gray-50 transition-colors cursor-pointer group" @click="goToPostDetail">
    <h3 class="text-base font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
      {{ article.title }}
    </h3>
    <p class="text-sm text-muted-foreground line-clamp-2 mb-4">
      {{ article.summary }}
    </p>
    <div class="flex items-center gap-2">
      <img
        :src="article.avatar"
        :alt="article.author"
        class="w-8 h-8 rounded-full object-cover"
      />
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-foreground">{{ article.author }}</p>
        <p class="text-xs text-muted-foreground">发布日期：{{ article.date }}</p>
      </div>
    </div>
  </article>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
