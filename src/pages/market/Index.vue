<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElButton } from 'element-plus'
import type { NavLink } from '@/types/home'
import type { AgentItem } from '@/types/pageDesign/market'
import Navbar from '@/components/Navbar.vue'
import FeaturedAgents from './FeaturedAgents.vue'
import MarketToolbar from './MarketToolbar.vue'
import AgentCard from './AgentCard.vue'
import MarketSidebar from './MarketSidebar.vue'
import {
  marketMeta,
  featuredAgents,
  agentItems,
  categoryOptions,
  sortOptions,
  downloadRank,
  newDevelopers,
  usageGuide,
} from '@/data/pageDesign/market'

const marketNavLinks: NavLink[] = [
  { label: '首页', href: '/' },
  { label: '情报局', href: '/intelligence' },
  { label: '课程', href: '/courses' },
  { label: '论坛', href: '/forum' },
  { label: 'Agent市场', href: '/market' },
]

const INITIAL_COUNT = 6

const keyword = ref('')
const selectedCategory = ref('全部')
const sortKey = ref('default')
const visibleCount = ref(INITIAL_COUNT)

function parseDownloads(d: string): number {
  if (d.endsWith('k')) return parseFloat(d) * 1000
  return parseFloat(d)
}

const baseFiltered = computed<AgentItem[]>(() => {
  let list = [...agentItems]

  if (selectedCategory.value !== '全部') {
    list = list.filter((item) => item.type === selectedCategory.value)
  }

  if (keyword.value.trim()) {
    const kw = keyword.value.trim().toLowerCase()
    list = list.filter(
      (item) =>
        item.name.toLowerCase().includes(kw) || item.desc.toLowerCase().includes(kw),
    )
  }

  return list
})

const filteredAgents = computed<AgentItem[]>(() => {
  const list = [...baseFiltered.value]

  switch (sortKey.value) {
    case 'downloads':
      list.sort((a, b) => parseDownloads(b.downloads) - parseDownloads(a.downloads))
      break
    case 'rating':
      list.sort((a, b) => b.rating - a.rating)
      break
    default:
      break
  }

  return list.slice(0, visibleCount.value)
})

const hasMore = computed(() => visibleCount.value < baseFiltered.value.length)

function loadMore() {
  visibleCount.value += 3
}
</script>

<template>
  <Navbar :links="marketNavLinks" active-label="Agent市场" />

  <div class="pt-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-foreground mb-2">{{ marketMeta.title }}</h1>
        <p class="text-muted-foreground">{{ marketMeta.description }}</p>
      </div>

      <!-- Featured Section -->
      <FeaturedAgents :agents="featuredAgents" />

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Main Content -->
        <main class="lg:col-span-9">
          <MarketToolbar
            v-model:active-category="selectedCategory"
            v-model:keyword="keyword"
            v-model:sort-key="sortKey"
            :categories="categoryOptions"
            :sort-options="sortOptions"
          />

          <!-- Agent Grid -->
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AgentCard v-for="agent in filteredAgents" :key="agent.name" :agent="agent" />
          </div>

          <!-- Empty State -->
          <div
            v-if="filteredAgents.length === 0"
            class="text-center py-12 text-muted-foreground text-sm"
          >
            没有找到匹配的Agent
          </div>

          <!-- Load More -->
          <div v-if="hasMore" class="mt-6">
            <ElButton class="w-full" @click="loadMore">加载更多</ElButton>
          </div>
        </main>

        <!-- Sidebar -->
        <MarketSidebar
          :download-rank="downloadRank"
          :new-developers="newDevelopers"
          :usage-guide="usageGuide"
        />
      </div>
    </div>
  </div>
</template>
