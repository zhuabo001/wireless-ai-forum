<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { PagedResult } from '@/types/api'
import type { ChallengeMetaResponse } from '@/api/challenges'
import { fetchChallengeMeta, fetchChallenges } from '@/api/challenges'
import type {
  ChallengeItem,
  ChallengePageMeta,
  ChallengeSidebarData,
} from '@/types/pageDesign/challengeHeroes'
import IconRenderer from '@/components/ui/IconRenderer.vue'
import Pagination from '@/components/Pagination.vue'
import ChallengeToolbar from './ChallengeToolbar.vue'
import ChallengeList from './ChallengeList.vue'
import ChallengeSidebar from './ChallengeSidebar.vue'

const PAGE_SIZE = 10

const pageMeta = ref<ChallengePageMeta>({ title: '', description: '', createButtonText: '' })
const meta = ref<ChallengeMetaResponse | null>(null)
const sidebarData = ref<ChallengeSidebarData>({ viewRank: [], usefulRank: [], scoreRank: [], totalScoreRank: [] })

const activeTab = ref<string>('all')
const selectedDepartment = ref<string>('')
const selectedSort = ref<string>('latest')
const selectedDate = ref<string>('')
const keyword = ref<string>('')
const currentPage = ref<number>(1)

const challenges = ref<ChallengeItem[]>([])
const total = ref<number>(0)
const loading = ref<boolean>(false)

const totalPages = computed<number>(() => Math.ceil(total.value / PAGE_SIZE))

async function loadChallenges(): Promise<void> {
  loading.value = true
  try {
    const result: PagedResult<ChallengeItem> = await fetchChallenges({
      tab: activeTab.value,
      department: selectedDepartment.value || undefined,
      sort: selectedSort.value,
      date: selectedDate.value || undefined,
      keyword: keyword.value.trim() || undefined,
      page: currentPage.value,
      pageSize: PAGE_SIZE,
    })
    challenges.value = result.list
    total.value = result.total
  } catch {
    ElMessage.error('难题列表加载失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 关键词输入做 300ms 防抖，其余过滤条件变化立即生效；过滤变化都会回到第一页
// 不在第一页时只重置页码，由 currentPage watcher 统一触发加载，避免重复请求
function resetPageAndLoad(): void {
  if (currentPage.value !== 1) {
    currentPage.value = 1
    return
  }
  void loadChallenges()
}

let keywordTimer: ReturnType<typeof setTimeout> | undefined
watch(keyword, () => {
  clearTimeout(keywordTimer)
  keywordTimer = setTimeout(resetPageAndLoad, 300)
})
watch([activeTab, selectedDepartment, selectedSort, selectedDate], resetPageAndLoad)
watch(currentPage, () => {
  void loadChallenges()
})

onMounted(async () => {
  try {
    const metaResponse = await fetchChallengeMeta()
    meta.value = metaResponse
    pageMeta.value = metaResponse.meta
    sidebarData.value = metaResponse.sidebar
  } catch {
    ElMessage.error('页面配置加载失败，请稍后重试')
  }
  await loadChallenges()
})

const router = useRouter()

function onCreateChallenge(): void {
  router.push({ path: '/challenges/new', query: { from: 'challenges' } })
}
</script>

<template>
  <div class="pt-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Page Header -->
      <div class="flex items-end justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-foreground mb-2">{{ pageMeta.title }}</h1>
          <p class="text-muted-foreground">{{ pageMeta.description }}</p>
        </div>
        <button
          class="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
          @click="onCreateChallenge"
        >
          <IconRenderer name="plus" class="w-4 h-4" />
          {{ pageMeta.createButtonText }}
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Main Content -->
        <main class="lg:col-span-8">
          <ChallengeToolbar
            v-if="meta"
            :active-tab="activeTab"
            :selected-department="selectedDepartment"
            :selected-sort="selectedSort"
            :selected-date="selectedDate"
            :keyword="keyword"
            :tabs="meta.tabs"
            :department-options="meta.departmentOptions"
            :sort-options="meta.sortOptions"
            @update:active-tab="activeTab = $event"
            @update:selected-department="selectedDepartment = $event"
            @update:selected-sort="selectedSort = $event"
            @update:selected-date="selectedDate = $event"
            @update:keyword="keyword = $event"
          />

          <ChallengeList :challenges="challenges" :loading="loading" />

          <Pagination
            v-if="totalPages > 1"
            :current-page="currentPage"
            :total-pages="totalPages"
            @update:current-page="currentPage = $event"
          />
        </main>

        <!-- Right Sidebar -->
        <ChallengeSidebar :sidebar-data="sidebarData" />
      </div>
    </div>
  </div>
</template>
