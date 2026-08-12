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
  const dynamicNames = namesOf(manifest[entryKey]?.dynamicImports ?? [])
  assert(dynamicNames.has(expectedName), `${entryKey} must dynamically load ${expectedName}`)
}

const homeEntry = 'index.html'
const postDetailEntry = 'src/pages/forum-post-detail/Index.vue'
const newTopicEntry = 'src/pages/forum-new-topic/Index.vue'

assertNotStaticallyLoaded(homeEntry, ['vendor-mermaid', 'vendor-wangeditor', 'vendor-vditor'])
assertNotStaticallyLoaded(postDetailEntry, ['vendor-mermaid', 'vendor-wangeditor', 'vendor-vditor'])
assertNotStaticallyLoaded(newTopicEntry, ['vendor-mermaid', 'vendor-vditor'])

assertDynamicallyLoads(postDetailEntry, 'vendor-mermaid')
assertDynamicallyLoads(postDetailEntry, 'vendor-wangeditor')
assertDynamicallyLoads(newTopicEntry, 'vendor-vditor')

const resourceUrls = [...indexHtml.matchAll(/(?:src|href)="([^"]+)"/g)].map(match => match[1])
assert(resourceUrls.length > 0, 'dist/index.html must reference built resources')
assert(
  resourceUrls.every(url => url.startsWith('/')),
  `built resource URLs must be root-absolute, received: ${resourceUrls.join(', ')}`,
)

console.log('Build verification passed: deep-link asset paths and lazy vendor boundaries are intact.')
