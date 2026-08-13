<script setup lang="ts">
import SectionHeader from '../components/layout/SectionHeader.vue'
import BaseCard from '../components/ui/BaseCard.vue'
import IconRenderer from '../components/ui/IconRenderer.vue'
import TagBadge from '../components/ui/TagBadge.vue'
import { intelligenceCategoryColors, intelligenceNews } from '../data/home'

const categoryColors = intelligenceCategoryColors

</script>
<template>
  <div class="section-intelligence py-16 relative flex-1 overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeader title="AI情报局" description="搜罗每天最新的AI热点时事" />
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <BaseCard v-for="item in intelligenceNews" :key="item.title" interactive class-name="flex items-start gap-3 p-4 group hover:translate-y-0">
          <div class="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5"><IconRenderer :name="item.icon" class-name="w-4 h-4 text-primary" /></div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1.5">
              <TagBadge :label="item.category" :class-name="categoryColors[item.category]" />
              <span class="text-xs text-muted-foreground">{{ item.time }}</span>
            </div>
            <h3 class="text-sm font-medium text-foreground group-hover:text-primary transition-colors leading-snug mb-1">{{ item.title }}</h3>
            <span class="text-xs text-muted-foreground flex items-center gap-1"><IconRenderer name="external-link" class-name="w-3 h-3" />{{ item.source }}</span>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>
