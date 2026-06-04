<script setup lang="ts">
import { ref } from 'vue'
import ShinyText from '../components/ShinyText.vue'
import MarqueeCarousel from '../components/MarqueeCarousel.vue'
import ActivityCalendar from '../components/ActivityCalendar.vue'
import { ArrowRight, Users, MessageSquare, Wrench, BookOpen, FileText, Activity, GitCommit } from 'lucide-vue-next'

const sectionRef = ref<HTMLElement | null>(null)

const stats = [
  { icon: Users, label: '社区成员', value: '2,500+' },
  { icon: MessageSquare, label: '活跃话题', value: '3,600+' },
  { icon: Wrench, label: 'Agent工具', value: '180+' },
  { icon: BookOpen, label: '精品课程', value: '50+' },
  { icon: FileText, label: '实践案例', value: '360+' },
  { icon: Activity, label: '今日活跃', value: '128' },
]

const changelog = [
  { version: 'v1.2.0', date: '2026-06-01', title: 'Agent市场正式上线，支持工具和Agent的一键部署与分享', changes: ['新增Agent市场模块', '上线首批社区精选Agent工具', '优化首页加载性能'] },
  { version: 'v1.1.0', date: '2026-05-15', title: '课程中心与AI论坛上线，社区互动功能全面开放', changes: ['新增课程中心，支持内外部课程分享', 'AI论坛上线，支持话题发布与讨论', '新增优秀实践与百宝箱模块'] },
]
</script>

<template>
  <section id="hero" ref="sectionRef" class="relative"><div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style="z-index:1;">
      <!-- Main Title -->
      <div class="text-center pt-20 pb-6">
        <span class="inline-block px-3 py-1 mb-4 text-xs font-medium tracking-wider text-primary bg-primary/10 rounded-full uppercase">
          AI-Powered Wireless R&D Community
        </span>
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-normal">
          <ShinyText text="无线AI极客汇" :speed="4" base-color="#0f172a" shine-color="#60a5fa" />
        </h1>
        <p class="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">AI赋能无线研发，连接每一位创新者</p>
        <div class="flex flex-wrap items-center justify-center gap-4">
          <a href="#forum" class="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm">
            进入论坛 <ArrowRight class="w-4 h-4" />
          </a>
          <a href="#practices" class="inline-flex items-center gap-2 px-6 py-3 bg-white text-foreground font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            进入优秀实践
          </a>
        </div>
      </div>

      <!-- Infinite Scroll Marquee -->
      <MarqueeCarousel />

      <!-- Stats -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
        <div v-for="stat in stats" :key="stat.label" class="flex flex-col items-center p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
          <component :is="stat.icon" class="w-5 h-5 text-primary mb-2" />
          <span class="text-2xl font-bold text-foreground">{{ stat.value }}</span>
          <span class="text-xs text-muted-foreground mt-0.5">{{ stat.label }}</span>
        </div>
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
            <div v-for="(item, i) in changelog" :key="i" class="p-4 rounded-lg bg-white border border-gray-200 flex-1">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-xs font-medium px-1.5 py-0.5 rounded bg-blue-50 text-blue-600">{{ item.version }}</span>
                <span class="text-xs text-muted-foreground">{{ item.date }}</span>
              </div>
              <h4 class="text-sm font-semibold text-foreground mb-2">{{ item.title }}</h4>
              <div class="space-y-1">
                <div v-for="(change, j) in item.changes" :key="j" class="flex items-start gap-1.5 text-xs text-muted-foreground">
                  <GitCommit class="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>{{ change }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
