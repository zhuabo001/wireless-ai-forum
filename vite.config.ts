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
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            // 框架核心（所有页面共用，最高优先级）
            { name: 'vendor-vue', test: /node_modules[\\/](vue|vue-router|@vue|pinia|@vueuse)/, priority: 60 },
            // UI 组件库
            { name: 'vendor-element-plus', test: /node_modules[\\/](element-plus|@element-plus)/, priority: 50 },
            // 图表渲染（仅论坛详情页使用，Rolldown 自动包含其子依赖 cytoscape/dagre/d3）
            { name: 'vendor-mermaid', test: /node_modules[\\/]mermaid/, priority: 50 },
            { name: 'vendor-katex', test: /node_modules[\\/]katex/, priority: 50 },
            // 富文本编辑器（仅论坛发帖页使用）
            { name: 'vendor-wangeditor', test: /node_modules[\\/]@wangeditor/, priority: 50 },
            // Markdown 编辑器
            { name: 'vendor-md-editor', test: /node_modules[\\/]md-editor-v3/, priority: 40 },
            // 动画库
            { name: 'vendor-gsap', test: /node_modules[\\/]gsap/, priority: 40 },
            // 图标库
            { name: 'vendor-lucide', test: /node_modules[\\/]lucide-vue-next/, priority: 40 },
            // 共享工具依赖（被多个包引用时避免重复打包）
            { name: 'vendor-dagre', test: /node_modules[\\/](dagre|d3-|lodash-es)/, priority: 30 },
            // 其余 node_modules 传递依赖（minSize=20KB 避免碎片化）
            { name: 'vendor-common', test: /node_modules/, priority: 20, minSize: 20000 },
          ],
        },
      },
    },
  },
})
