<script setup lang="ts">
import { Calendar, MapPin, Users } from 'lucide-vue-next'
import { atmosphereEvents as events } from '../data/home'

</script>
<template>
  <div class="section-atmosphere py-16 relative flex-1 overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-10">
        <h2 class="text-3xl font-bold text-foreground mb-3">氛围建设</h2>
        <p class="text-muted-foreground max-w-xl mx-auto">AI相关的线下研讨、圆桌讨论、荣誉颁奖</p>
      </div>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div v-for="(e,i) in events" :key="i" class="bg-white rounded-xl border border-gray-200 hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden">
          <div class="h-40 overflow-hidden"><img :src="e.image" :alt="e.title" class="w-full h-full object-cover" /></div>
          <div class="p-4">
            <h3 class="text-base font-semibold text-foreground mb-2">{{ e.title }}</h3>
            <div class="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3">
              <span class="flex items-center gap-1"><Calendar class="w-3 h-3" />{{ e.date }}</span>
              <span class="flex items-center gap-1"><MapPin class="w-3 h-3" />{{ e.location }}</span>
              <span class="flex items-center gap-1"><Users class="w-3 h-3" />{{ e.participants }}人参与</span>
            </div>
            <p class="text-sm text-muted-foreground">{{ e.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
