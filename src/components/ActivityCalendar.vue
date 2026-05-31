<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Clock, Users, Zap } from 'lucide-vue-next'

interface Activity {
  date: string
  title: string
  desc: string
  location: string
  time: string
  participants: number
  type: '线上' | '线下'
  typeColor: string
}

const activities: Activity[] = [
  { date: '2026-06-02', title: 'AI辅助编码实战 Workshop', desc: '动手体验AI辅助编程工具，提升研发效率', location: '研发中心A栋3楼', time: '14:00-17:00', participants: 30, type: '线下', typeColor: 'bg-blue-50 text-blue-600' },
  { date: '2026-06-05', title: '大模型在无线测试中的应用分享', desc: '测试部分享GPT-4在自动化测试中的最新实践', location: '线上会议室', time: '15:00-16:30', participants: 120, type: '线上', typeColor: 'bg-green-50 text-green-600' },
  { date: '2026-06-08', title: 'Agent开发入门培训', desc: '从零开始学习Agent开发与部署', location: '培训中心', time: '09:30-12:00', participants: 50, type: '线下', typeColor: 'bg-blue-50 text-blue-600' },
  { date: '2026-06-12', title: 'Q2 AI技术圆桌讨论', desc: '季度技术深度交流，聚焦多Agent协作', location: '总部会议中心', time: '14:00-18:00', participants: 25, type: '线下', typeColor: 'bg-blue-50 text-blue-600' },
  { date: '2026-06-15', title: '代码审查最佳实践分享会', desc: '分享AI辅助代码审查的流程与工具', location: '线上', time: '19:00-20:30', participants: 200, type: '线上', typeColor: 'bg-green-50 text-green-600' },
  { date: '2026-06-18', title: '无线AI极客汇周年庆', desc: '社区一周年庆典，回顾与展望', location: '总部大礼堂', time: '13:30-17:00', participants: 300, type: '线下', typeColor: 'bg-purple-50 text-purple-600' },
  { date: '2026-06-22', title: 'MCP协议深度解析', desc: '深入理解Model Context Protocol的设计与实现', location: '线上会议室', time: '20:00-21:30', participants: 80, type: '线上', typeColor: 'bg-green-50 text-green-600' },
  { date: '2026-06-25', title: 'Prompt Engineering 进阶课程', desc: '高级提示词工程技巧与实战案例', location: '研发中心B栋', time: '14:00-17:00', participants: 40, type: '线下', typeColor: 'bg-blue-50 text-blue-600' },
  { date: '2026-06-28', title: '月度优秀Agent评选颁奖', desc: '评选本月最佳Agent扩展，颁发荣誉证书', location: '线上', time: '16:00-17:00', participants: 500, type: '线上', typeColor: 'bg-amber-50 text-amber-600' },
]

const activityMap = computed(() => {
  const map: Record<string, Activity> = {}
  activities.forEach(a => { map[a.date] = a })
  return map
})

const today = new Date()
const currentYear = ref(2026)
const currentMonth = ref(5)
const selectedDate = ref('2026-06-02')

const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
const weekDays = ['日', '一', '二', '三', '四', '五', '六']

const firstDayOfMonth = computed(() => new Date(currentYear.value, currentMonth.value, 1).getDay())
const daysInMonth = computed(() => new Date(currentYear.value, currentMonth.value + 1, 0).getDate())

const calendarDays = computed(() => {
  const days: { day: number; dateStr: string; hasActivity: boolean; isSelected: boolean }[] = []
  const prefix = firstDayOfMonth.value
  for (let i = 0; i < prefix; i++) days.push({ day: 0, dateStr: '', hasActivity: false, isSelected: false })
  const year = currentYear.value
  const month = currentMonth.value
  const mStr = String(month + 1).padStart(2, '0')
  for (let d = 1; d <= daysInMonth.value; d++) {
    const dateStr = `${year}-${mStr}-${String(d).padStart(2, '0')}`
    days.push({
      day: d,
      dateStr,
      hasActivity: !!activityMap.value[dateStr],
      isSelected: dateStr === selectedDate.value,
    })
  }
  return days
})

const selectedActivity = computed(() => activityMap.value[selectedDate.value] || null)

function prevMonth() {
  if (currentMonth.value === 0) { currentMonth.value = 11; currentYear.value-- }
  else currentMonth.value--
}
function nextMonth() {
  if (currentMonth.value === 11) { currentMonth.value = 0; currentYear.value++ }
  else currentMonth.value++
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
        <CalendarIcon class="w-5 h-5 text-primary" />
        <h3 class="text-base font-semibold text-foreground">活动详情</h3>
        <span v-if="selectedActivity" :class="['ml-auto text-xs font-medium px-2 py-0.5 rounded', selectedActivity.typeColor]">
          {{ selectedActivity.type }}
        </span>
        <span v-else class="ml-auto text-xs font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-400">
          无活动
        </span>
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
            <Clock class="w-3.5 h-3.5 text-primary" />
            <span>{{ selectedActivity.time }}</span>
          </div>
          <div class="flex items-center gap-2">
            <MapPin class="w-3.5 h-3.5 text-primary" />
            <span>{{ selectedActivity.location }}</span>
          </div>
          <div class="flex items-center gap-2">
            <Users class="w-3.5 h-3.5 text-primary" />
            <span>{{ selectedActivity.participants }}人已报名</span>
          </div>
        </div>
        <button class="mt-4 w-full py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors">
          立即报名
        </button>
      </div>
      <!-- No activity -->
      <div v-else class="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-5 flex-1 flex flex-col items-center justify-center text-center">
        <Zap class="w-10 h-10 text-gray-300 mb-3" />
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
            <ChevronLeft class="w-4 h-4 text-muted-foreground" />
          </button>
          <span class="text-base font-semibold text-foreground min-w-[100px] text-center">
            {{ currentYear }}年{{ monthNames[currentMonth] }}
          </span>
          <button @click="nextMonth" class="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <ChevronRight class="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      <!-- Weekday headers -->
      <div class="grid grid-cols-7 gap-1 mb-2">
        <div v-for="wd in weekDays" :key="wd" class="text-center text-xs font-medium text-muted-foreground py-1">
          {{ wd }}
        </div>
      </div>

      <!-- Days grid -->
      <div class="grid grid-cols-7 gap-1 flex-1">
        <div
          v-for="(day, i) in calendarDays"
          :key="i"
          @click="selectDate(day.dateStr, day.hasActivity)"
          :class="[
            'relative flex flex-col items-center justify-center rounded-lg text-sm transition-all',
            day.day === 0 ? 'invisible' : '',
            day.isSelected ? 'bg-primary text-white shadow-sm' : '',
            !day.isSelected && day.hasActivity ? 'text-foreground font-medium hover:bg-gray-100 cursor-pointer' : '',
            !day.isSelected && !day.hasActivity ? 'text-gray-300 cursor-not-allowed' : '',
          ]"
        >
          <span>{{ day.day || '' }}</span>
        </div>
      </div>

    </div>
  </div>
</template>
