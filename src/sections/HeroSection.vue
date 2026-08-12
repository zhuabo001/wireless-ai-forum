<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue'
import ShinyText from '../components/ShinyText.vue'
import MarqueeCarousel from '../components/MarqueeCarousel.vue'
import IconRenderer from '../components/ui/IconRenderer.vue'
import MetricCard from '../components/ui/MetricCard.vue'
import { changelog, heroContent, heroStats } from '../data/home'

// ActivityCalendar 依赖 ElCalendar（Element Plus），静态导入会把整个
// vendor-element-plus 拖进首页关键路径；它位于 hero 区块下半屏，
// 异步加载即可，挂载后并行拉取，不阻塞首屏绘制
const ActivityCalendar = defineAsyncComponent(() => import('../components/ActivityCalendar.vue'))

const sectionRef = ref<HTMLElement | null>(null)
</script>

<template>
  <div ref="sectionRef" class="relative"><div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style="z-index:1;">
      <!-- Main Title -->
      <div class="text-center pt-20 pb-6">
        <span class="inline-block px-3 py-1 mb-4 text-xs font-medium tracking-wider text-primary bg-primary/10 rounded-full uppercase">
          {{ heroContent.eyebrow }}
        </span>
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-normal">
          <ShinyText :text="heroContent.title" :speed="4" base-color="#0f172a" shine-color="#60a5fa" />
        </h1>
        <p class="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">{{ heroContent.subtitle }}</p>
        <div class="flex flex-wrap items-center justify-center gap-4">
          <router-link
            v-for="action in heroContent.actions"
            :key="action.href"
            :to="action.href"
            :class="[
              'inline-flex items-center gap-2 px-6 py-3 font-medium rounded-lg transition-colors',
              action.variant === 'primary'
                ? 'bg-primary text-white hover:bg-primary/90 shadow-sm'
                : 'bg-white text-foreground border border-gray-200 hover:bg-gray-50'
            ]"
          >
            {{ action.label }}
            <IconRenderer v-if="action.icon" :name="action.icon" class-name="w-4 h-4" />
          </router-link>
        </div>
      </div>

      <!-- Infinite Scroll Marquee -->
      <MarqueeCarousel />

      <!-- Stats -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
        <MetricCard v-for="stat in heroStats" :key="stat.label" :icon="stat.icon" :value="stat.value" :label="stat.label" />
      </div>

      <!-- Activity Calendar + Announcements (same row) -->
      <div class="flex flex-col lg:flex-row gap-4">
        <!-- Calendar (3/4) -->
        <div class="lg:w-3/4">
          <div class="flex items-center gap-2 mb-3">
            <h2 class="text-lg font-bold text-foreground">社区活动日历</h2>
            <span class="text-xs text-muted-foreground">—— 点击有标记的日期查看详情</span>
          </div>
          <ActivityCalendar />
        </div>
        <!-- Changelog (1/4) -->
        <div class="lg:w-1/4 flex flex-col">
          <div class="flex items-center gap-2 mb-3">
            <h2 class="text-lg font-bold text-foreground">更新日志</h2>
          </div>
          <div class="flex flex-col gap-3 flex-1">
            <div v-for="item in changelog" :key="item.version" class="p-4 rounded-lg bg-white border border-gray-200 flex-1">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-xs font-medium px-1.5 py-0.5 rounded bg-blue-50 text-blue-600">{{ item.version }}</span>
                <span class="text-xs text-muted-foreground">{{ item.date }}</span>
              </div>
              <h4 class="text-sm font-semibold text-foreground mb-2">{{ item.title }}</h4>
              <div class="space-y-1">
                <div v-for="(change, j) in item.changes" :key="j" class="flex items-start gap-1.5 text-xs text-muted-foreground">
                  <IconRenderer name="git-commit" class-name="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>{{ change }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
