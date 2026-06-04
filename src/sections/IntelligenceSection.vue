<script setup lang="ts">
import { GitCommit } from 'lucide-vue-next'

const changelog = [
  { version: 'v1.2.0', date: '2026-06-01', title: 'Agent市场正式上线，支持工具和Agent的一键部署与分享', changes: ['新增Agent市场模块', '上线首批社区精选Agent工具', '优化首页加载性能'] },
  { version: 'v1.1.0', date: '2026-05-15', title: '课程中心与AI论坛上线，社区互动功能全面开放', changes: ['新增课程中心，支持内外部课程分享', 'AI论坛上线，支持话题发布与讨论', '新增优秀实践与百宝箱模块'] },
]

</script>
<template>
  <section id="intelligence" class="section-intelligence py-16 relative flex-1 overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-10">
        <h2 class="text-3xl font-bold text-foreground mb-3">更新日志</h2>
        <p class="text-muted-foreground max-w-xl mx-auto">网站功能更新记录</p>
      </div>
      <div class="grid sm:grid-cols-2 gap-5">
        <div v-for="(item,i) in changelog" :key="i" class="p-5 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-xs font-medium px-2 py-0.5 rounded bg-blue-50 text-blue-600">{{ item.version }}</span>
            <span class="text-xs text-muted-foreground">{{ item.date }}</span>
          </div>
          <h4 class="text-sm font-semibold text-foreground mb-3">{{ item.title }}</h4>
          <div class="space-y-1.5">
            <div v-for="(change, j) in item.changes" :key="j" class="flex items-start gap-2 text-xs text-muted-foreground">
              <GitCommit class="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
              <span>{{ change }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>