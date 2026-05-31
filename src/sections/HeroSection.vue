<script setup lang="ts">
import { ref } from 'vue'
import MarqueeCarousel from '../components/MarqueeCarousel.vue'
import ActivityCalendar from '../components/ActivityCalendar.vue'
import { ArrowRight, Users, MessageSquare, Wrench, BookOpen, FileText, Activity, Megaphone } from 'lucide-vue-next'

const sectionRef = ref<HTMLElement | null>(null)

const stats = [
  { icon: Users, label: '社区成员', value: '2,500+' },
  { icon: MessageSquare, label: '活跃话题', value: '3,600+' },
  { icon: Wrench, label: 'Agent工具', value: '180+' },
  { icon: BookOpen, label: '精品课程', value: '50+' },
  { icon: FileText, label: '实践案例', value: '360+' },
  { icon: Activity, label: '今日活跃', value: '128' },
]

const announcements = [
  { text: '无线AI极客汇全新升级，Agent市场正式上线，欢迎体验!', bg: 'bg-blue-50 border-l-4 border-blue-500', iconColor: 'text-blue-500' },
  { text: '本周五 15:00 AI辅助无线研发技术分享会，点击报名 →', bg: 'bg-amber-50 border-l-4 border-amber-500', iconColor: 'text-amber-500' },
]
</script>

<template>
  <section id="hero" ref="sectionRef" class="relative"><div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style="z-index:1;">
      <!-- Main Title -->
      <div class="text-center pt-20 pb-6">
        <span class="inline-block px-3 py-1 mb-4 text-xs font-medium tracking-wider text-primary bg-primary/10 rounded-full uppercase">
          AI-Powered Wireless R&D Community
        </span>
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4">无线AI极客汇</h1>
        <p class="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">AI赋能无线研发，连接每一位创新者</p>
        <div class="flex flex-wrap items-center justify-center gap-4">
          <a href="#forum" class="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm">
            进入论坛 <ArrowRight class="w-4 h-4" />
          </a>
          <a href="#market" class="inline-flex items-center gap-2 px-6 py-3 bg-white text-foreground font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            探索Agent市场
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
        <!-- Announcements (1/4) -->
        <div class="lg:w-1/4 flex flex-col">
          <div class="flex items-center gap-2 mb-3">
            <h2 class="text-lg font-bold text-foreground">社区公告</h2>
          </div>
          <div class="flex flex-col gap-3 flex-1">
            <div v-for="(ann, i) in announcements" :key="i" :class="['p-4 rounded-lg flex-1 flex items-start', ann.bg]">
              <div class="flex items-start gap-3">
                <Megaphone :class="['w-5 h-5 mt-0.5 flex-shrink-0', ann.iconColor]" />
                <p class="text-sm text-foreground leading-relaxed">{{ ann.text }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
