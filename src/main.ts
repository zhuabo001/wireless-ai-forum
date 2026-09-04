import { createApp } from 'vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import App from './App.vue'
import router from './router'
import pinia from './store'
import { queryClient } from './api/queryClient'
import './assets/main.css'

// dev 环境按 VITE_ENABLE_MSW=true 启动 MSW worker，拦截 /api/* 请求返回模拟数据；
// 需在挂载前完成注册，避免首屏请求漏过拦截
async function enableMocking(): Promise<void> {
  if (!import.meta.env.DEV || import.meta.env.VITE_ENABLE_MSW !== 'true') return
  const { worker } = await import('./mocks/browser')
  await worker.start({ onUnhandledRequest: 'bypass' })
}

async function bootstrap(): Promise<void> {
  await enableMocking()

  const app = createApp(App)
  app.use(router)
  await router.isReady()
  app.use(pinia)
  app.use(VueQueryPlugin, { queryClient })
  app.mount('#app')
}

void bootstrap()
