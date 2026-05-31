<script setup lang="ts">
import { Cpu, Award, Briefcase, Newspaper, BookOpen, MessageSquare, Layers } from 'lucide-vue-next'

const quickLinks = [
  { icon: Cpu, label: '工程能力', href: '#engineering', color: 'bg-blue-50 text-blue-600', desc: '构建与部署核心工程能力' },
  { icon: Award, label: '优秀实践', href: '#practices', color: 'bg-emerald-50 text-emerald-600', desc: '精选行业最佳实践案例' },
  { icon: Briefcase, label: '百宝箱', href: '#toolbox', color: 'bg-amber-50 text-amber-600', desc: '高效工具与资源集合' },
  { icon: Newspaper, label: '情报局', href: '#intelligence', color: 'bg-rose-50 text-rose-600', desc: '最新技术情报速递' },
  { icon: BookOpen, label: '热门课程', href: '#courses', color: 'bg-violet-50 text-violet-600', desc: '前沿技术体系化课程' },
  { icon: MessageSquare, label: 'AI论坛', href: '#forum', color: 'bg-cyan-50 text-cyan-600', desc: '技术交流与观点碰撞' },
  { icon: Layers, label: 'Agent市场', href: '#market', color: 'bg-orange-50 text-orange-600', desc: '智能体应用与服务市场' },
]
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
        <component :is="link.icon" class="w-5 h-5" />
      </div>

      <!-- 左侧悬浮卡片 -->
      <div
        class="absolute right-full mr-3 top-1/2 -translate-y-1/2 w-44 p-3 rounded-xl bg-white shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out"
      >
        <div class="flex items-center gap-2.5">
          <div :class="['w-8 h-8 rounded-lg flex items-center justify-center shrink-0', link.color]">
            <component :is="link.icon" class="w-4 h-4" />
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
