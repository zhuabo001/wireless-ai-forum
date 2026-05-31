<script setup lang="ts">
const row1 = [
  { tag: 'HOT', tagColor: 'bg-red-50 text-red-600', text: 'GPT-4在协议分析中的应用心得', author: '张明远' },
  { tag: 'NEW', tagColor: 'bg-green-50 text-green-600', text: 'Agent市场正式上线，欢迎体验', author: '社区公告' },
  { tag: 'HOT', tagColor: 'bg-red-50 text-red-600', text: 'Agent调试常见问题和解决方案', author: '李思涵' },
  { tag: '活动', tagColor: 'bg-blue-50 text-blue-600', text: '本周五AI辅助无线研发技术分享会', author: '线下活动' },
  { tag: '分享', tagColor: 'bg-purple-50 text-purple-600', text: '自制代码审查Prompt模板分享', author: '王雪晴' },
  { tag: 'HOT', tagColor: 'bg-red-50 text-red-600', text: '大模型微调 vs 提示工程如何选择', author: '陈志强' },
  { tag: 'NEW', tagColor: 'bg-green-50 text-green-600', text: 'LangChain v0.2模块化架构解读', author: 'AI情报局' },
  { tag: '实践', tagColor: 'bg-amber-50 text-amber-600', text: '多Agent协作在基站部署中的实践', author: '刘浩然' },
]
const row2 = [
  { tag: '课程', tagColor: 'bg-violet-50 text-violet-600', text: '大模型驱动无线研发入门 - 新课上线', author: '无线研究院' },
  { tag: 'HOT', tagColor: 'bg-red-50 text-red-600', text: 'AI生成代码安全性审查最佳实践', author: '赵敏华' },
  { tag: '工具', tagColor: 'bg-cyan-50 text-cyan-600', text: 'CodeLens智能代码分析插件发布', author: 'Agent市场' },
  { tag: '活动', tagColor: 'bg-blue-50 text-blue-600', text: 'Q1季度AI技术圆桌讨论报名中', author: '氛围建设' },
  { tag: 'HOT', tagColor: 'bg-red-50 text-red-600', text: '5G协议测试边界case处理求助', author: '求助区' },
  { tag: 'NEW', tagColor: 'bg-green-50 text-green-600', text: 'OpenAI Assistant API开放使用', author: 'AI情报局' },
  { tag: '课程', tagColor: 'bg-violet-50 text-violet-600', text: 'Agent开发与部署指南 - 热门推荐', author: '工程技术部' },
  { tag: '分享', tagColor: 'bg-purple-50 text-purple-600', text: '新手入门：快速搭建第一个AI Agent', author: '刘浩然' },
]
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
