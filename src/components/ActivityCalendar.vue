<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import IconRenderer from './ui/IconRenderer.vue'
import { activities } from '../data/home'
import type { ActivityItem } from '../types/home'

const activityMap = computed(() => {
  const map: Record<string, ActivityItem> = {}
  activities.forEach(a => { map[a.date] = a })
  return map
})

const currentYear = ref(2026)
const currentMonth = ref(5)
const currentDate = ref(new Date(currentYear.value, currentMonth.value, 1))
const selectedDate = ref('2026-06-02')

const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']

const selectedActivity = computed(() => activityMap.value[selectedDate.value] || null)
const selectedActivityTagType = computed(() => selectedActivity.value?.type === '线上' ? 'success' : 'primary')

function prevMonth() {
  if (currentMonth.value === 0) { currentMonth.value = 11; currentYear.value-- }
  else currentMonth.value--
  currentDate.value = new Date(currentYear.value, currentMonth.value, 1)
}
function nextMonth() {
  if (currentMonth.value === 11) { currentMonth.value = 0; currentYear.value++ }
  else currentMonth.value++
  currentDate.value = new Date(currentYear.value, currentMonth.value, 1)
}
function selectDate(dateStr: string, hasActivity: boolean) {
  if (!dateStr || !hasActivity) return
  selectedDate.value = dateStr
}

// Watch for month changes and reset selected date if needed
watch([currentYear, currentMonth], () => {
  const mStr = String(currentMonth.value + 1).padStart(2, '0')
  const checkDate = `${currentYear.value}-${mStr}-${String(parseInt(selectedDate.value.split('-')[2])).padStart(2, '0')}`
  if (!activityMap.value[checkDate]) {
    // Find first activity in current month
    const first = activities.find(a => a.date.startsWith(`${currentYear.value}-${mStr}`))
    if (first) selectedDate.value = first.date
  }
})
</script>

<template>
  <div class="flex flex-col lg:flex-row gap-5">
    <!-- Left: Activity Card (2/5 width) -->
    <div class="lg:w-2/5 flex flex-col">
      <div class="flex items-center gap-2 mb-3">
        <IconRenderer name="calendar" class-name="w-5 h-5 text-primary" />
        <h3 class="text-base font-semibold text-foreground">活动详情</h3>
        <ElTag v-if="selectedActivity" :type="selectedActivityTagType" size="small" class="ml-auto">
          {{ selectedActivity.type }}
        </ElTag>
        <ElTag v-else type="info" size="small" class="ml-auto">
          无活动
        </ElTag>
      </div>
      <!-- Has activity -->
      <div v-if="selectedActivity" class="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all flex-1">
        <div class="flex items-center gap-2 mb-3">
          <div class="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span class="text-xs text-muted-foreground">{{ selectedActivity.date }}</span>
        </div>
        <h4 class="text-lg font-bold text-foreground mb-2">{{ selectedActivity.title }}</h4>
        <p class="text-sm text-muted-foreground mb-4 leading-relaxed">{{ selectedActivity.desc }}</p>
        <div class="space-y-2 text-xs text-muted-foreground">
          <div class="flex items-center gap-2">
            <IconRenderer name="clock" class-name="w-3.5 h-3.5 text-primary" />
            <span>{{ selectedActivity.time }}</span>
          </div>
          <div class="flex items-center gap-2">
            <IconRenderer name="map-pin" class-name="w-3.5 h-3.5 text-primary" />
            <span>{{ selectedActivity.location }}</span>
          </div>
          <div class="flex items-center gap-2">
            <IconRenderer name="users" class-name="w-3.5 h-3.5 text-primary" />
            <span>{{ selectedActivity.participants }}人已报名</span>
          </div>
        </div>
        <ElButton type="primary" class="mt-4 w-full">
          立即报名
        </ElButton>
      </div>
      <!-- No activity -->
      <div v-else class="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-5 flex-1 flex flex-col items-center justify-center text-center">
        <IconRenderer name="zap" class-name="w-10 h-10 text-gray-300 mb-3" />
        <p class="text-sm text-muted-foreground">当日暂无活动安排</p>
        <p class="text-xs text-gray-400 mt-1">请选择有红色标记的日期查看活动</p>
      </div>
    </div>

    <!-- Right: Calendar (3/5 width) -->
    <div class="lg:w-3/5 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-5 flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-1">
          <button @click="prevMonth" class="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <IconRenderer name="chevron-left" class-name="w-4 h-4 text-muted-foreground" />
          </button>
          <span class="text-base font-semibold text-foreground min-w-[100px] text-center">
            {{ currentYear }}年{{ monthNames[currentMonth] }}
          </span>
          <button @click="nextMonth" class="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <IconRenderer name="chevron-right" class-name="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      <!-- Weekday headers -->
      <ElCalendar :model-value="currentDate" class="activity-el-calendar flex-1">
        <template #header>
          <div />
        </template>
        <template #date-cell="{ data }">
          <div
            :data-date="data.day"
            :data-has-activity="!!activityMap[data.day]"
            @click="selectDate(data.day, !!activityMap[data.day])"
            :class="[
              'activity-calendar-day relative flex flex-col items-center justify-center rounded-lg text-sm transition-all',
              data.type !== 'current-month' ? 'invisible' : '',
              data.day === selectedDate ? 'bg-primary text-white shadow-sm' : '',
              data.day !== selectedDate && activityMap[data.day] ? 'text-foreground font-medium hover:bg-gray-100 cursor-pointer' : '',
              data.day !== selectedDate && !activityMap[data.day] ? 'text-gray-300 cursor-not-allowed' : '',
            ]"
          >
            <span>{{ Number(data.day.slice(-2)) }}</span>
          </div>
        </template>
      </ElCalendar>

    </div>
  </div>
</template>
