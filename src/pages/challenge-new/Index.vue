<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { createChallenge, fetchChallengeMeta, type CreateChallengePayload } from '@/api/challenges'
import { ApiError } from '@/api/http'
import type {
  ChallengeCategoryOption,
  ChallengeDepartmentOption,
  ChallengeDifficulty,
  ChallengeDifficultyOption,
} from '@/types/pageDesign/challengeHeroes'
import IconRenderer from '@/components/ui/IconRenderer.vue'
import RichTextEditor from '@/components/RichTextEditor.vue'

const TITLE_MAX = 120

const title = ref<string>('')
const category = ref<string>('')
const department = ref<string>('')
const difficulty = ref<ChallengeDifficulty | ''>('')
const contentHtml = ref<string>('')
const isSubmitting = ref<boolean>(false)

const categoryOptions = ref<ChallengeCategoryOption[]>([])
const departmentOptions = ref<ChallengeDepartmentOption[]>([])
const difficultyOptions = ref<ChallengeDifficultyOption[]>([])

onMounted(async () => {
  try {
    const meta = await fetchChallengeMeta()
    categoryOptions.value = meta.categoryOptions
    departmentOptions.value = meta.departmentOptions
    difficultyOptions.value = meta.difficultyOptions
  } catch {
    ElMessage.error('表单配置加载失败，请刷新重试')
  }
})

const router = useRouter()

const titleCount = computed<string>(() => `${title.value.length}/${TITLE_MAX}`)

async function handleSubmit(): Promise<void> {
  if (!title.value.trim()) {
    ElMessage.warning('请填写难题题目')
    return
  }
  if (!category.value) {
    ElMessage.warning('请选择问题类别')
    return
  }
  if (!department.value) {
    ElMessage.warning('请选择所属部门')
    return
  }
  if (!difficulty.value) {
    ElMessage.warning('请选择难度自评')
    return
  }
  if (!contentHtml.value.replace(/<[^>]*>/g, '').trim()) {
    ElMessage.warning('请填写难题内容')
    return
  }

  const payload: CreateChallengePayload = {
    title: title.value.trim(),
    category: category.value,
    department: department.value,
    difficulty: difficulty.value,
    contentHtml: contentHtml.value,
  }

  isSubmitting.value = true
  try {
    const { id } = await createChallenge(payload)
    ElMessage.success('难题发布成功，等待平台管理员评定分值')
    router.push(`/challenges/${id}`)
  } catch (error) {
    ElMessage.error(error instanceof ApiError ? error.message : '发布失败，请稍后重试')
  } finally {
    isSubmitting.value = false
  }
}

function handleCancel(): void {
  router.push('/challenges')
}
</script>

<template>
  <div class="pt-16">
    <div class="w-full lg:w-2/3 xl:w-3/5 mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Page Header -->
      <div class="mb-8">
        <div class="flex items-center gap-3 mb-3">
          <router-link
            to="/challenges"
            class="inline-flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
            title="返回难题英雄榜"
          >
            <IconRenderer name="arrow-left" class="w-4 h-4" />
          </router-link>
          <div class="flex items-center gap-2 text-sm text-muted-foreground">
            <router-link to="/challenges" class="hover:text-primary transition-colors">难题英雄榜</router-link>
            <IconRenderer name="chevron-right" class="w-3.5 h-3.5" />
            <span>发起难题</span>
          </div>
        </div>
        <h1 class="text-2xl font-bold text-foreground">发起难题</h1>
        <p class="text-sm text-muted-foreground mt-2">清晰描述你遇到的业务难题并设置难度自评，发布后进入「评分中」状态，由平台管理员评定悬赏分值</p>
      </div>

      <form class="space-y-6" @submit.prevent="handleSubmit">
        <!-- Title -->
        <div>
          <label class="block text-sm font-medium text-foreground mb-2">
            难题题目 <span class="text-red-500">*</span>
          </label>
          <input
            v-model="title"
            type="text"
            placeholder="用一句话说清楚你遇到的难题，例如：高话务场景下基站节能与体验如何兼得？"
            :maxlength="TITLE_MAX"
            class="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white"
          >
          <div class="flex justify-end mt-1.5">
            <span class="text-xs text-muted-foreground">{{ titleCount }}</span>
          </div>
        </div>

        <!-- Category & Department -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-foreground mb-2">
              问题类别 <span class="text-red-500">*</span>
            </label>
            <select
              v-model="category"
              class="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white appearance-none cursor-pointer"
            >
              <option value="" disabled>请选择问题类别</option>
              <option v-for="opt in categoryOptions" :key="opt.id" :value="opt.id">{{ opt.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-foreground mb-2">
              所属部门 <span class="text-red-500">*</span>
            </label>
            <select
              v-model="department"
              class="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white appearance-none cursor-pointer"
            >
              <option value="" disabled>请选择难题所属部门</option>
              <option v-for="opt in departmentOptions" :key="opt.id" :value="opt.id">{{ opt.name }}</option>
            </select>
          </div>
        </div>

        <!-- Score: admin-evaluated -->
        <div>
          <label class="block text-sm font-medium text-foreground mb-2">悬赏分值</label>
          <div class="border border-border rounded-xl bg-white px-4 py-4">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                <IconRenderer name="coins" class="w-4 h-4 text-amber-600" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-foreground">由平台管理员评审后确定</p>
                <p class="text-xs text-muted-foreground">根据难度自评、业务影响面和紧迫度综合评定，参考区间 100–800 分</p>
              </div>
              <span class="text-xs font-medium px-2 py-1 rounded-md bg-muted text-muted-foreground flex-shrink-0">发布后评定</span>
            </div>
            <div class="mt-4 pt-4 border-t border-border/60">
              <p class="text-xs font-medium text-foreground mb-2">
                难度自评 <span class="text-red-500">*</span>
                <span class="font-normal text-muted-foreground ml-1">供管理员定分参考</span>
              </p>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="opt in difficultyOptions"
                  :key="opt.id"
                  type="button"
                  :class="[
                    'px-3 py-1.5 text-xs font-medium border rounded-md transition-colors',
                    difficulty === opt.id
                      ? 'bg-primary/10 text-primary border-primary/40'
                      : 'border-border text-muted-foreground hover:border-primary/40 hover:text-primary',
                  ]"
                  @click="difficulty = opt.id"
                >
                  {{ opt.name }} · {{ opt.description }}
                </button>
              </div>
            </div>
            <div class="flex items-center gap-2 text-xs text-muted-foreground mt-4">
              <IconRenderer name="shield-check" class="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              普通用户（含发布者）不可自定义分值，避免刷分等不公平行为；超管可在管理后台审核并调整分值
            </div>
          </div>
        </div>

        <!-- Content -->
        <div>
          <label class="block text-sm font-medium text-foreground mb-2">
            难题内容 <span class="text-red-500">*</span>
          </label>
          <RichTextEditor
            v-model="contentHtml"
            placeholder="建议按以下结构描述，帮助揭榜人快速理解：【背景与场景】问题发生在什么业务场景中；【现状与痛点】目前怎么解决的，卡在哪里；【期望目标】希望达到什么效果，如何验收；【已有材料】相关数据、日志、文档情况"
          />
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-between pt-4 border-t border-border">
          <div class="text-xs text-muted-foreground">
            <span class="flex items-center gap-1.5">
              <IconRenderer name="info" class="w-3.5 h-3.5" />
              发布后难题进入「评分中」状态，可在我的发布中随时查看进展
            </span>
          </div>
          <div class="flex items-center gap-3">
            <button
              type="button"
              class="px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
              @click="handleCancel"
            >
              取消
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="px-6 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {{ isSubmitting ? '发布中...' : '发布难题' }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
