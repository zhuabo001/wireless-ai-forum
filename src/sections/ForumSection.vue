<script setup lang="ts">
import SectionHeader from '../components/layout/SectionHeader.vue'
import IconRenderer from '../components/ui/IconRenderer.vue'
import MetricCard from '../components/ui/MetricCard.vue'
import TopicList from '../components/ui/TopicList.vue'
import { forumStats as forumStatData, forumTopics as topics } from '../data/home'

</script>
<template>
  <div class="section-forum py-16 relative flex-1 overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between mb-8">
        <SectionHeader title="AI论坛" description="用户交流广场，任何问题讨论和话题交流都可以在这里发起" align="left" class-name="mb-0" />
        <button class="hidden sm:inline-flex items-center gap-1 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors">发起话题 <IconRenderer name="chevron-right" class-name="w-4 h-4" /></button>
      </div>
      <div class="grid grid-cols-3 gap-4 mb-6">
        <MetricCard v-for="stat in forumStatData" :key="stat.label" :icon="stat.icon" :value="stat.value" :label="stat.label" layout="inline" />
      </div>
      <TopicList :topics="topics" />
    </div>
  </div>
</template>
