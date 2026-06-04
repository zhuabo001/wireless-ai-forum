<script setup lang="ts">
import { tickerRows } from '../data/home'

const [row1, row2] = tickerRows
</script>
<template>
  <div class="relative w-full overflow-hidden py-4">
    <div class="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-blue-50/80 to-transparent z-10 pointer-events-none" />
    <div class="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-blue-50/80 to-transparent z-10 pointer-events-none" />
    <div class="flex mb-3 animate-marquee-left">
      <div class="flex shrink-0 gap-3 pr-3">
        <div v-for="(item,i) in row1" :key="`r1-${i}`" class="flex items-center gap-2 px-4 py-2.5 bg-white/70 backdrop-blur-sm rounded-full border border-gray-200/60 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer whitespace-nowrap">
          <span :class="['text-xs font-medium px-1.5 py-0.5 rounded shrink-0',item.tagColor]">{{ item.tag }}</span>
          <span class="text-sm text-foreground font-medium">{{ item.text }}</span>
          <span class="text-xs text-muted-foreground shrink-0">— {{ item.author }}</span>
        </div>
      </div>
      <div class="flex shrink-0 gap-3 pr-3">
        <div v-for="(item,i) in row1" :key="`r1d-${i}`" class="flex items-center gap-2 px-4 py-2.5 bg-white/70 backdrop-blur-sm rounded-full border border-gray-200/60 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer whitespace-nowrap">
          <span :class="['text-xs font-medium px-1.5 py-0.5 rounded shrink-0',item.tagColor]">{{ item.tag }}</span>
          <span class="text-sm text-foreground font-medium">{{ item.text }}</span>
          <span class="text-xs text-muted-foreground shrink-0">— {{ item.author }}</span>
        </div>
      </div>
    </div>
    <div class="flex animate-marquee-right">
      <div class="flex shrink-0 gap-3 pr-3">
        <div v-for="(item,i) in row2" :key="`r2-${i}`" class="flex items-center gap-2 px-4 py-2.5 bg-white/70 backdrop-blur-sm rounded-full border border-gray-200/60 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer whitespace-nowrap">
          <span :class="['text-xs font-medium px-1.5 py-0.5 rounded shrink-0',item.tagColor]">{{ item.tag }}</span>
          <span class="text-sm text-foreground font-medium">{{ item.text }}</span>
          <span class="text-xs text-muted-foreground shrink-0">— {{ item.author }}</span>
        </div>
      </div>
      <div class="flex shrink-0 gap-3 pr-3">
        <div v-for="(item,i) in row2" :key="`r2d-${i}`" class="flex items-center gap-2 px-4 py-2.5 bg-white/70 backdrop-blur-sm rounded-full border border-gray-200/60 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer whitespace-nowrap">
          <span :class="['text-xs font-medium px-1.5 py-0.5 rounded shrink-0',item.tagColor]">{{ item.tag }}</span>
          <span class="text-sm text-foreground font-medium">{{ item.text }}</span>
          <span class="text-xs text-muted-foreground shrink-0">— {{ item.author }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
