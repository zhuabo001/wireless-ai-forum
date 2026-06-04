<script setup lang="ts">
import { Wrench, FileText, GitMerge, Terminal, Search, Settings, Shield, Database } from 'lucide-vue-next'
import { tools as toolData } from '../data/home'
import type { IconName } from '../types/home'

const iconMap: Partial<Record<IconName, unknown>> = {
  wrench: Wrench,
  'file-text': FileText,
  'git-merge': GitMerge,
  terminal: Terminal,
  search: Search,
  settings: Settings,
  shield: Shield,
  database: Database,
}

const tools = toolData.map((tool) => ({ ...tool, icon: iconMap[tool.icon] }))

</script>
<template>
  <div class="section-toolbox py-16 relative flex-1 overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-10">
        <h2 class="text-3xl font-bold text-foreground mb-3">Agent百宝箱</h2>
        <p class="text-muted-foreground max-w-xl mx-auto">工具和工程能力的用户指导和手册</p>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div v-for="tool in tools" :key="tool.title" class="flex flex-col items-center p-5 bg-white rounded-xl border border-gray-200 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
          <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3"><component :is="tool.icon" class="w-5 h-5 text-primary" /></div>
          <span class="text-sm font-semibold text-foreground">{{ tool.title }}</span>
          <span class="text-xs text-muted-foreground mt-1 text-center">{{ tool.desc }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
