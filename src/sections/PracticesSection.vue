<script setup lang="ts">
import { Zap } from 'lucide-vue-next'
import { practices } from '../data/home'

</script>
<template>
  <div class="section-practices py-16 relative flex-1 overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-10">
        <h2 class="text-3xl font-bold text-foreground mb-3">优秀实践</h2>
        <p class="text-muted-foreground max-w-xl mx-auto">各部门AI辅助作业的优秀实践分享</p>
      </div>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div v-for="(p,i) in practices" :key="i" class="p-5 bg-white rounded-xl border border-gray-200 hover:shadow-md hover:-translate-y-0.5 transition-all">
          <div class="flex items-center gap-2 mb-3"><span class="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-md">{{ p.dept }}</span></div>
          <h3 class="text-base font-semibold text-foreground mb-2 flex items-center gap-2"><Zap class="w-4 h-4 text-amber-500" /> {{ p.title }}</h3>
          <p class="text-sm text-muted-foreground mb-3">{{ p.desc }}</p>
          <div class="flex flex-wrap gap-1.5"><span v-for="tag in p.tags" :key="tag" class="px-2 py-0.5 text-xs bg-gray-100 text-gray-500 rounded-full">{{ tag }}</span></div>
        </div>
      </div>
    </div>
  </div>
</template>
