<script setup lang="ts">
import { MessageCircle, ThumbsUp, Eye, ChevronRight, MessagesSquare, Reply, Users } from 'lucide-vue-next'
import { forumStats as forumStatData, forumTopics as topics } from '../data/home'
import type { IconName } from '../types/home'

const iconMap: Partial<Record<IconName, unknown>> = {
  'messages-square': MessagesSquare,
  reply: Reply,
  users: Users,
}

const forumStats = forumStatData.map((stat) => ({ ...stat, icon: iconMap[stat.icon] }))

</script>
<template>
  <section id="forum" class="section-forum py-16 relative flex-1 overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-3xl font-bold text-foreground mb-1">AI论坛</h2>
          <p class="text-muted-foreground text-sm">用户交流广场，任何问题讨论和话题交流都可以在这里发起</p>
        </div>
        <button class="hidden sm:inline-flex items-center gap-1 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors">发起话题 <ChevronRight class="w-4 h-4" /></button>
      </div>
      <div class="grid grid-cols-3 gap-4 mb-6">
        <div v-for="stat in forumStats" :key="stat.label" class="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200">
          <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <component :is="stat.icon" class="w-5 h-5 text-primary" />
          </div>
          <div>
            <span class="block text-xl font-bold text-foreground">{{ stat.value }}</span>
            <span class="text-xs text-muted-foreground">{{ stat.label }}</span>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div v-for="(t,i) in topics" :key="i" :class="['flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer', i < topics.length - 1 ? 'border-b border-gray-100' : '']">
          <img :src="t.avatar" :alt="t.author" class="w-10 h-10 rounded-full object-cover flex-shrink-0" />
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span :class="['text-xs font-medium px-1.5 py-0.5 rounded', t.tagColor]">{{ t.tag }}</span>
              <span class="text-sm font-medium text-foreground truncate hover:text-primary transition-colors">{{ t.title }}</span>
            </div>
            <span class="text-xs text-muted-foreground">{{ t.author }}</span>
          </div>
          <div class="hidden sm:flex items-center gap-4 text-xs text-muted-foreground flex-shrink-0">
            <span class="flex items-center gap-1"><MessageCircle class="w-3.5 h-3.5" />{{ t.replies }}</span>
            <span class="flex items-center gap-1"><Eye class="w-3.5 h-3.5" />{{ t.views }}</span>
            <span class="flex items-center gap-1"><ThumbsUp class="w-3.5 h-3.5" />{{ t.likes }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
