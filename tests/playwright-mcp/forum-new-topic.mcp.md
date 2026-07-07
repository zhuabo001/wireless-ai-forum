# Playwright MCP Test Cases: Forum New Topic

## Purpose

This file is written for Playwright MCP driven execution. It is not a `@playwright/test` spec. Give this file to an MCP-capable agent and ask it to execute the cases against the running Vite dev server.

Target page:

- `http://127.0.0.1:5173/forum/new-topic`

Server prerequisite:

```bash
npm run dev -- --host 127.0.0.1
```

## MCP Execution Rules

- Always navigate to the case URL before each case unless the case explicitly continues from a previous state.
- Always take a fresh snapshot after navigation, after opening an Element Plus dropdown, after switching editor modes, and after clicking submit.
- Prefer accessible names, visible text, and placeholders over generated class names.
- Do not reuse stale MCP element references after navigation or major DOM changes.
- Treat Element Plus message text as the assertion target for validation and success cases.
- If an editor cannot be filled through an accessible editable region, use the latest snapshot to locate the visible editable area inside the editor wrapper.

## Useful Page Targets

The current implementation does not yet define `data-testid` attributes. Use these visible anchors when driving the page:

| UI Area | Preferred MCP Target |
|---|---|
| Page title | heading/text `发起新话题` |
| Title input | placeholder `用一句话清晰描述你的问题或分享内容` |
| Summary textarea | placeholder `用几句话概括帖子核心内容，帮助他人快速了解` |
| Category select | placeholder/text `请选择领域` |
| Category options | visible options `求助`, `分享`, `实践`, `讨论` |
| Preset tag select | placeholder/text `选择预设标签` |
| Custom tag input | placeholder `或手动输入标签后回车添加` |
| Cover upload | visible text `点击或拖拽上传封面` |
| Rich editor | placeholder/text `在这里详细描述你的问题、经验或想法...` |
| Markdown mode button | button text `Markdown` |
| Markdown editor | placeholder/text `使用 Markdown 编写你的内容...` |
| Cancel action | link text `取消` |
| Submit action | button text `发布话题` |

## Case 1: Initial Render

URL:

- `/forum/new-topic`

Steps:

1. Navigate to `http://127.0.0.1:5173/forum/new-topic`.
2. Take a snapshot.
3. Verify the page shows heading `发起新话题`.
4. Verify the title input placeholder `用一句话清晰描述你的问题或分享内容` is visible.
5. Verify the summary placeholder `用几句话概括帖子核心内容，帮助他人快速了解` is visible.
6. Verify the category placeholder `请选择领域` is visible.
7. Verify the preset tag placeholder `选择预设标签` is visible.
8. Verify the cover upload text `点击或拖拽上传封面` is visible.
9. Verify the rich text editor is the default editor by locating text or placeholder `在这里详细描述你的问题、经验或想法...`.
10. Verify the `取消` link and `发布话题` button are visible.

Expected result:

- The complete new topic form is visible.
- The default editor mode is rich text.
- No validation message is visible before submit.

## Case 2: Required Field Validation Order

URL:

- `/forum/new-topic`

Steps:

1. Navigate to `http://127.0.0.1:5173/forum/new-topic`.
2. Take a snapshot.
3. Click `发布话题`.
4. Take a snapshot.
5. Verify warning text `请输入帖子标题`.
6. Fill the title input with `无线 AI 训练经验分享`.
7. Click `发布话题`.
8. Take a snapshot.
9. Verify warning text `请选择话题领域`.
10. Open the category select `请选择领域`.
11. Take a snapshot.
12. Click option `分享`.
13. Take a snapshot.
14. Click `发布话题`.
15. Take a snapshot.
16. Verify warning text `请输入正文内容`.

Expected result:

- Empty form validates title first.
- A form with title but no category validates category second.
- A form with title and category but empty current editor validates body content third.

## Case 3: Rich Text Publish Success Path

URL:

- `/forum/new-topic`

Steps:

1. Navigate to `http://127.0.0.1:5173/forum/new-topic`.
2. Take a snapshot.
3. Fill title input `用一句话清晰描述你的问题或分享内容` with `无线 AI 训练经验分享`.
4. Open category select `请选择领域`.
5. Take a snapshot.
6. Click option `分享`.
7. Take a snapshot.
8. Fill the rich text editor with `这里是完整的富文本正文内容。`.
9. Click `发布话题`.
10. Take a snapshot.
11. Wait for success text `话题发布成功`.

Expected result:

- The page shows `话题发布成功`.
- The submit button enters loading state briefly and then returns to normal.

Notes:

- If MCP cannot directly fill the rich editor by placeholder, locate the contenteditable region under the visible rich editor area in the latest snapshot.

## Case 4: Markdown Publish Success Path

URL:

- `/forum/new-topic`

Steps:

1. Navigate to `http://127.0.0.1:5173/forum/new-topic`.
2. Take a snapshot.
3. Fill title input `用一句话清晰描述你的问题或分享内容` with `Markdown 发帖测试`.
4. Open category select `请选择领域`.
5. Take a snapshot.
6. Click option `实践`.
7. Take a snapshot.
8. Click the `Markdown` editor mode button.
9. Take a snapshot.
10. Verify the Markdown editor placeholder `使用 Markdown 编写你的内容...` is visible.
11. Fill the Markdown editor with:

```markdown
## 测试标题

这里是 Markdown 正文内容。
```

12. Click `发布话题`.
13. Take a snapshot.
14. Wait for success text `话题发布成功`.

Expected result:

- The page switches from rich text editor to Markdown editor.
- The page shows `话题发布成功` after submitting valid Markdown content.

## Case 5: Preset And Custom Tag Interaction

URL:

- `/forum/new-topic`

Steps:

1. Navigate to `http://127.0.0.1:5173/forum/new-topic`.
2. Take a snapshot.
3. Open preset tag select `选择预设标签`.
4. Take a snapshot.
5. Click option `工具FAQ`.
6. Take a snapshot.
7. Verify tag text `工具FAQ` is visible in the selected tag area.
8. Fill custom tag input `或手动输入标签后回车添加` with `模型评测`.
9. Press `Enter`.
10. Take a snapshot.
11. Verify tag text `模型评测` is visible.
12. Fill custom tag input with `模型评测`.
13. Press `Enter`.
14. Take a snapshot.
15. Verify there is still only one visible selected tag named `模型评测`.

Expected result:

- Preset tag selection adds a tag.
- Manual Enter adds a custom tag.
- Duplicate tags are ignored.

Notes:

- If exact duplicate counting is hard with MCP output, record the visible selected tags from the snapshot and confirm `模型评测` does not appear twice in the selected tag group.

## Case 6: Tag Limit

URL:

- `/forum/new-topic`

Steps:

1. Navigate to `http://127.0.0.1:5173/forum/new-topic`.
2. Take a snapshot.
3. Add custom tags by filling `或手动输入标签后回车添加` and pressing `Enter` for each value:
   - `标签一`
   - `标签二`
   - `标签三`
   - `标签四`
   - `标签五`
   - `标签六`
4. Take a snapshot.
5. Verify selected tags include `标签一` through `标签五`.
6. Verify `标签六` is not added as a selected tag.

Expected result:

- The component keeps at most 5 tags.
- The sixth tag is ignored.

## Case 7: Source Route From Toolbox

URL:

- `/forum/new-topic?from=toolbox`

Steps:

1. Navigate to `http://127.0.0.1:5173/forum/new-topic?from=toolbox`.
2. Take a snapshot.
3. Verify breadcrumb/source text `百宝箱` is visible.
4. Click `取消`.
5. Take a snapshot after navigation.
6. Verify current URL ends with `/toolbox`.

Expected result:

- The source label is `百宝箱`.
- Cancel returns to `/toolbox`.

## Case 8: Source Route From Practices

URL:

- `/forum/new-topic?from=practices`

Steps:

1. Navigate to `http://127.0.0.1:5173/forum/new-topic?from=practices`.
2. Take a snapshot.
3. Verify breadcrumb/source text `优秀实践` is visible.
4. Click `取消`.
5. Take a snapshot after navigation.
6. Verify current URL ends with `/practices`.

Expected result:

- The source label is `优秀实践`.
- Cancel returns to `/practices`.

## Case 9: Default Source Route

URL:

- `/forum/new-topic`

Steps:

1. Navigate to `http://127.0.0.1:5173/forum/new-topic`.
2. Take a snapshot.
3. Verify breadcrumb/source text `AI论坛` is visible.
4. Click `取消`.
5. Take a snapshot after navigation.
6. Verify current URL ends with `/forum`.

Expected result:

- Missing `from` defaults to forum.
- Cancel returns to `/forum`.

## Case 10: Cover Upload Validation

URL:

- `/forum/new-topic`

Steps:

1. Navigate to `http://127.0.0.1:5173/forum/new-topic`.
2. Take a snapshot.
3. Locate the cover upload area with text `点击或拖拽上传封面`.
4. Upload a small valid PNG or JPG file.
5. Take a snapshot.
6. Verify image alt text `封面预览` is visible.
7. Click `删除图片`.
8. Take a snapshot.
9. Verify upload placeholder `点击或拖拽上传封面` is visible again.
10. Upload a non-image file.
11. Take a snapshot.
12. Verify warning text `请上传图片文件`.

Expected result:

- Valid image upload shows preview.
- Delete removes preview.
- Non-image upload is rejected with a warning.

Notes:

- Use MCP file upload support if available. If the MCP client cannot upload files, mark this case as blocked by tool capability rather than failed product behavior.

## Case 11: Duplicate Submit Guard

URL:

- `/forum/new-topic`

Steps:

1. Navigate to `http://127.0.0.1:5173/forum/new-topic`.
2. Take a snapshot.
3. Fill title input with `重复提交保护测试`.
4. Select category `分享`.
5. Fill the rich text editor with `这是一段用于验证重复提交保护的正文。`.
6. Click `发布话题` twice quickly.
7. Take a snapshot.
8. Wait for success text `话题发布成功`.
9. Check whether only one success message is produced.

Expected result:

- Ideally only one submit is accepted while loading.

Known risk:

- The current `handleSubmit` implementation sets `isSubmitting=true`, but does not return early when `isSubmitting` is already true. If this case shows duplicate success messages, record it as a product bug and not as an MCP execution issue.

## Suggested MCP Report Format

For each case, report:

- Case ID and title
- Status: `PASS`, `FAIL`, or `BLOCKED`
- Final URL
- Key assertion evidence from snapshot
- Screenshot path if captured
- Notes about selector ambiguity or MCP tool limitations
