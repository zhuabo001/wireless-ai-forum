import type { MinHeightTier } from '@/types/home'

/**
 * 取视口宽度对应的懒加载占位高度。
 *
 * 命中首个 `minWidth <= viewportWidth` 的档位（数组按 minWidth 降序，约定末档 minWidth 为 0，
 * 因此任何宽度都有命中）。档位值取自该宽度区间的实测最大渲染高度，占位恒不矮于真实内容，
 * 残差只出现在 over 方向（挂载时页面变矮，不产生内容下推）。
 */
export function resolveMinHeight(tiers: MinHeightTier[], viewportWidth: number): number {
  for (const tier of tiers) {
    if (viewportWidth >= tier.minWidth) return tier.value
  }
  return tiers[tiers.length - 1]?.value ?? 0
}
