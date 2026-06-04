<script setup lang="ts">
import IconRenderer from '../components/ui/IconRenderer.vue'
import { brand, footerColumns, footerContacts, footerLegalLinks } from '../data/navigation'
</script>
<template>
  <footer class="bg-foreground text-background/80 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        <div>
          <div class="flex items-center gap-2.5 font-bold text-lg text-background mb-3">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
              <IconRenderer name="zap" class-name="w-5 h-5 text-white" />
            </div>
            <span>{{ brand.name }}</span>
          </div>
          <p class="text-sm text-background/60 leading-relaxed">{{ brand.description }}</p>
        </div>
        <div v-for="column in footerColumns" :key="column.title">
          <h4 class="font-semibold text-background text-sm mb-3">{{ column.title }}</h4>
          <ul class="space-y-2"><li v-for="item in column.items" :key="item.label"><a :href="item.href" class="text-sm text-background/60 hover:text-background transition-colors">{{ item.label }}</a></li></ul>
        </div>
        <div>
          <h4 class="font-semibold text-background text-sm mb-3">联系我们</h4>
          <div class="space-y-2">
            <a v-for="contact in footerContacts" :key="contact.label" :href="contact.href" class="flex items-center gap-2 text-sm text-background/60 hover:text-background transition-colors"><IconRenderer :name="contact.icon" class-name="w-4 h-4" /> {{ contact.label }}</a>
          </div>
        </div>
      </div>
      <div class="border-t border-background/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p class="text-xs text-background/40">© 2026 无线AI社区. All rights reserved.</p>
        <div class="flex gap-4 text-xs text-background/40">
          <a v-for="link in footerLegalLinks" :key="link.label" :href="link.href" class="hover:text-background/60 transition-colors">{{ link.label }}</a>
        </div>
      </div>
    </div>
  </footer>
</template>
