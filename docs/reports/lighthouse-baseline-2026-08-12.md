# Lighthouse 性能基线（2026-08-12）

> 优化分支 `feat/lighthouse-perf-optimization` 的起点基线。后续每项优化落地后应在本文件追加对比记录。

## 测量方法

- 构建：`npm run build`，`vite preview`（localhost:4173）服务生产产物
- 工具：Chrome DevTools MCP `performance_start_trace`（Performance 维度）+ `lighthouse_audit`（无障碍/SEO/最佳实践）
- 环境：桌面端、**无 CPU/网络节流**、本地回环
- **注意**：无节流 + localhost 的实验室数据只用于优化前后**相对对比**，不代表线上真实用户绝对值。真实网络下 JS 传输成本会进一步放大 render delay 的差距。

## 核心结论

**两页 FCP ≈ LCP，SPA 一次性绘制，LCP 的 97–99% 是 Render delay（主线程 JS 执行），网络与 TTFB 几乎无损耗。**

| 指标 | 首页 `/` | 帖子详情 `/forum/post/1` |
| --- | --- | --- |
| TTFB | 13 ms | 3 ms |
| FCP | 379 ms | 320 ms |
| LCP | 379 ms（P 文本节点） | 320 ms（P 文本节点） |
| Render delay 占 LCP | 96.8%（367 ms） | 99.2%（317 ms） |
| CLS | 0.00 | 0.00 |
| FCP 前主线程繁忙 | 314 ms | 247 ms |
| 最长单个任务 | 226 ms | 180 ms |

关键链路（帖子详情页）：`HTML → index.js + index.css + vendor-element-plus.css`，最大关键路径延迟仅 45 ms。
modulepreload 过滤（vendor-mermaid/katex/wangeditor/vditor 不预加载）工作正常，未进入关键链。

**结论：当前瓶颈不在网络层、不在分包结构，而在主线程一次性求值/执行的 JS 总量。** 分包体检报告（`bundle-health-report-2026-08-12.md`）中标记的 vendor-element-plus（246.5 KB）与 vendor-common（248.9 KB）体积，正是通过这里的主线程繁忙时间体现为 FCP/LCP 延迟。

## 其他维度得分

| 维度 | 首页 | 帖子详情 |
| --- | --- | --- |
| Accessibility | 83 | 82 |
| Best Practices | 100 | 100 |
| SEO | 92 | 92 |

### 失败审计项

| 审计项 | 首页 | 帖子详情 |
| --- | --- | --- |
| button-name（按钮无可访问名称） | ❌ | ❌ |
| color-contrast（对比度不足） | ❌ | ❌ |
| robots-txt（robots.txt 无效） | ❌ | ❌ |
| heading-order（标题层级跳级） | ❌ | — |
| link-name（链接无可辨识名称） | ❌ | — |
| aria-input-field-name | — | ❌ |
| label（表单元素无关联标签） | — | ❌ |
| landmark-one-main（缺少 main 地标） | — | ❌ |
| agent-accessibility-tree / llms-txt（Agentic Browsing 维度） | ❌ | ❌ |

## 原始产物

`docs/reports/lighthouse-baseline/` 下（体积较大，不建议入库，本地留存）：

| 文件 | 内容 |
| --- | --- |
| `home-trace.json.gz` / `post-detail-trace.json.gz` | Performance trace 原始数据（可拖入 DevTools Performance 面板复查） |
| `home-report.json/.html` / `post-detail-report.json/.html` | Lighthouse 无障碍/SEO/最佳实践完整报告 |

## 优化方向（按预期收益排序）

1. **削减首屏 JS 执行量**（render delay ≈ 全部）：vendor-element-plus 按需粒度、首页折叠线下 section 懒加载
2. **长任务拆解**：226 ms 单任务会同时在真实设备上放大为 INP 风险
3. 无障碍与 SEO 失败项修复（独立维度，不影响 Performance 分）
4. robots.txt / llms.txt 合规化
