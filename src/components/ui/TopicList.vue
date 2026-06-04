<script setup lang="ts">
import IconRenderer from './IconRenderer.vue'
import type { ForumTopic } from '../../types/home'

defineProps<{
  topics: ForumTopic[]
}>()
</script>

<template>
  <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
    <div
      v-for="(topic, index) in topics"
      :key="topic.title"
      :class="[
        'flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer',
        index < topics.length - 1 ? 'border-b border-gray-100' : ''
      ]"
    >
      <img :src="topic.avatar" :alt="topic.author" class="w-10 h-10 rounded-full object-cover flex-shrink-0" />
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <span :class="['text-xs font-medium px-1.5 py-0.5 rounded', topic.tagColor]">{{ topic.tag }}</span>
          <span class="text-sm font-medium text-foreground truncate hover:text-primary transition-colors">{{ topic.title }}</span>
        </div>
        <span class="text-xs text-muted-foreground">{{ topic.author }}</span>
      </div>
      <div class="hidden sm:flex items-center gap-4 text-xs text-muted-foreground flex-shrink-0">
        <span class="flex items-center gap-1"><IconRenderer name="message-circle" class-name="w-3.5 h-3.5" />{{ topic.replies }}</span>
        <span class="flex items-center gap-1"><IconRenderer name="eye" class-name="w-3.5 h-3.5" />{{ topic.views }}</span>
        <span class="flex items-center gap-1"><IconRenderer name="thumbs-up" class-name="w-3.5 h-3.5" />{{ topic.likes }}</span>
      </div>
    </div>
  </div>
</template>
