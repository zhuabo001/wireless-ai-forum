<script setup lang="ts">
import { ExternalLink, Brain, Layers, Globe, FileCode, Cpu, ShieldCheck } from 'lucide-vue-next'
import { intelligenceCategoryColors, intelligenceNews } from '../data/home'
import type { IconName } from '../types/home'

const iconMap: Partial<Record<IconName, unknown>> = {
  brain: Brain,
  layers: Layers,
  globe: Globe,
  'file-code': FileCode,
  cpu: Cpu,
  'shield-check': ShieldCheck,
}

const news = intelligenceNews.map((item) => ({ ...item, icon: iconMap[item.icon] }))
const categoryColors = intelligenceCategoryColors

</script>
<template>
  <div class="section-intelligence py-16 relative flex-1 overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-10">
        <h2 class="text-3xl font-bold text-foreground mb-3">AI情报局</h2>
        <p class="text-muted-foreground max-w-xl mx-auto">搜罗每天最新的AI热点时事</p>
      </div>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="(item,i) in news" :key="i" class="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all cursor-pointer group">
          <div class="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5"><component :is="item.icon" class="w-4 h-4 text-primary" /></div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1.5">
              <span :class="['text-xs font-medium px-1.5 py-0.5 rounded', categoryColors[item.category]]">{{ item.category }}</span>
              <span class="text-xs text-muted-foreground">{{ item.time }}</span>
            </div>
            <h4 class="text-sm font-medium text-foreground group-hover:text-primary transition-colors leading-snug mb-1">{{ item.title }}</h4>
            <span class="text-xs text-muted-foreground flex items-center gap-1"><ExternalLink class="w-3 h-3" />{{ item.source }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
