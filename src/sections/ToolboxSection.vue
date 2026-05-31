<script setup lang="ts">
import { Wrench, FileText, GitMerge, Terminal, Search, Settings, Shield, Database } from 'lucide-vue-next'

const tools = [
  { icon: Wrench, title: '调试助手', desc: '智能调试工具，快速定位问题' },
  { icon: FileText, title: '文档生成器', desc: '自动生成技术文档' },
  { icon: GitMerge, title: '代码合并助手', desc: '智能合并冲突解决' },
  { icon: Terminal, title: 'CLI工具集', desc: '命令行AI工具集合' },
  { icon: Search, title: '智能检索', desc: '跨平台代码和文档检索' },
  { icon: Settings, title: '模型管理', desc: 'AI模型版本和部署管理' },
  { icon: Shield, title: '安全扫描', desc: '自动化安全漏洞检测' },
  { icon: Database, title: '数据治理', desc: 'AI数据质量治理工具' },
]

</script>
<template>
  <section id="toolbox" class="section-toolbox py-16 relative flex-1 overflow-hidden">
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
  </section>
</template>