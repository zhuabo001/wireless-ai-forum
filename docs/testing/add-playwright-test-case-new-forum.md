# 发帖页 Playwright 测试用例添加计划

## Context

目标页面是发帖页 `/forum/new-topic`，页面入口在 `src/pages/forum-new-topic/Index.vue`。该页面包含标题、摘要、话题领域、标签、封面上传、富文本/Markdown 编辑器切换，以及发布/取消操作。

当前项目尚未配置 `@playwright/test`，`package.json` 里只有 `dev`、`build`、`preview` 脚本。因此测试方案需要区分两类用途：

- 可回归测试：新增 Playwright Test 配置和 `tests/e2e/forum-new-topic.spec.ts`
- 交互式调试：使用 `playwright-cli` 或 MCP 打开页面、截图、定位元素、复现测试步骤

## 推荐测试场景

### 1. 初始渲染

覆盖页面最基础的可用性：

- 访问 `/forum/new-topic`
- 看到页面标题“发起新话题”
- 看到标题、内容概述、话题领域、标签、封面图片、正文内容区域
- 看到“取消”和“发布话题”按钮
- 默认编辑器模式为“富文本”

### 2. 必填校验

按真实提交顺序覆盖表单校验：

- 空表单点击“发布话题”，提示“请输入帖子标题”
- 填写标题后提交，提示“请选择话题领域”
- 填写标题和话题领域后提交，提示“请输入正文内容”

### 3. 富文本发布主路径

覆盖默认编辑模式下的成功路径：

- 填写标题
- 选择话题领域
- 在富文本编辑器输入正文
- 点击“发布话题”
- 等待并断言出现“话题发布成功”

### 4. Markdown 发布主路径

覆盖编辑器切换后的成功路径：

- 切换到 Markdown 模式
- 输入 Markdown 正文
- 填写标题和话题领域
- 点击“发布话题”
- 等待并断言出现“话题发布成功”

### 5. 标签交互

覆盖标签组件的核心边界：

- 从预设标签下拉中选择标签
- 手动输入标签并按 Enter 添加
- 重复标签不会重复出现
- 最多只能添加 5 个标签
- 标签可关闭删除

### 6. 封面上传

覆盖上传组件的主要路径：

- 上传合法图片后出现“封面预览”
- 点击“删除图片”后预览消失
- 上传非图片文件提示“请上传图片文件”
- 上传超过 5MB 的图片提示“图片大小不能超过 5MB”

### 7. 来源路由

覆盖 `?from=` 参数决定返回链接的逻辑：

- `/forum/new-topic?from=toolbox` 的面包屑来源显示“百宝箱”，取消后回到 `/toolbox`
- `/forum/new-topic?from=practices` 的面包屑来源显示“优秀实践”，取消后回到 `/practices`
- `/forum/new-topic?from=forum` 的面包屑来源显示“AI论坛”，取消后回到 `/forum`
- 直接访问 `/forum/new-topic` 时默认返回 `/forum`

### 8. 重复提交保护

当前 `handleSubmit` 会设置 `isSubmitting=true`，但函数开头没有 `if (isSubmitting.value) return`。建议添加测试暴露这个边界：

- 填写合法表单
- 快速连续点击“发布话题”
- 期望只触发一次提交状态和一次成功提示

如果该用例失败，说明页面需要在 `handleSubmit` 开头增加重复提交保护。

## 稳定选择器建议

当前页面部分控件不适合直接写稳定 E2E：

- 原生标题/摘要控件没有 `id` 和 `for`
- Element Plus 下拉的真实 DOM 结构较深
- wangEditor 和 md-editor-v3 的 DOM 由第三方库生成，版本变化会影响选择器

建议先为关键交互点补充 `data-testid`：

| 文件 | 建议选择器 |
|---|---|
| `TopicTitleField.vue` | `data-testid="topic-title"` |
| `TopicSummaryField.vue` | `data-testid="topic-summary"` |
| `TopicCategorySelect.vue` | `data-testid="topic-category"` |
| `TopicTagPicker.vue` | `data-testid="preset-tag-select"`、`data-testid="custom-tag-input"` |
| `CoverUploader.vue` | `data-testid="cover-uploader"` |
| `RichTextEditor.vue` | 外层 `data-testid="rich-editor"` |
| `MarkdownEditor.vue` | 外层 `data-testid="markdown-editor"` |
| `PublishActions.vue` | `data-testid="cancel-topic"`、`data-testid="submit-topic"` |

示例：

```vue
<input
  data-testid="topic-title"
  type="text"
  :value="modelValue"
  :maxlength="maxLength"
/>
```

```vue
<div data-testid="rich-editor" class="bg-white border border-border rounded-xl overflow-hidden">
  <Toolbar ... />
  <Editor ... />
</div>
```

## 推荐测试文件

建议新增：

- `playwright.config.ts`
- `tests/e2e/forum-new-topic.spec.ts`

### playwright.config.ts

仓库历史里 Vite dev server 在 IPv6 `localhost` 上出现过绑定问题，因此建议固定使用 IPv4 `127.0.0.1`。

```ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: 'tests/e2e',
  use: {
    baseURL: 'http://127.0.0.1:5173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1',
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: true,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
})
```

### tests/e2e/forum-new-topic.spec.ts

```ts
import { expect, test, type Page } from '@playwright/test'

async function chooseCategory(page: Page, name = '分享'): Promise<void> {
  await page.getByTestId('topic-category').click()
  await page.getByRole('option', { name }).click()
}

async function fillRichContent(page: Page, text: string): Promise<void> {
  await page.getByTestId('rich-editor').locator('[data-slate-editor]').fill(text)
}

async function fillMarkdownContent(page: Page, text: string): Promise<void> {
  await page.getByRole('button', { name: 'Markdown' }).click()
  await page.getByTestId('markdown-editor').locator('textarea').fill(text)
}

test.describe('发帖页', () => {
  test('初始渲染默认表单', async ({ page }) => {
    await page.goto('/forum/new-topic')

    await expect(page.getByRole('heading', { name: '发起新话题' })).toBeVisible()
    await expect(page.getByTestId('topic-title')).toBeVisible()
    await expect(page.getByTestId('topic-summary')).toBeVisible()
    await expect(page.getByTestId('topic-category')).toBeVisible()
    await expect(page.getByTestId('rich-editor')).toBeVisible()
    await expect(page.getByRole('button', { name: '富文本' })).toHaveClass(/bg-primary/)
    await expect(page.getByTestId('submit-topic')).toBeVisible()
  })

  test('按顺序提示必填校验', async ({ page }) => {
    await page.goto('/forum/new-topic')

    await page.getByTestId('submit-topic').click()
    await expect(page.getByText('请输入帖子标题')).toBeVisible()

    await page.getByTestId('topic-title').fill('无线 AI 训练经验分享')
    await page.getByTestId('submit-topic').click()
    await expect(page.getByText('请选择话题领域')).toBeVisible()

    await chooseCategory(page)
    await page.getByTestId('submit-topic').click()
    await expect(page.getByText('请输入正文内容')).toBeVisible()
  })

  test('可以用富文本发布话题', async ({ page }) => {
    await page.goto('/forum/new-topic')

    await page.getByTestId('topic-title').fill('无线 AI 训练经验分享')
    await chooseCategory(page)
    await fillRichContent(page, '这里是完整的富文本正文内容。')

    await page.getByTestId('submit-topic').click()
    await expect(page.getByText('话题发布成功')).toBeVisible({ timeout: 3000 })
  })

  test('可以切换 Markdown 并发布话题', async ({ page }) => {
    await page.goto('/forum/new-topic')

    await page.getByTestId('topic-title').fill('Markdown 发帖测试')
    await chooseCategory(page, '实践')
    await fillMarkdownContent(page, '## 标题\n\n正文内容')

    await page.getByTestId('submit-topic').click()
    await expect(page.getByText('话题发布成功')).toBeVisible({ timeout: 3000 })
  })

  test('可以添加和删除标签', async ({ page }) => {
    await page.goto('/forum/new-topic')

    await page.getByTestId('preset-tag-select').click()
    await page.getByRole('option', { name: '工具FAQ' }).click()
    await expect(page.getByText('工具FAQ')).toBeVisible()

    await page.getByTestId('custom-tag-input').fill('模型评测')
    await page.getByTestId('custom-tag-input').press('Enter')
    await expect(page.getByText('模型评测')).toBeVisible()

    await page.getByRole('button', { name: /close/i }).first().click()
    await expect(page.getByText('工具FAQ')).not.toBeVisible()
  })

  test('来源参数决定取消返回地址', async ({ page }) => {
    await page.goto('/forum/new-topic?from=toolbox')

    await expect(page.getByText('百宝箱')).toBeVisible()
    await page.getByTestId('cancel-topic').click()
    await expect(page).toHaveURL(/\/toolbox$/)
  })
})
```

## 依赖和脚本建议

需要新增开发依赖：

```bash
npm install -D @playwright/test
npx playwright install chromium
```

建议新增 `package.json` 脚本：

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

运行单个测试文件：

```bash
npx playwright test tests/e2e/forum-new-topic.spec.ts --project=chromium
```

## playwright-cli 的用法

`playwright-cli` 更适合交互式调试，不适合直接运行 `tests/e2e/forum-new-topic.spec.ts`。它的定位是：

- 打开页面
- snapshot 获取元素引用
- 按步骤点击和填写
- 复现失败场景
- 截图或录制 trace 辅助定位

使用前确认 `npx` 可用：

```bash
command -v npx >/dev/null 2>&1
```

使用仓库本地 dev server 和 Playwright CLI wrapper：

```bash
export CODEX_HOME="${CODEX_HOME:-$HOME/.codex}"
export PWCLI="$CODEX_HOME/skills/playwright/scripts/playwright_cli.sh"

npm run dev -- --host 127.0.0.1
"$PWCLI" open http://127.0.0.1:5173/forum/new-topic --headed
"$PWCLI" snapshot
"$PWCLI" fill eX "无线 AI 训练经验分享"
"$PWCLI" click eY
"$PWCLI" snapshot
```

其中 `eX`、`eY` 必须来自最新一次 `snapshot`，不能提前硬写。页面导航、打开下拉、切换编辑器、弹出提示之后都应重新 snapshot。

## MCP 的用法

Playwright MCP 或浏览器 MCP 同样更适合调试和定位，而不是替代 Playwright Test spec。

建议使用方式：

1. 通过 MCP 打开 `http://127.0.0.1:5173/forum/new-topic`
2. 获取页面 snapshot
3. 复现 `forum-new-topic.spec.ts` 中的关键步骤
4. 用 MCP 观察真实 DOM、toast、下拉弹层、编辑器输入区域
5. 将稳定选择器和断言沉淀回 `tests/e2e/forum-new-topic.spec.ts`
6. 最终仍用 Playwright Test runner 执行回归：

```bash
npx playwright test tests/e2e/forum-new-topic.spec.ts --project=chromium
```

## 实施顺序

1. 为发帖页组件补充 `data-testid`
2. 新增 `playwright.config.ts`
3. 新增 `tests/e2e/forum-new-topic.spec.ts`
4. 安装 `@playwright/test` 和 Chromium 浏览器
5. 运行 `npx playwright test tests/e2e/forum-new-topic.spec.ts --project=chromium`
6. 根据失败结果修正选择器、等待条件或页面交互边界
7. 将稳定用例纳入 CI 或至少纳入本地回归脚本 `npm run test:e2e`

## 风险和注意事项

- 不要直接依赖 Element Plus 自动生成的深层 class 名称，升级后容易失效
- 不要把 wangEditor/md-editor-v3 的内部 DOM 当作业务契约，尽量通过外层 `data-testid` 缩小选择器范围
- `ElMessage` 是浮层提示，断言时应使用页面文本或 toast 容器，不要依赖出现位置
- 上传测试需要构造临时测试文件，建议放在 Playwright test 的 `setInputFiles` 内存 payload 或 `tests/fixtures`
- 当前页面提交只是 `setTimeout` 模拟 API，测试应断言 UI 行为，不应假设真实后端请求
- 重复提交测试可能会暴露当前实现缺少防重保护，这是有价值的失败
