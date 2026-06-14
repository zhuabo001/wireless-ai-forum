<script setup lang="ts">
import IconRenderer from './IconRenderer.vue'
import type { RoadmapItem } from '../../types/home'

withDefaults(defineProps<{
  item: RoadmapItem
  isActive: boolean
  isDimmed: boolean
}>(), {
  isActive: false,
  isDimmed: false,
})
</script>

<template>
  <div
    :class="[
      'roadmap-card relative rounded-xl border bg-white p-5 transition-all duration-300 h-full flex flex-col',
      isActive ? 'roadmap-card--active' : '',
      isDimmed ? 'roadmap-card--dimmed' : '',
      item.status === 'in-progress' ? 'roadmap-card--current' : 'roadmap-card--done',
    ]"
  >
    <span class="roadmap-card__bar" :aria-hidden="true" />

    <div class="flex items-center justify-between mb-3">
      <span
        :class="[
          'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium',
          item.status === 'in-progress'
            ? 'bg-primary/10 text-primary'
            : 'bg-emerald-50 text-emerald-600',
        ]"
      >
        <IconRenderer
          :name="item.status === 'in-progress' ? 'sparkles' : 'shield-check'"
          class-name="w-3 h-3"
        />
        {{ item.status === 'in-progress' ? '进行中' : '已完成' }}
      </span>
      <span class="text-xs text-muted-foreground tracking-wide">{{ item.month }}</span>
    </div>

    <h3 class="text-base font-semibold text-foreground mb-1">{{ item.title }}</h3>
    <p class="text-xs text-muted-foreground mb-4 leading-relaxed">{{ item.summary }}</p>

    <ul class="space-y-2 mb-4">
      <li
        v-for="(feature, idx) in item.features"
        :key="`feat-${idx}`"
        class="flex items-start gap-2 text-sm text-foreground/80"
      >
        <span
          :class="[
            'mt-0.5 w-5 h-5 rounded-md flex items-center justify-center shrink-0',
            item.status === 'in-progress'
              ? 'bg-primary/10 text-primary'
              : 'bg-gray-100 text-gray-500',
          ]"
        >
          <IconRenderer :name="feature.icon" class-name="w-3 h-3" />
        </span>
        <span class="leading-snug">{{ feature.text }}</span>
      </li>
    </ul>

    <div
      v-if="item.upcoming && item.upcoming.length"
      class="mt-auto pt-3 border-t border-dashed border-gray-200"
    >
      <p class="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
        <IconRenderer name="calendar" class-name="w-3 h-3" />
        近期计划
      </p>
      <ul class="space-y-1.5">
        <li
          v-for="(plan, idx) in item.upcoming"
          :key="`plan-${idx}`"
          class="flex items-start gap-2 text-xs text-muted-foreground"
        >
          <IconRenderer :name="plan.icon" class-name="w-3 h-3 mt-0.5 shrink-0" />
          <span class="leading-snug">{{ plan.text }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
.roadmap-card {
  border-color: var(--home-border, hsl(214 32% 91%));
  opacity: 1;

  &__bar {
    position: absolute;
    left: 0;
    top: 1rem;
    bottom: 1rem;
    width: 3px;
    border-radius: 2px;
    background: rgb(209 213 219);
    transition: background 0.3s ease, width 0.3s ease;
  }

  &--current &__bar {
    background: var(--home-primary, hsl(217 91% 40%));
  }

  &--done &__bar {
    background: rgb(167 243 208);
  }

  &--active {
    transform: translateY(-4px);
    box-shadow: 0 18px 30px -12px rgba(15, 23, 42, 0.18);
    border-color: var(--home-primary, hsl(217 91% 40%));
  }

  &--active &__bar {
    width: 4px;
  }

  &--dimmed {
    opacity: 0.4;
    box-shadow: none;
  }
}
</style>
