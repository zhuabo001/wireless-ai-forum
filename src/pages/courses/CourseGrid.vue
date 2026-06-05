<script setup lang="ts">
import type { CourseItem } from '@/types/pageDesign/courses'
import CourseCard from './CourseCard.vue'

defineProps<{
  courses: CourseItem[]
}>()
</script>

<template>
  <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
    <CourseCard v-for="course in courses" :key="course.id" :course="course" />
  </div>
</template>
