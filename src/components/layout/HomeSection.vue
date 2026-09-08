<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, type Component } from 'vue'
import type { MinHeightTier } from '@/types/home'
import { resolveMinHeight } from '@/utils/minHeight'

const props = defineProps<{
  id: string
  component?: Component
  className?: string
  /** 懒加载占位高度分档（按 minWidth 降序）；缺省表示首屏区块，立即渲染 */
  minHeight?: MinHeightTier[]
}>()

// 带 minHeight 的区块为首屏以下内容：先渲染占位壳，进入视口附近再挂载真实组件，
// 避免其 JS（含 Element Plus 等依赖）进入首页关键路径
const visible = ref(props.minHeight === undefined)
const sectionRef = ref<HTMLElement | null>(null)
// 占位高度按视口宽度选档：分档值取自各宽度区间的实测渲染高度，
// 避免窄视口下占位沿用桌面值导致的大幅失配。
// 选档与跨档监听共用同一口径：Chrome 的媒体查询含滚动条宽度（实测 768 视口 clientWidth 760
// 但 `(min-width: 768px)` 为 true），与 window.innerWidth 一致，故两者不会在档位边界错档。
const viewportWidth = ref(typeof window === 'undefined' ? 0 : window.innerWidth)
const placeholderHeight = computed(() =>
  props.minHeight ? resolveMinHeight(props.minHeight, viewportWidth.value) : 0,
)
let observer: IntersectionObserver | null = null
const tierQueries: MediaQueryList[] = []

const syncViewportWidth = () => {
  viewportWidth.value = window.innerWidth
}

// 档位监听只在占位期存在：挂载后占位高度不再参与渲染
const releaseTierQueries = () => {
  for (const query of tierQueries) query.removeEventListener('change', syncViewportWidth)
  tierQueries.length = 0
}

onMounted(() => {
  if (visible.value || !sectionRef.value) return
  // matchMedia 仅在跨档位时触发，避免 resize 期间反复重算
  for (const tier of props.minHeight ?? []) {
    if (tier.minWidth <= 0) continue
    const query = window.matchMedia(`(min-width: ${tier.minWidth}px)`)
    query.addEventListener('change', syncViewportWidth)
    tierQueries.push(query)
  }
  if (!('IntersectionObserver' in window)) {
    visible.value = true
    releaseTierQueries()
    return
  }
  // rootMargin 提前 400px 触发：组件在滚入视口前完成加载，占位高度切换发生在屏外，不产生 CLS
  observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        visible.value = true
        observer?.disconnect()
        observer = null
        releaseTierQueries()
      }
    },
    { rootMargin: '400px 0px' },
  )
  observer.observe(sectionRef.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
  releaseTierQueries()
})
</script>

<template>
  <section
    :id="id"
    ref="sectionRef"
    :class="className"
    :style="!visible && placeholderHeight ? { minHeight: `${placeholderHeight}px` } : undefined"
  >
    <component :is="component" v-if="visible && component" />
    <slot v-else-if="visible" />
  </section>
</template>
