import { defineConfig } from 'vitest/config'
import { fileURLToPath, URL } from 'node:url'

// 独立于 vite.config.ts：Vite 8 的 rolldownOptions 不适用于测试管线，
// 这里保持零插件、node 环境，规避 vitest × rolldown-Vite 8 的兼容风险。
export default defineConfig({
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  test: {
    environment: 'node',
    globals: false,
    setupFiles: ['src/test/setup.ts'],
    include: ['src/**/*.spec.ts'],
  },
})
