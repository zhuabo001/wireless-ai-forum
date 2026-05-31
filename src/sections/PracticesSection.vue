<script setup lang="ts">
import { Zap } from 'lucide-vue-next'

const practices = [
  { dept: '测试部', title: '智能测试用例生成', desc: '基于大模型的自动化测试用例生成，覆盖率达95%，效率提升3倍', tags: ['大模型', '自动化'] },
  { dept: '研发部', title: '代码智能审查', desc: 'AI辅助代码审查系统，自动发现潜在缺陷和安全漏洞', tags: ['代码审查', '安全'] },
  { dept: '网络部', title: '网络参数自动优化', desc: '利用强化学习实现无线网络参数自动调优，性能提升20%', tags: ['强化学习', '网络'] },
  { dept: '运维部', title: '故障预测与诊断', desc: '基于时序分析的故障预测系统，提前24小时预警', tags: ['时序分析', 'AIOps'] },
  { dept: '产品部', title: '需求智能分析', desc: 'AI辅助需求分析，自动生成需求文档和测试要点', tags: ['NLP', '需求工程'] },
  { dept: '架构部', title: '知识库智能问答', desc: '构建企业级知识库问答系统，响应时间小于1秒', tags: ['RAG', '知识库'] },
]

</script>
<template>
  <section id="practices" class="section-practices py-16 relative flex-1 overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-10">
        <h2 class="text-3xl font-bold text-foreground mb-3">优秀实践</h2>
        <p class="text-muted-foreground max-w-xl mx-auto">各部门AI辅助作业的优秀实践分享</p>
      </div>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div v-for="(p,i) in practices" :key="i" class="p-5 bg-white rounded-xl border border-gray-200 hover:shadow-md hover:-translate-y-0.5 transition-all">
          <div class="flex items-center gap-2 mb-3"><span class="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-md">{{ p.dept }}</span></div>
          <h3 class="text-base font-semibold text-foreground mb-2 flex items-center gap-2"><Zap class="w-4 h-4 text-amber-500" /> {{ p.title }}</h3>
          <p class="text-sm text-muted-foreground mb-3">{{ p.desc }}</p>
          <div class="flex flex-wrap gap-1.5"><span v-for="tag in p.tags" :key="tag" class="px-2 py-0.5 text-xs bg-gray-100 text-gray-500 rounded-full">{{ tag }}</span></div>
        </div>
      </div>
    </div>
  </section>
</template>