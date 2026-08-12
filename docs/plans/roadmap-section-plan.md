# 首页 RoadMap 区域开发计划

## 目标

在首页 `AgentMarketSection` 与 `Footer` 之间新增一个名为 `RoadMap` 的区域，用于展示产品能力演进时间线：前三个月展示已完成功能，当月展示进行中与未来计划，并支持鼠标悬停高亮当前卡片、置灰其他卡片的交互效果。

## 设计要点

- 位置：首页 `market` section 之后、`footer` 之前。
- 结构：顶部 `SectionHeader` 标题 + 横向时间轴 + 4 个月份卡片。
- 月份排列：当前月份（2026-06）放在最右侧，左侧依次为前三个月（2026-03、2026-04、2026-05）。
- 卡片内容：
  - 已完成月份：展示 2-3 条已交付功能。
  - 进行中月份：展示当前迭代重点 + 未来计划 1-2 条。
- 交互：鼠标悬停某张卡片时，该卡片高亮，其余卡片与时间轴节点置灰。
- 响应式：桌面端横向 4 列，移动端转为左侧竖向时间轴。

## 实施步骤

### 步骤 1：类型与数据

- 在 `src/types/home.ts` 中新增 `RoadmapItem` 类型。
- 在 `src/data/home.ts` 中新增 `roadmapItems` 静态数据，包含 4 个月份的功能点、状态、未来计划等信息。

### 步骤 2：组件实现

- 新增 `src/sections/RoadMapSection.vue`，实现：
  - `SectionHeader` 标题区。
  - 横向时间轴（节点 + 月份标签 + 状态标签）。
  - 4 个月份卡片布局。
  - 悬停状态管理（`hoveredMonth` ref）与卡片/节点高亮、置灰样式切换。
- 新增 `src/components/ui/RoadMapCard.vue`，封装单个月份卡片：
  - 接收 `item`、`isActive`、`isDimmed` props。
  - 根据 `status` 渲染已完成 / 进行中不同视觉。
  - 内部展示功能点列表与未来计划列表。

### 步骤 3：接入首页

- 更新 `src/pages/HomePage.vue`，在 `AgentMarketSection` 之后注册并渲染 `RoadMapSection`。
- 更新 `src/data/home.ts` 中的 `homeSections` 数组，加入 `roadmap` section。

### 步骤 4：样式与响应式

- 桌面端：4 列卡片 + 横向时间轴。
- 移动端（< 640px）：改为左侧竖向时间轴，卡片自上而下排列。
- 确保与现有 `BaseCard`、主色 token、圆角、间距风格一致。

### 步骤 5：验证

- 启动开发服务器，检查 RoadMap 区域是否正确渲染在 Agent 市场下方、Footer 上方。
- 验证悬停高亮/置灰效果。
- 验证响应式布局在窄屏下正常切换为竖向时间轴。
- 确认类型检查无报错。
