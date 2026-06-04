<script setup lang="ts">
import IconRenderer from './ui/IconRenderer.vue'
import { quickLinks } from '../data/navigation'

</script>

<template>
  <div class="hidden md:flex fixed right-4 top-1/2 -translate-y-1/2 z-40 flex-col gap-3">
    <a
      v-for="link in quickLinks"
      :key="link.label"
      :href="link.href"
      class="group relative flex items-center justify-center"
    >
      <!-- 圆形图标 -->
      <div
        class="w-10 h-10 rounded-full bg-white/90 backdrop-blur shadow-md border border-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:shadow-lg hover:scale-110 transition-all duration-200"
      >
        <IconRenderer :name="link.icon" class-name="w-5 h-5" />
      </div>

      <!-- 左侧悬浮卡片 -->
      <div
        class="absolute right-full mr-3 top-1/2 -translate-y-1/2 w-44 p-3 rounded-xl bg-white shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out"
      >
        <div class="flex items-center gap-2.5">
          <div :class="['w-8 h-8 rounded-lg flex items-center justify-center shrink-0', link.color]">
            <IconRenderer :name="link.icon" class-name="w-4 h-4" />
          </div>
          <div class="min-w-0">
            <div class="text-sm font-semibold text-gray-900 truncate">{{ link.label }}</div>
            <div class="text-xs text-gray-500 truncate">{{ link.desc }}</div>
          </div>
        </div>

        <!-- 小三角箭头 -->
        <div
          class="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-white border-t border-r border-gray-100 rotate-45"
        />
      </div>
    </a>
  </div>
</template>
