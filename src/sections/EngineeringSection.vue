<script setup lang="ts">
import { ref } from 'vue'
import { Code2, TestTube, BarChart3, Radio, Signal, Network, Smartphone, BookMarked } from 'lucide-vue-next'
import ImageModal from '../components/ImageModal.vue'

const modalOpen = ref(false)

function openModal() {
  modalOpen.value = true
}

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
      <div class="mb-8 relative group cursor-pointer" @click="openModal">
        <img src="/panorama.webp" alt="工程能力全景图" class="w-full h-48 sm:h-64 object-cover rounded-2xl shadow-sm" />
        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 rounded-2xl transition-colors flex items-center justify-center">
          <span class="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm">
            查看大图
          </span>
        </div>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div v-for="cap in capabilities" :key="cap.title" class="flex flex-col items-center p-5 bg-white rounded-xl border border-gray-200 hover:shadow-md hover:-translate-y-0.5 transition-all">
          <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3"><component :is="cap.icon" class="w-5 h-5 text-primary" /></div>
          <span class="text-sm font-semibold text-foreground">{{ cap.title }}</span>
          <span class="text-xs text-muted-foreground mt-1 text-center">{{ cap.desc }}</span>
        </div>
      </div>
    </div>

    <ImageModal v-model:open="modalOpen" src="/panorama-detail.webp" alt="工程能力全景大图" />
  </section>
</template>