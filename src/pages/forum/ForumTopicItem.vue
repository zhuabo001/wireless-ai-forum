<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { TopicItem } from '@/types/pageDesign/forum'
import IconRenderer from '@/components/ui/IconRenderer.vue'

const props = defineProps<{
  topic: TopicItem
}>()

const router = useRouter()

function goToDetail(): void {
  router.push(`/forum/post/${props.topic.id}`)
}
</script>

<template>
  <div @click="goToDetail" class="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer border-b border-border/50 last:border-b-0">
    <div
      :class="['w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-sm font-bold flex-shrink-0', topic.author.gradientFrom, topic.author.gradientTo]"
    >
      {{ topic.author.initials }}
    </div>
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2 mb-1 flex-wrap">
        <span class="text-xs font-medium px-1.5 py-0.5 rounded bg-blue-50 text-blue-600">
          {{ topic.categoryBadge }}
        </span>
        <span class="text-xs font-medium px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
          {{ topic.tagBadge }}
        </span>
        <span class="text-sm font-medium text-foreground truncate hover:text-primary transition-colors">
          {{ topic.title }}
        </span>
      </div>
      <span class="text-xs text-muted-foreground">{{ topic.author.name }} · {{ topic.time }}</span>
    </div>
    <div class="hidden sm:flex items-center gap-4 text-xs text-muted-foreground flex-shrink-0">
      <span class="flex items-center gap-1">
        <IconRenderer name="message-circle" class="w-3.5 h-3.5" />{{ topic.replies }}
      </span>
      <span class="flex items-center gap-1">
        <IconRenderer name="eye" class="w-3.5 h-3.5" />{{ topic.views }}
      </span>
      <span class="flex items-center gap-1">
        <IconRenderer name="thumbs-up" class="w-3.5 h-3.5" />{{ topic.likes }}
      </span>
    </div>
  </div>
</template>
