<script setup lang="ts">
import { ref, computed } from 'vue'
import SectionHeader from '../components/layout/SectionHeader.vue'
import BaseCard from '../components/ui/BaseCard.vue'
import IconRenderer from '../components/ui/IconRenderer.vue'
import TagBadge from '../components/ui/TagBadge.vue'
import { marketCategories, marketItems, marketTypeColors } from '../data/home'

const active = ref('全部')
const categories = marketCategories
const typeColors = marketTypeColors
const filtered = computed(() => active.value === '全部' ? marketItems : marketItems.filter(i => i.type === active.value))

</script>
<template>
  <div class="section-market py-16 relative flex-1 overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeader title="Agent市场" description="无线用户发布的Agent拓展生态 — extension、skill、MCP、subagent、command" />
      <div class="flex flex-wrap justify-center gap-2 mb-8">
        <ElButton
          v-for="cat in categories"
          :key="cat"
          :type="active === cat ? 'primary' : 'default'"
          class="market-filter-button"
          @click="active = cat"
        >
          {{ cat }}
        </ElButton>
      </div>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <BaseCard v-for="(item,i) in filtered" :key="`${item.name}-${i}`" interactive>
          <div class="flex items-start justify-between mb-3">
            <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><IconRenderer :name="item.icon" class-name="w-5 h-5 text-primary" /></div>
            <TagBadge :label="item.type" :class-name="typeColors[item.type]" />
          </div>
          <h3 class="text-base font-semibold text-foreground mb-1">{{ item.name }}</h3>
          <p class="text-sm text-muted-foreground mb-4">{{ item.desc }}</p>
          <div class="flex items-center gap-4 text-xs text-muted-foreground">
            <span class="flex items-center gap-1"><IconRenderer name="download" class-name="w-3.5 h-3.5" />{{ item.downloads }}</span>
            <span class="flex items-center gap-1"><IconRenderer name="star" class-name="w-3.5 h-3.5 text-amber-500" />{{ item.rating }}</span>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>
