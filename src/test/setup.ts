import { beforeAll, afterEach, afterAll } from 'vitest'
import { server } from './server'

// node 测试环境无 window/location：
// - src/api/http.ts 用 window.location.origin 拼接绝对 URL
// - msw 内部用裸标识符 location（浏览器中等价于 window.location）把相对路径的
//   handler path 归一化为绝对 URL 再匹配请求；node 下 globalThis.window 只是普通对象，
//   裸 location 不会解析到它，必须单独 stub globalThis.location
const stubLocation = { origin: 'http://localhost:5173', href: 'http://localhost:5173/' }
;(globalThis as { window?: unknown }).window = { location: stubLocation }
;(globalThis as { location?: unknown }).location = stubLocation

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})

afterEach(() => {
  server.resetHandlers()
  server.events.removeAllListeners()
})

afterAll(() => {
  server.close()
})
