# RoadMap 区域开发记录

**日期**: 2026-06-13  
**功能概述**: 在首页 Agent 市场下方、Footer 上方新增"产品路线图"区域，展示近 4 个月的能力演进时间线（前三月已完成 + 当月进行中），支持鼠标悬停卡片高亮、其余置灰的聚焦交互。

## 修改文件

| 文件 | 操作 | 影响说明 |
|---|---|---|
| `src/types/home.ts` | 修改 — 新增 `RoadmapStatus`、`RoadmapFeature`、`RoadmapItem` 类型 | 新增类型定义，无其他类型受影响 |
| `src/data/home.ts` | 修改 — 新增 `roadmapItems` 数组、`homeSections` 追加 `roadmap` entry | 仅追加数据，现有数据结构不变 |
| `src/pages/HomePage.vue` | 修改 — import 并注册 `RoadMapSection` 组件 | 在 `sectionComponents` 映射中新增一行，不影响现有渲染 |
| `src/sections/RoadMapSection.vue` | 新增 | 独立 section，不修改其他文件 |
| `src/components/ui/RoadMapCard.vue` | 新增 | 独立组件，不修改其他文件 |

## 对其他模块的影响

- **无影响**。所有新增代码均以追加方式加入，没有修改现有 section、组件、路由或 store。
- RoadMap section 通过 `homeSections` 数据驱动渲染，与现有 section 的注册模式完全一致。

## 关键设计决策

1. **时间轴节点在移动端隐藏**：768px 以下断点隐藏时间轴轨道和节点，卡片变为单列竖向排列。卡片自身包含月份和状态标签，信息完整。
2. **设计 token 使用 `--home-*` 前缀变量**：与 `src/assets/tokens.css` 保持一致，避免硬编码颜色。
3. **图标均来自现有 `IconName` 联合类型**：无新增图标依赖。
