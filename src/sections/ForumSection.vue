<script setup lang="ts">
import { MessageCircle, ThumbsUp, Eye, ChevronRight, MessagesSquare, Reply, Users } from 'lucide-vue-next'

const forumStats = [
  { icon: MessagesSquare, label: '话题', value: '3,600+' },
  { icon: Reply, label: '回复', value: '12,800+' },
  { icon: Users, label: '今日活跃', value: '128' },
]

const topics = [
  { title: 'GPT-4在协议分析中的应用心得', author: '张明远', avatar: '/avatar-1.webp', tag: 'HOT', tagColor: 'bg-red-50 text-red-600', replies: 128, views: '1.2k', likes: 89 },
  { title: 'Agent调试中遇到的常见问题和解决方案', author: '李思涵', avatar: '/avatar-2.webp', tag: 'HOT', tagColor: 'bg-red-50 text-red-600', replies: 96, views: '876', likes: 56 },
  { title: '求助：Agent在5G协议测试中遇到的边界case处理', author: '陈志强', avatar: '/avatar-4.webp', tag: '求助', tagColor: 'bg-orange-50 text-orange-600', replies: 72, views: '654', likes: 23 },
  { title: '分享一个自制的代码审查Prompt模板', author: '王雪晴', avatar: '/avatar-3.webp', tag: '分享', tagColor: 'bg-green-50 text-green-600', replies: 84, views: '2.1k', likes: 156 },
  { title: '关于多Agent协作模式在基站部署项目中的实践总结', author: '刘浩然', avatar: '/avatar-5.webp', tag: '实践', tagColor: 'bg-blue-50 text-blue-600', replies: 65, views: '543', likes: 45 },
  { title: 'AI生成代码的安全性审查流程与最佳实践', author: '赵敏华', avatar: '/avatar-6.webp', tag: '讨论', tagColor: 'bg-purple-50 text-purple-600', replies: 58, views: '987', likes: 72 },
]

</script>
<template>
  <section id="forum" class="section-forum py-16 relative flex-1 overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-3xl font-bold text-foreground mb-1">AI论坛</h2>
          <p class="text-muted-foreground text-sm">用户交流广场，任何问题讨论和话题交流都可以在这里发起</p>
        </div>
        <button class="hidden sm:inline-flex items-center gap-1 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors">发起话题 <ChevronRight class="w-4 h-4" /></button>
      </div>
      <div class="grid grid-cols-3 gap-4 mb-6">
        <div v-for="stat in forumStats" :key="stat.label" class="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200">
          <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <component :is="stat.icon" class="w-5 h-5 text-primary" />
          </div>
          <div>
            <span class="block text-xl font-bold text-foreground">{{ stat.value }}</span>
            <span class="text-xs text-muted-foreground">{{ stat.label }}</span>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div v-for="(t,i) in topics" :key="i" :class="['flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer', i < topics.length - 1 ? 'border-b border-gray-100' : '']">
          <img :src="t.avatar" :alt="t.author" class="w-10 h-10 rounded-full object-cover flex-shrink-0" />
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span :class="['text-xs font-medium px-1.5 py-0.5 rounded', t.tagColor]">{{ t.tag }}</span>
              <span class="text-sm font-medium text-foreground truncate hover:text-primary transition-colors">{{ t.title }}</span>
            </div>
            <span class="text-xs text-muted-foreground">{{ t.author }}</span>
          </div>
          <div class="hidden sm:flex items-center gap-4 text-xs text-muted-foreground flex-shrink-0">
            <span class="flex items-center gap-1"><MessageCircle class="w-3.5 h-3.5" />{{ t.replies }}</span>
            <span class="flex items-center gap-1"><Eye class="w-3.5 h-3.5" />{{ t.views }}</span>
            <span class="flex items-center gap-1"><ThumbsUp class="w-3.5 h-3.5" />{{ t.likes }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
