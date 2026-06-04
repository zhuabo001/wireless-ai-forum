<script setup lang="ts">
import { Clock, Star, User } from 'lucide-vue-next'
import { courses } from '../data/home'

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
