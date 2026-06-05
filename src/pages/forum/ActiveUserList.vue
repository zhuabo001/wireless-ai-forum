<script setup lang="ts">
import type { ActiveUser } from '@/types/pageDesign/forum'
import IconRenderer from '@/components/ui/IconRenderer.vue'

defineProps<{
  users: ActiveUser[]
}>()
</script>

<template>
  <div class="bg-white rounded-xl border border-border p-5">
    <h3 class="text-sm font-semibold text-foreground mb-4">活跃用户</h3>
    <div class="space-y-3">
      <div v-for="user in users" :key="user.name" class="flex items-center gap-3">
        <div
          :class="['w-8 h-8 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-xs font-bold', user.gradientFrom, user.gradientTo]"
        >
          {{ user.initials }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-foreground truncate">{{ user.name }}</p>
          <p class="text-xs text-muted-foreground">本周发帖 {{ user.weeklyPosts }}</p>
        </div>
        <IconRenderer
          v-if="user.medalColor"
          name="medal"
          :class="['w-4 h-4', user.medalColor]"
        />
      </div>
    </div>
  </div>
</template>
