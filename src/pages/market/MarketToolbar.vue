<script setup lang="ts">
import { Search } from 'lucide-vue-next'

defineProps<{
  activeCategory: string
  keyword: string
  sortKey: string
  categories: string[]
  sortOptions: { label: string; value: string }[]
}>()

const emit = defineEmits<{
  'update:activeCategory': [value: string]
  'update:keyword': [value: string]
  'update:sortKey': [value: string]
}>()

function onCategoryClick(cat: string) {
  emit('update:activeCategory', cat)
}

function onSearchInput(val: string | number) {
  emit('update:keyword', String(val))
}

function onSortChange(val: string | number) {
  emit('update:sortKey', String(val))
}
</script>

<template>
  <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
    <div class="flex flex-wrap gap-2">
      <button
        v-for="cat in categories"
        :key="cat"
        :class="[
          'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
          activeCategory === cat
            ? 'bg-primary text-white'
            : 'bg-white border border-border text-muted-foreground hover:bg-muted',
        ]"
        @click="onCategoryClick(cat)"
      >
        {{ cat }}
      </button>
    </div>
    <div class="flex items-center gap-2">
      <ElInput
        :model-value="keyword"
        :placeholder="'搜索Agent...'"
        :prefix-icon="Search"
        class="w-48"
        @input="onSearchInput"
      />
      <ElSelect
        :model-value="sortKey"
        class="w-32"
        @change="onSortChange"
      >
        <ElOption
          v-for="opt in sortOptions"
          :key="opt.value"
          :label="opt.label"
          :value="opt.value"
        />
      </ElSelect>
    </div>
  </div>
</template>
