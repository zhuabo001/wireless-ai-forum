<script setup lang="ts">
import { ref, computed } from 'vue'
import { Download, Star, Puzzle, Sparkles, Link2, Bot, Command } from 'lucide-vue-next'

const active = ref('全部')
const categories = ['全部', 'Extension', 'Skill', 'MCP', 'Subagent', 'Command']
const items = [
  { name: 'CodeLens', type: 'Extension', desc: '智能代码分析插件，支持多种语言', downloads: '2.3k', rating: 4.8, icon: Puzzle },
  { name: 'TestGenius', type: 'Skill', desc: '自动化测试用例生成技能', downloads: '1.8k', rating: 4.7, icon: Sparkles },
  { name: 'GitBridge', type: 'MCP', desc: 'Git仓库AI增强连接器', downloads: '1.5k', rating: 4.6, icon: Link2 },
  { name: 'ReviewBot', type: 'Subagent', desc: '自动化代码审查子代理', downloads: '1.2k', rating: 4.9, icon: Bot },
  { name: 'DevCLI', type: 'Command', desc: '开发者命令行工具集', downloads: '980', rating: 4.5, icon: Command },
  { name: 'PromptHub', type: 'Extension', desc: 'Prompt模板管理与共享', downloads: '3.1k', rating: 4.8, icon: Puzzle },
]
const typeColors: Record<string,string> = { 'Extension': 'bg-blue-50 text-blue-600', 'Skill': 'bg-emerald-50 text-emerald-600', 'MCP': 'bg-purple-50 text-purple-600', 'Subagent': 'bg-orange-50 text-orange-600', 'Command': 'bg-gray-100 text-gray-600' }
const filtered = computed(() => active.value === '全部' ? items : items.filter(i => i.type === active.value))

</script>
<template>
  <section id="market" class="section-market py-16 relative flex-1 overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-10">
        <h2 class="text-3xl font-bold text-foreground mb-3">Agent市场</h2>
        <p class="text-muted-foreground max-w-xl mx-auto">无线用户发布的Agent拓展生态 — extension、skill、MCP、subagent、command</p>
      </div>
      <div class="flex flex-wrap justify-center gap-2 mb-8">
        <button v-for="cat in categories" :key="cat" @click="active = cat"
          :class="['px-4 py-2 text-sm font-medium rounded-lg transition-colors', active === cat ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200']">{{ cat }}</button>
      </div>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="(item,i) in filtered" :key="`${item.name}-${i}`" class="p-5 bg-white rounded-xl border border-gray-200 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
          <div class="flex items-start justify-between mb-3">
            <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><component :is="item.icon" class="w-5 h-5 text-primary" /></div>
            <span :class="['text-xs font-medium px-2 py-0.5 rounded', typeColors[item.type]]">{{ item.type }}</span>
          </div>
          <h3 class="text-base font-semibold text-foreground mb-1">{{ item.name }}</h3>
          <p class="text-sm text-muted-foreground mb-4">{{ item.desc }}</p>
          <div class="flex items-center gap-4 text-xs text-muted-foreground">
            <span class="flex items-center gap-1"><Download class="w-3.5 h-3.5" />{{ item.downloads }}</span>
            <span class="flex items-center gap-1"><Star class="w-3.5 h-3.5 text-amber-500" />{{ item.rating }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
