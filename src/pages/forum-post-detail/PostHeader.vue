<script setup lang="ts">
import type { PostAuthor } from '@/types/pageDesign/forumPostDetail'
import IconRenderer from '@/components/ui/IconRenderer.vue'

defineProps<{
  backLink: string
  backTitle: string
  categories: string[]
  title: string
  author: PostAuthor
  publishDate: string
  viewCount: number
  commentCount: number
}>()

const categoryColorMap: Record<number, string> = {
  0: 'bg-primary/10 text-primary',
  1: 'bg-emerald-50 text-emerald-700',
  2: 'bg-violet-50 text-violet-600',
  3: 'bg-amber-50 text-amber-700',
  4: 'bg-rose-50 text-rose-700',
}
</script>

<template>
  <div>
    <div class="mb-6">
      <router-link
        :to="backLink"
        class="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <IconRenderer name="arrow-left" class="w-4 h-4" />
        <span>{{ backTitle }}</span>
      </router-link>
    </div>

    <header class="mb-10">
      <div class="flex flex-wrap items-center gap-2 mb-4">
        <span
          v-for="(cat, index) in categories"
          :key="cat"
          :class="['px-2.5 py-1 text-xs font-medium rounded-md', categoryColorMap[index] ?? 'bg-muted text-muted-foreground']"
        >
          {{ cat }}
        </span>
      </div>

      <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-6">
        {{ title }}
      </h1>

      <div class="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <div class="flex items-center gap-2.5">
          <img
            :src="author.avatar"
            :alt="author.name"
            class="w-9 h-9 rounded-full bg-muted border border-border"
          >
          <div>
            <div class="font-medium text-foreground text-sm">{{ author.name }}</div>
            <div class="text-xs">{{ author.title }}</div>
          </div>
        </div>
        <div class="hidden sm:block w-px h-6 bg-border"></div>
        <div class="flex items-center gap-1.5">
          <IconRenderer name="clock" class="w-3.5 h-3.5" />
          <span>{{ publishDate }}</span>
        </div>
        <div class="flex items-center gap-1.5">
          <IconRenderer name="eye" class="w-3.5 h-3.5" />
          <span>{{ viewCount.toLocaleString() }} 浏览</span>
        </div>
        <div class="flex items-center gap-1.5">
          <IconRenderer name="message-square" class="w-3.5 h-3.5" />
          <span>{{ commentCount }} 评论</span>
        </div>
      </div>
    </header>
  </div>
</template>
