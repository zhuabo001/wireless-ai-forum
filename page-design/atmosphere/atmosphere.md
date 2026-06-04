# atmosphere.html Vue 工程化转换方案

## 转换目标

- 将 `atmosphere.html` 转换为 Vue 页面组件，保持“氛围建设”当前视觉。
- 保留发布活动按钮、年度活动主卡、近期安排、活动列表、年度荣誉、会议纪要、参与入口等区域。
- 活动、日程、荣誉、会议纪要、入口链接全部抽为结构化数据。
- 原页面只做工程化拆分，不改变内容层级和视觉表达。

## 推荐文件结构

- `src/pages/AtmospherePage.vue`：氛围建设页面入口。
- `src/data/pageDesign/atmosphere.ts`：活动、日程、荣誉、纪要、入口链接。
- `src/types/pageDesign/atmosphere.ts`：活动、日程、荣誉、会议纪要类型。
- `src/components/page-design/atmosphere/FeaturedActivity.vue`：年度活动主卡。
- `src/components/page-design/atmosphere/UpcomingSchedule.vue`：近期安排。
- `src/components/page-design/atmosphere/ActivityToolbar.vue`：筛选或活动站点按钮。
- `src/components/page-design/atmosphere/ActivityList.vue`：活动列表。
- `src/components/page-design/atmosphere/ActivityCard.vue`：活动卡片。
- `src/components/page-design/atmosphere/AtmosphereSidebar.vue`：右侧栏容器。
- `src/components/page-design/atmosphere/HonorBoard.vue`：年度荣誉。
- `src/components/page-design/atmosphere/MeetingNotes.vue`：会议纪要。
- `src/components/page-design/atmosphere/ParticipationEntry.vue`：参与入口。

## 结构化数据

建议包括：

- `pageMeta`：标题、描述、发布活动按钮。
- `featuredActivity`：年度活动标题、摘要、日期、地点、状态、图片/图标。
- `upcomingSchedules`：日期、时间、标题、地点、状态。
- `activityItems`：标题、摘要、日期、地点、参与人数、标签、外链。
- `sidebar.honors`：荣誉名称、获奖团队/个人、年份、说明。
- `sidebar.meetingNotes`：纪要标题、日期、摘要、链接。
- `sidebar.participationLinks`：入口名称、说明、图标、链接。

## Element Plus 替换点

- 发布活动、活动站点、查看详情按钮可用 `ElButton`。
- 活动状态和标签可用 `ElTag`。
- 若后续需要日历视图，可使用 `ElCalendar`，但当前 HTML 不是完整日历，不应强行替换。
- 参与入口如果需要 tooltip，可用 `ElTooltip`。

## 不建议替换的区域

- 年度活动主卡不建议用 `ElCard`，原页面的图片/渐变/状态布局更依赖自定义结构。
- 近期安排不建议用 `ElTimeline`，除非能完全覆盖为当前小型列表视觉；默认 timeline 会改变设计语言。
- 右侧栏卡片保持原 div 结构即可。

## TypeScript 逻辑

- `selectedActivityType` 或 `activeTab` 管理活动筛选。
- `filteredActivities` 使用 `computed`。
- 发布活动、活动站点、查看详情通过 emit 或 router link 打桩。
- 日期和地点信息保持字段化，避免拼接在 template 里。

## 验收标准

- 主活动卡、近期安排和右侧栏位置与原 HTML 一致。
- 活动/荣誉/纪要/入口内容全部来自数据文件。
- 无 CDN 和内联脚本。
- 交互状态由 Vue/TypeScript 管理。

