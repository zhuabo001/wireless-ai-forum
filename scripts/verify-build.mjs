import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const manifestPath = new URL('../dist/.vite/manifest.json', import.meta.url)
const indexPath = new URL('../dist/index.html', import.meta.url)

const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
const indexHtml = await readFile(indexPath, 'utf8')

function staticClosure(entryKey) {
  const visited = new Set()
  const pending = [entryKey]

  while (pending.length > 0) {
    const key = pending.pop()
    if (!key || visited.has(key)) continue

    visited.add(key)
    pending.push(...(manifest[key]?.imports ?? []))
  }

  return visited
}

function namesOf(keys) {
  return new Set([...keys].map(key => manifest[key]?.name).filter(Boolean))
}

function assertNotStaticallyLoaded(entryKey, forbiddenNames) {
  const loadedNames = namesOf(staticClosure(entryKey))

  for (const name of forbiddenNames) {
    assert(!loadedNames.has(name), `${entryKey} must not statically load ${name}`)
  }
}

function assertDynamicallyLoads(entryKey, expectedName) {
  // 共享组件（如 PostContent、CommentItem）会被打进公共 chunk，
  // 动态导入边随代码移动，因此沿入口的静态闭包收集全部动态边，
  // 只要求「页面可懒加载到该 vendor」，不绑定具体 chunk 布局
  const dynamicNames = new Set()
  for (const key of staticClosure(entryKey)) {
    for (const name of namesOf(manifest[key]?.dynamicImports ?? [])) {
      dynamicNames.add(name)
    }
  }
  assert(dynamicNames.has(expectedName), `${entryKey} must dynamically load ${expectedName}`)
}

const homeEntry = 'index.html'
const postDetailEntry = 'src/pages/forum-post-detail/Index.vue'
const newTopicEntry = 'src/pages/forum-new-topic/Index.vue'
const challengeListEntry = 'src/pages/challenges/Index.vue'
const challengeNewEntry = 'src/pages/challenge-new/Index.vue'
const challengeDetailEntry = 'src/pages/challenge-detail/Index.vue'

assertNotStaticallyLoaded(homeEntry, ['vendor-mermaid', 'vendor-wangeditor', 'vendor-vditor'])
assertNotStaticallyLoaded(postDetailEntry, ['vendor-mermaid', 'vendor-wangeditor', 'vendor-vditor'])
assertNotStaticallyLoaded(newTopicEntry, ['vendor-mermaid', 'vendor-vditor'])
assertNotStaticallyLoaded(challengeListEntry, ['vendor-mermaid', 'vendor-wangeditor', 'vendor-vditor'])
assertNotStaticallyLoaded(challengeNewEntry, ['vendor-mermaid', 'vendor-vditor'])
assertNotStaticallyLoaded(challengeDetailEntry, ['vendor-mermaid', 'vendor-wangeditor', 'vendor-vditor'])

assertDynamicallyLoads(postDetailEntry, 'vendor-mermaid')
assertDynamicallyLoads(postDetailEntry, 'vendor-wangeditor')
assertDynamicallyLoads(newTopicEntry, 'vendor-vditor')
assertDynamicallyLoads(challengeDetailEntry, 'vendor-mermaid')
assertDynamicallyLoads(challengeDetailEntry, 'vendor-wangeditor')

const resourceUrls = [...indexHtml.matchAll(/(?:src|href)="([^"]+)"/g)].map(match => match[1])
assert(resourceUrls.length > 0, 'dist/index.html must reference built resources')
assert(
  resourceUrls.every(url => url.startsWith('/')),
  `built resource URLs must be root-absolute, received: ${resourceUrls.join(', ')}`,
)

console.log('Build verification passed: deep-link asset paths and lazy vendor boundaries are intact.')
