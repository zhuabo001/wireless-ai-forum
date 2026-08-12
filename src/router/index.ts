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
  {
    path: '/forum',
    name: 'forum',
    component: () => import('@/pages/forum/Index.vue'),
  },
  {
    path: '/forum/new-topic',
    name: 'forum-new-topic',
    component: () => import('@/pages/forum-new-topic/Index.vue'),
  },
  {
    path: '/forum/post/:id',
    name: 'forum-post-detail',
    component: () => import('@/pages/forum-post-detail/Index.vue'),
  },
]

const router = createRouter({
  // 与 Vite 的 base 保持一致；当前为根路径，也为将来显式子路径部署保留单一配置源。
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    return { top: 0 }
  },
})

export default router
