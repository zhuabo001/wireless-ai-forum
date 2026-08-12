import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  base: './',
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue'],
      // ElementPlusResolver 让 ElMessage 等 JS API 自动导入，并附带对应样式
      resolvers: [ElementPlusResolver()],
      dts: true,
      eslintrc: {
        enabled: true
      }
    }),
    // 模板中的 <el-*> 组件与 src/components 本地组件自动按需导入，
    // Element Plus 组件样式随组件逐一带入，无需全量 index.css
    Components({
      dirs: ['src/components'],
      resolvers: [ElementPlusResolver()],
      dts: true
    }),
    // vditor 运行时资源（lute/i18n/icons/hljs/mermaid）由其自身在运行时按 cdn 基址
    // 动态加载，不走模块打包；这里构建期从 node_modules 拷贝到 dist/vditor，
    // dev 模式由插件中间件直接提供，资源版本随 package.json 锁定，无需 vendored 入库
    viteStaticCopy({
      targets: [{
        src: 'node_modules/vditor/dist/{js,css}/**/*',
        dest: 'vditor/dist',
        // 剥离 node_modules/vditor/dist 三层前缀，保留 js/ css/ 结构
        rename: { stripBase: 3 },
      }],
    })
  ],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  build: {
    modulePreload: {
      resolveDependencies: (_url: string, deps: string[], { hostType }: { hostType: 'html' | 'js' }) => {
        if (hostType === 'html') {
          // 入口 HTML 预加载：排除非首页专用的 vendor chunk
          // vendor-mermaid/katex/wangeditor/md-editor 仅特定子页面使用，首页无需预加载
          return deps.filter(d => {
            if (/vendor-(mermaid|katex|wangeditor|md-editor)/.test(d)) return false
            return true
          })
        }
        // 动态 import（其他页面）：只预加载 CSS，JS 用到时才拉取
        return deps.filter(d => d.endsWith('.css'))
      },
    },
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            // Vite 运行时助手（__vitePreload 等虚拟模块，路径不含 node_modules）。
            // 必须固定到独立小 chunk：否则会被并入某个 vendor 大 chunk，
            // 任何动态 import 都静态依赖该 chunk（曾导致全站加载 3MB vendor-mermaid）
            { name: 'vite-runtime', test: /vite\/preload-helper/, priority: 100 },
            // 框架核心（所有页面共用，最高优先级）
            { name: 'vendor-vue', test: /node_modules[\\/](vue|vue-router|@vue|pinia|@vueuse)/, priority: 60 },
            // UI 组件库
            { name: 'vendor-element-plus', test: /node_modules[\\/](element-plus|@element-plus)/, priority: 50 },
            // 图表渲染（仅论坛详情页使用，Rolldown 自动包含其子依赖 cytoscape/dagre/d3）
            { name: 'vendor-mermaid', test: /node_modules[\\/]mermaid/, priority: 50 },
            { name: 'vendor-katex', test: /node_modules[\\/]katex/, priority: 50 },
            // 富文本编辑器（仅论坛发帖页与帖子详情评论使用）
            { name: 'vendor-wangeditor', test: /node_modules[\\/]@wangeditor/, priority: 50 },
            // 图标库
            { name: 'vendor-lucide', test: /node_modules[\\/]lucide-vue-next/, priority: 40 },
            // vditor Markdown 编辑器（仅发帖页挂载时动态加载；不分组会混入 vendor-common 被静态加载）
            { name: 'vendor-vditor', test: /node_modules[\\/]vditor/, priority: 50 },
            // 其余 node_modules 传递依赖（minSize=20KB 避免碎片化）
            { name: 'vendor-common', test: /node_modules/, priority: 20, minSize: 20000 },
          ],
        },
      },
    },
  },
})
