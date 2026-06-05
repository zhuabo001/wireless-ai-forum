<script setup lang="ts">
import type { TopicItem } from '@/types/pageDesign/forum'
import ForumTopicItem from './ForumTopicItem.vue'

defineProps<{
  topics: TopicItem[]
}>()
</script>

<template>
  <div class="bg-white rounded-xl border border-border overflow-hidden">
    <ForumTopicItem v-for="topic in topics" :key="topic.id" :topic="topic" />
  </div>
</template>
