<script setup lang="ts">
import { Code2, TestTube, BarChart3, Radio, Signal, Network, Smartphone, BookMarked } from 'lucide-vue-next'

const capabilities = [
  { icon: Code2, title: '智能编码', desc: 'AI辅助代码生成与 review' },
  { icon: TestTube, title: '自动化测试', desc: '测试用例生成与执行' },
  { icon: BarChart3, title: '数据分析', desc: '研发数据智能分析' },
  { icon: Radio, title: '协议优化', desc: '无线协议智能调优' },
  { icon: Signal, title: '信号处理', desc: '信号质量智能诊断' },
  { icon: Network, title: '网络规划', desc: '网络部署方案生成' },
  { icon: Smartphone, title: '设备建模', desc: '设备仿真与建模' },
  { icon: BookMarked, title: '知识管理', desc: '技术文档智能管理' },
]

</script>
<template>
  <section id="engineering" class="relative flex-1 overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-10">
        <h2 class="text-3xl font-bold text-foreground mb-3">工程能力全景</h2>
        <p class="text-muted-foreground max-w-xl mx-auto">Agent辅助无线研发的完整能力矩阵，覆盖从编码到部署的全生命周期</p>
      </div>
      <div class="mb-8">
        <img src="/panorama.webp" alt="工程能力全景图" class="w-full h-48 sm:h-64 object-cover rounded-2xl shadow-sm" />
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div v-for="cap in capabilities" :key="cap.title" class="flex flex-col items-center p-5 bg-white rounded-xl border border-gray-200 hover:shadow-md hover:-translate-y-0.5 transition-all">
          <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3"><component :is="cap.icon" class="w-5 h-5 text-primary" /></div>
          <span class="text-sm font-semibold text-foreground">{{ cap.title }}</span>
          <span class="text-xs text-muted-foreground mt-1 text-center">{{ cap.desc }}</span>
        </div>
      </div>
    </div>
  </section>
</template>