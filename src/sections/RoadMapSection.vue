<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ComputedRef } from 'vue'
import SectionHeader from '../components/layout/SectionHeader.vue'
import RoadMapCard from '../components/ui/RoadMapCard.vue'
import { roadmapItems } from '../data/home'
import type { RoadmapItem } from '../types/home'

const items: RoadmapItem[] = roadmapItems
const hoveredMonth = ref<string | null>(null)

const hasHover: ComputedRef<boolean> = computed(() => hoveredMonth.value !== null)

const handleEnter = (month: string): void => {
  hoveredMonth.value = month
}

const handleLeave = (): void => {
  hoveredMonth.value = null
}
</script>

<template>
  <div class="section-roadmap py-16 relative flex-1 overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeader
        title="产品路线图"
        description="社区能力演进时间线 — 回顾已交付功能，跟踪当前迭代进展"
      />

      <div class="roadmap-board" @mouseleave="handleLeave">
        <div class="roadmap-timeline" :aria-hidden="true">
          <div class="roadmap-timeline__track" />
          <div
            v-for="item in items"
            :key="`node-${item.month}`"
            :class="[
              'roadmap-timeline__node',
              item.status === 'in-progress' ? 'roadmap-timeline__node--current' : '',
              hasHover && hoveredMonth !== item.month ? 'roadmap-timeline__node--dimmed' : '',
              hoveredMonth === item.month ? 'roadmap-timeline__node--active' : '',
            ]"
          >
            <span class="roadmap-timeline__dot" />
            <span class="roadmap-timeline__label">{{ item.label }}</span>
          </div>
        </div>

        <div class="roadmap-grid">
          <div
            v-for="item in items"
            :key="item.month"
            class="roadmap-grid__cell"
            @mouseenter="handleEnter(item.month)"
          >
            <RoadMapCard
              :item="item"
              :is-active="hoveredMonth === item.month"
              :is-dimmed="hasHover && hoveredMonth !== item.month"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.section-roadmap {
  background: linear-gradient(180deg, rgba(248, 250, 252, 0.4) 0%, rgba(255, 255, 255, 0) 100%);
}

.roadmap-board {
  position: relative;
}

.roadmap-timeline {
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.25rem;
  padding: 0 1rem;

  &__track {
    position: absolute;
    left: calc(12.5% + 0.5rem);
    right: calc(12.5% + 0.5rem);
    top: 0.5rem;
    height: 2px;
    background: linear-gradient(
      90deg,
      rgba(148, 163, 184, 0.25) 0%,
      rgba(148, 163, 184, 0.25) 70%,
      rgba(59, 130, 246, 0.4) 100%
    );
    border-radius: 2px;
  }

  &__node {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    transition: opacity 0.3s ease, transform 0.3s ease;
  }

  &__dot {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #fff;
    border: 2px solid rgb(148 163 184);
    box-shadow: 0 0 0 4px rgba(148, 163, 184, 0.12);
    transition: all 0.3s ease;
    z-index: 1;
  }

  &__label {
    font-size: 0.75rem;
    font-weight: 600;
    color: rgb(100 116 139);
    letter-spacing: 0.04em;
    transition: color 0.3s ease;
  }

  &__node--current &__dot {
    background: var(--color-primary, #3b82f6);
    border-color: var(--color-primary, #3b82f6);
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.18);
    animation: roadmap-pulse 2s ease-in-out infinite;
  }

  &__node--current &__label {
    color: var(--color-primary, #3b82f6);
  }

  &__node--active &__dot {
    transform: scale(1.15);
    border-color: var(--color-primary, #3b82f6);
    box-shadow: 0 0 0 6px rgba(59, 130, 246, 0.18);
  }

  &__node--active &__label {
    color: var(--color-primary, #3b82f6);
  }

  &__node--dimmed {
    opacity: 0.35;
  }
}

.roadmap-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.roadmap-grid__cell {
  display: flex;
  min-height: 100%;

  > :deep(*) {
    width: 100%;
  }
}

@keyframes roadmap-pulse {
  0%, 100% {
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.18);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(59, 130, 246, 0.05);
  }
}

@media (max-width: 768px) {
  .roadmap-timeline {
    grid-template-columns: 1fr;
    gap: 0;
    padding: 0;
    margin-bottom: 0;
  }

  .roadmap-timeline__track {
    display: none;
  }

  .roadmap-timeline__node {
    display: none;
  }

  .roadmap-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
}
</style>
