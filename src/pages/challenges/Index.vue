<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useChallengeList, useChallengeMeta } from '@/composables/useChallenges'
import type { ChallengeListQuery } from '@/api/challenges'
import type { ChallengePageMeta, ChallengeSidebarData } from '@/types/pageDesign/challengeHeroes'
import IconRenderer from '@/components/ui/IconRenderer.vue'
import Pagination from '@/components/Pagination.vue'
import ChallengeToolbar from './ChallengeToolbar.vue'
import ChallengeList from './ChallengeList.vue'
import ChallengeSidebar from './ChallengeSidebar.vue'

const PAGE_SIZE = 10
const EMPTY_PAGE_META: ChallengePageMeta = { title: '', description: '', createButtonText: '' }
const EMPTY_SIDEBAR: ChallengeSidebarData = { viewRank: [], usefulRank: [], scoreRank: [], totalScoreRank: [] }

const activeTab = ref<string>('all')
const selectedDepartment = ref<string>('')
const selectedSort = ref<string>('latest')
const selectedDate = ref<string>('')
const keyword = ref<string>('')
const debouncedKeyword = ref<string>('')
const currentPage = ref<number>(1)

const { data: meta } = useChallengeMeta()
const pageMeta = computed<ChallengePageMeta>(() => meta.value?.meta ?? EMPTY_PAGE_META)
const sidebarData = computed<ChallengeSidebarData>(() => meta.value?.sidebar ?? EMPTY_SIDEBAR)

const filters = computed<ChallengeListQuery>(() => ({
  tab: activeTab.value,
  department: selectedDepartment.value || undefined,
  sort: selectedSort.value,
  date: selectedDate.value || undefined,
  keyword: debouncedKeyword.value.trim() || undefined,
  page: currentPage.value,
  pageSize: PAGE_SIZE,
}))

const { data: listResult, isLoading, isError, refetch } = useChallengeList(filters)
const challenges = computed(() => listResult.value?.list ?? [])
const total = computed(() => listResult.value?.total ?? 0)
const totalPages = computed<number>(() => Math.ceil(total.value / PAGE_SIZE))

// 关键词输入做 300ms 防抖后写入 debouncedKeyword，其余过滤条件变化立即生效；
// 过滤变化都回到第一页——page 是 queryKey 的一部分，改它就会自动触发重取
let keywordTimer: ReturnType<typeof setTimeout> | undefined
watch(keyword, () => {
  clearTimeout(keywordTimer)
  keywordTimer = setTimeout(() => {
    debouncedKeyword.value = keyword.value
  }, 300)
})
watch([activeTab, selectedDepartment, selectedSort, selectedDate, debouncedKeyword], () => {
  currentPage.value = 1
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

          <div v-if="isError" class="bg-white rounded-xl border border-border px-5 py-12 text-center">
            <p class="text-sm text-muted-foreground mb-4">难题列表加载失败，请稍后重试</p>
            <button
              class="px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
              @click="refetch()"
            >
              重试
            </button>
          </div>
          <ChallengeList v-else :challenges="challenges" :loading="isLoading" />

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
