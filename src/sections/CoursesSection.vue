<script setup lang="ts">
import { Clock, Star, User } from 'lucide-vue-next'

const courses = [
  { title: '大模型驱动无线研发入门', instructor: '张明远', avatar: '/avatar-1.webp', org: '无线研究院', hours: 8, rating: 4.9, students: 1250, cover: '/course-1.webp', tag: '内部课程' },
  { title: 'LangChain应用开发实战', instructor: '李思涵', avatar: '/avatar-2.webp', org: 'AI实验室', hours: 12, rating: 4.8, students: 980, cover: '/course-2.webp', tag: '外部推荐' },
  { title: 'AI辅助代码审查实践', instructor: '王雪晴', avatar: '/avatar-3.webp', org: '工程技术部', hours: 6, rating: 4.7, students: 756, cover: '/course-3.webp', tag: '内部课程' },
  { title: '无线信号AI处理技术', instructor: '陈志强', avatar: '/avatar-4.webp', org: '数据科学中心', hours: 10, rating: 4.9, students: 632, cover: '/course-4.webp', tag: '外部推荐' },
  { title: 'Agent开发与部署指南', instructor: '刘浩然', avatar: '/avatar-5.webp', org: '工程技术部', hours: 8, rating: 4.8, students: 890, cover: '/course-5.webp', tag: '内部课程' },
  { title: '多模态AI技术与应用', instructor: '赵敏华', avatar: '/avatar-6.webp', org: 'AI实验室', hours: 10, rating: 4.7, students: 543, cover: '/course-6.webp', tag: '外部推荐' },
]

</script>
<template>
  <section id="courses" class="section-courses py-16 relative flex-1 overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-10">
        <h2 class="text-3xl font-bold text-foreground mb-3">热门课程</h2>
        <p class="text-muted-foreground max-w-xl mx-auto">把公司内外的优秀课程在社区分享</p>
      </div>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div v-for="(c,i) in courses" :key="i" class="bg-white rounded-xl border border-gray-200 hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden cursor-pointer group">
          <div class="relative h-36 overflow-hidden">
            <img :src="c.cover" :alt="c.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            <span class="absolute top-3 left-3 px-2 py-0.5 text-xs font-medium bg-white/90 backdrop-blur-sm text-foreground rounded-md">{{ c.tag }}</span>
          </div>
          <div class="p-4">
            <h3 class="text-sm font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">{{ c.title }}</h3>
            <div class="flex items-center gap-2 mb-3">
              <img :src="c.avatar" :alt="c.instructor" class="w-5 h-5 rounded-full object-cover" />
              <span class="text-xs text-muted-foreground">{{ c.instructor }} · {{ c.org }}</span>
            </div>
            <div class="flex items-center gap-3 text-xs text-muted-foreground">
              <span class="flex items-center gap-1"><Clock class="w-3 h-3" />{{ c.hours }}课时</span>
              <span class="flex items-center gap-1"><Star class="w-3 h-3 text-amber-500" />{{ c.rating }}</span>
              <span class="flex items-center gap-1"><User class="w-3 h-3" />{{ c.students }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
