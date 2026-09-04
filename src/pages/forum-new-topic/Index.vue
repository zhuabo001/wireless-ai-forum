<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import type { EditorModeId, TopicFormData } from '@/types/pageDesign/forumNewTopic'
import {
  pageMeta,
  formLabels,
  formLimits,
  topicCategories,
  presetTags,
  editorModes,
  sourcePageConfig,
  defaultSource,
} from '@/data/pageDesign/forumNewTopic'
import NewTopicBreadcrumb from './NewTopicBreadcrumb.vue'
import TopicTitleField from './TopicTitleField.vue'
import TopicSummaryField from './TopicSummaryField.vue'
import TopicCategorySelect from './TopicCategorySelect.vue'
import TopicTagPicker from './TopicTagPicker.vue'
import CoverUploader from './CoverUploader.vue'
import EditorModeSwitch from './EditorModeSwitch.vue'
import RichTextEditor from '@/components/RichTextEditor.vue'
import MarkdownEditor from './MarkdownEditor.vue'
import PublishActions from './PublishActions.vue'

const title = ref<string>('')
const summary = ref<string>('')
const category = ref<string>('')
const tags = ref<string[]>([])
const coverFile = ref<File | null>(null)
const editorMode = ref<EditorModeId>('rich')
const richContent = ref<string>('')
const mdContent = ref<string>('')
const isSubmitting = ref<boolean>(false)

const route = useRoute()
const sourcePage = (route.query.from as string) || defaultSource
const sourceConfig = computed(() => sourcePageConfig[sourcePage] ?? sourcePageConfig[defaultSource])
const dynamicBackLink = computed(() => sourceConfig.value.href)
const sourceLabel = computed(() => sourceConfig.value.label)

function handleSubmit(): void {
  if (!title.value.trim()) {
    ElMessage.warning('请输入帖子标题')
    return
  }
  if (!category.value) {
    ElMessage.warning('请选择话题领域')
    return
  }
  const content = editorMode.value === 'rich' ? richContent.value : mdContent.value
  if (!content.trim()) {
    ElMessage.warning('请输入正文内容')
    return
  }

  isSubmitting.value = true

  const formData: TopicFormData = {
    title: title.value,
    summary: summary.value,
    category: category.value,
    tags: tags.value,
    coverFile: coverFile.value,
    editorMode: editorMode.value,
    richContent: richContent.value,
    mdContent: mdContent.value,
  }

  console.log('Submit topic:', formData)

  setTimeout(() => {
    ElMessage.success('话题发布成功')
    isSubmitting.value = false
  }, 1000)
}

function handleCancel(): void {
  title.value = ''
  summary.value = ''
  category.value = ''
  tags.value = []
  coverFile.value = null
  editorMode.value = 'rich'
  richContent.value = ''
  mdContent.value = ''
}
</script>

<template>
  <div class="pt-16">
    <div class="w-full lg:w-2/3 xl:w-3/5 mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <NewTopicBreadcrumb
        :back-link="dynamicBackLink"
        :back-title="pageMeta.backTitle"
        :breadcrumb-items="pageMeta.breadcrumbItems"
        :current-label="pageMeta.title"
        :source-label="sourceLabel"
      />

      <ElForm class="space-y-6" @submit.prevent="handleSubmit">
        <TopicTitleField v-model="title" :max-length="formLimits.titleMax" />

        <TopicSummaryField v-model="summary" :max-length="formLimits.summaryMax" />

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <TopicCategorySelect v-model="category" :options="topicCategories" />
          <TopicTagPicker v-model="tags" :preset-tags="presetTags" :max-tags="formLimits.tagsMax" />
        </div>

        <CoverUploader v-model="coverFile" :max-size-m-b="formLimits.coverMaxSizeMB" />

        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-sm font-medium text-foreground">
              {{ formLabels.editorLabel }} <span class="text-red-500">*</span>
            </label>
            <EditorModeSwitch v-model="editorMode" :modes="editorModes" />
          </div>
          <RichTextEditor v-if="editorMode === 'rich'" v-model="richContent" />
          <MarkdownEditor v-if="editorMode === 'md'" v-model="mdContent" />
        </div>

        <PublishActions
          :notice-text="formLabels.noticeText"
          :cancel-link="dynamicBackLink"
          :cancel-text="formLabels.cancelText"
          :submit-text="formLabels.submitText"
          :is-submitting="isSubmitting"
          @submit="handleSubmit"
          @cancel="handleCancel"
        />
      </ElForm>
    </div>
  </div>
</template>
