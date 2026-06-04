<script setup lang="ts">
import { ExternalLink, Brain, Layers, Globe, FileCode, Cpu, ShieldCheck } from 'lucide-vue-next'

const news = [
  { icon: Brain, category: '大模型', time: '2小时前', title: 'GPT-4 Turbo发布新版本，推理能力大幅提升', source: 'AI前线' },
  { icon: Layers, category: '框架', time: '4小时前', title: 'LangChain v0.2正式发布，全新模块化架构', source: '开源中国' },
  { icon: Globe, category: '行业', time: '6小时前', title: '全球运营商加速AI部署，预计2025年AI驱动网络占比达60%', source: '通信世界' },
  { icon: FileCode, category: '论文', time: '昨天', title: '最新研究：自监督学习在无线信号处理中的突破性应用', source: 'arXiv' },
  { icon: Cpu, category: '工具', time: '昨天', title: 'OpenAI开放Assistant API，支持自定义AI助手构建', source: '机器之心' },
  { icon: ShieldCheck, category: '政策', time: '2天前', title: '欧盟AI法案正式生效，对基础模型提出新的合规要求', source: 'TechCrunch' },
]
const categoryColors: Record<string,string> = { '大模型': 'bg-purple-50 text-purple-600', '框架': 'bg-blue-50 text-blue-600', '行业': 'bg-emerald-50 text-emerald-600', '论文': 'bg-amber-50 text-amber-600', '工具': 'bg-cyan-50 text-cyan-600', '政策': 'bg-rose-50 text-rose-600' }

</script>
<template>
  <section id="intelligence" class="section-intelligence py-16 relative flex-1 overflow-hidden">
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
  </section>
</template>