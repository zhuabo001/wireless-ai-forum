<script setup lang="ts">
import { ref } from 'vue'
import { Bot, Package, Tags, GitBranch, Zap, Server } from 'lucide-vue-next'
import ImageModal from '../components/ImageModal.vue'
import { capabilities as capabilityData } from '../data/home'
import type { IconName } from '../types/home'

const modalOpen = ref(false)

function openModal() {
  modalOpen.value = true
}

const iconMap: Partial<Record<IconName, unknown>> = {
  bot: Bot,
  package: Package,
  tags: Tags,
  'git-branch': GitBranch,
  zap: Zap,
  server: Server,
}

const capabilities = capabilityData.map((cap) => ({ ...cap, icon: iconMap[cap.icon] }))

</script>
<template>
  <section id="engineering" class="relative flex-1 overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-10">
        <h2 class="text-3xl font-bold text-foreground mb-3">工程能力全景</h2>
        <p class="text-muted-foreground max-w-xl mx-auto">Agent辅助无线研发的完整能力矩阵，覆盖从编码到部署的全生命周期</p>
      </div>
      <div class="mb-8 relative group cursor-pointer" @click="openModal">
        <img src="/panorama_engineering_en.webp" alt="工程能力全景图" class="w-full rounded-2xl shadow-sm" />
        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 rounded-2xl transition-colors flex items-center justify-center">
          <span class="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm">
            查看大图
          </span>
        </div>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div v-for="cap in capabilities" :key="cap.title" class="flex flex-col items-center p-5 bg-white rounded-xl border border-gray-200 hover:shadow-md hover:-translate-y-0.5 transition-all">
          <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3"><component :is="cap.icon" class="w-5 h-5 text-primary" /></div>
          <span class="text-sm font-semibold text-foreground text-center">{{ cap.title }}</span>
          <span class="text-xs text-muted-foreground mt-1 text-center">{{ cap.desc }}</span>
        </div>
      </div>
    </div>

    <ImageModal v-model:open="modalOpen" src="/panorama_engineering_en.webp" alt="工程能力全景大图" />
  </section>
</template>
