import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
  {
    path: '/market',
    name: 'market',
    component: () => import('@/pages/market/Index.vue'),
  },
  {
    path: '/practices',
    name: 'practices',
    component: () => import('@/pages/practices/Index.vue'),
  },
  {
    path: '/intelligence',
    name: 'intelligence',
    component: () => import('@/pages/intelligence/Index.vue'),
  },
  {
    path: '/toolbox',
    name: 'toolbox',
    component: () => import('@/pages/toolbox/Index.vue'),
  },
  {
    path: '/courses',
    name: 'courses',
    component: () => import('@/pages/courses/Index.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    return { top: 0 }
  },
})

export default router
