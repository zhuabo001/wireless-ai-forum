/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** dev 环境是否启用 MSW 模拟接口（'true' 开启，其余值关闭） */
  readonly VITE_ENABLE_MSW?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
