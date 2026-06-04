<script setup lang="ts">
import { ref } from 'vue'
import ImageModal from '../components/ImageModal.vue'
import SectionHeader from '../components/layout/SectionHeader.vue'
import BaseCard from '../components/ui/BaseCard.vue'
import IconRenderer from '../components/ui/IconRenderer.vue'
import ImagePreview from '../components/ui/ImagePreview.vue'
import { capabilities as capabilityData } from '../data/home'

const modalOpen = ref(false)

function openModal() {
  modalOpen.value = true
}

</script>
<template>
  <div class="relative flex-1 overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeader title="工程能力全景" description="Agent辅助无线研发的完整能力矩阵，覆盖从编码到部署的全生命周期" />
      <ImagePreview src="/panorama_engineering_en.webp" alt="工程能力全景图" @click="openModal" />
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <BaseCard v-for="cap in capabilityData" :key="cap.title" interactive class-name="flex flex-col items-center">
          <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3"><IconRenderer :name="cap.icon" class-name="w-5 h-5 text-primary" /></div>
          <span class="text-sm font-semibold text-foreground text-center">{{ cap.title }}</span>
          <span class="text-xs text-muted-foreground mt-1 text-center">{{ cap.desc }}</span>
        </BaseCard>
      </div>
    </div>

    <ImageModal v-model:open="modalOpen" src="/panorama_engineering_en.webp" alt="工程能力全景大图" />
  </div>
</template>
