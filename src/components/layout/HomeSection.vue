<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, type Component } from 'vue'

const props = defineProps<{
  id: string
  component?: Component
  className?: string
  /** 懒加载占位高度（px）；缺省表示首屏区块，立即渲染 */
  minHeight?: number
}>()

// 带 minHeight 的区块为首屏以下内容：先渲染占位壳，进入视口附近再挂载真实组件，
// 避免其 JS（含 Element Plus 等依赖）进入首页关键路径
const visible = ref(props.minHeight === undefined)
const sectionRef = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

onMounted(() => {
  if (visible.value || !sectionRef.value) return
  if (!('IntersectionObserver' in window)) {
    visible.value = true
    return
  }
  // rootMargin 提前 400px 触发：组件在滚入视口前完成加载，占位高度切换发生在屏外，不产生 CLS
  observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        visible.value = true
        observer?.disconnect()
        observer = null
      }
    },
    { rootMargin: '400px 0px' },
  )
  observer.observe(sectionRef.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})
</script>

<template>
  <section
    :id="id"
    ref="sectionRef"
    :class="className"
    :style="!visible && minHeight ? { minHeight: `${minHeight}px` } : undefined"
  >
    <component :is="component" v-if="visible && component" />
    <slot v-else-if="visible" />
  </section>
</template>
