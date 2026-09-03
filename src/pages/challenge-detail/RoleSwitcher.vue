<script setup lang="ts">
import type { ChallengeViewerRole } from '@/types/pageDesign/challengeHeroes'
import IconRenderer from '@/components/ui/IconRenderer.vue'

defineProps<{
  viewerRole: ChallengeViewerRole
}>()

const emit = defineEmits<{
  'update:viewerRole': [role: ChallengeViewerRole]
}>()

const ROLES: { id: ChallengeViewerRole; name: string }[] = [
  { id: 'visitor', name: '普通用户' },
  { id: 'publisher', name: '发布者' },
  { id: 'claimant', name: '揭榜人' },
  { id: 'admin', name: '超管' },
]
</script>

<template>
  <!-- 仅 mock 阶段用于演示权限差异；正式环境角色由登录态决定 -->
  <div class="hidden lg:block fixed left-6 bottom-6 z-40">
    <div class="bg-white rounded-xl shadow-lg border border-border/60 p-3">
      <p class="text-[11px] text-muted-foreground mb-2 flex items-center gap-1">
        <IconRenderer name="users" class="w-3 h-3" />演示：切换角色查看权限差异
      </p>
      <div class="flex gap-1.5">
        <button
          v-for="role in ROLES"
          :key="role.id"
          :class="[
            'px-2.5 py-1 text-xs font-medium rounded-md transition-colors',
            viewerRole === role.id ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground',
          ]"
          @click="emit('update:viewerRole', role.id)"
        >
          {{ role.name }}
        </button>
      </div>
    </div>
  </div>
</template>
