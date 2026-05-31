<script setup lang="ts">
import { Github, Mail, Zap } from 'lucide-vue-next'
const links: Record<string,string[]> = { '快速链接': ['首页','论坛','课程','Agent市场'], '资源': ['文档中心','开发指南','API参考'], '社区': ['优秀实践','线下活动','成员名录'] }
</script>
<template>
  <footer class="bg-foreground text-background/80 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        <div>
          <div class="flex items-center gap-2.5 font-bold text-lg text-background mb-3">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
              <Zap class="w-5 h-5 text-white" />
            </div>
            <span>无线AI极客汇</span>
          </div>
          <p class="text-sm text-background/60 leading-relaxed">AI赋能无线研发，连接每一位创新者。致力于构建开放的AI技术交流平台。</p>
        </div>
        <div v-for="(items,title) in links" :key="title">
          <h4 class="font-semibold text-background text-sm mb-3">{{ title }}</h4>
          <ul class="space-y-2"><li v-for="item in items" :key="item"><a href="#" class="text-sm text-background/60 hover:text-background transition-colors">{{ item }}</a></li></ul>
        </div>
        <div>
          <h4 class="font-semibold text-background text-sm mb-3">联系我们</h4>
          <div class="space-y-2">
            <a href="#" class="flex items-center gap-2 text-sm text-background/60 hover:text-background transition-colors"><Github class="w-4 h-4" /> GitHub</a>
            <a href="#" class="flex items-center gap-2 text-sm text-background/60 hover:text-background transition-colors"><Mail class="w-4 h-4" /> feedback@wireless-ai.community</a>
          </div>
        </div>
      </div>
      <div class="border-t border-background/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p class="text-xs text-background/40">© 2026 无线AI社区. All rights reserved.</p>
        <div class="flex gap-4 text-xs text-background/40">
          <a href="#" class="hover:text-background/60 transition-colors">服务条款</a>
          <a href="#" class="hover:text-background/60 transition-colors">隐私政策</a>
        </div>
      </div>
    </div>
  </footer>
</template>
