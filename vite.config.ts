import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  base: './',
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue'],
      dts: true,
      eslintrc: {
        enabled: true
      }
    })
  ],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  build: {
    modulePreload: {
      resolveDependencies: (_url: string, deps: string[], { hostType }: { hostType: 'html' | 'js' }) => {
        // 入口 HTML（首页相关）：预加载全部依赖
        if (hostType === 'html') {
          return deps
        }
        // 动态 import（其他页面）：只预加载 CSS，JS 用到时才拉取
        return deps.filter(d => d.endsWith('.css'))
      },
    },
  },
})
