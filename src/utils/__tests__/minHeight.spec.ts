import { describe, expect, it } from 'vitest'
import type { MinHeightTier } from '@/types/home'
import { resolveMinHeight } from '@/utils/minHeight'

const tiers: MinHeightTier[] = [
  { minWidth: 1280, value: 740 },
  { minWidth: 1088, value: 792 },
  { minWidth: 769, value: 847 },
  { minWidth: 375, value: 1446 },
  { minWidth: 0, value: 1479 },
]

describe('resolveMinHeight', () => {
  it('命中档位下界（含）时取该档', () => {
    expect(resolveMinHeight(tiers, 1280)).toBe(740)
    expect(resolveMinHeight(tiers, 1088)).toBe(792)
    expect(resolveMinHeight(tiers, 769)).toBe(847)
    expect(resolveMinHeight(tiers, 375)).toBe(1446)
    expect(resolveMinHeight(tiers, 0)).toBe(1479)
  })

  it('下界下方 1px 取下一档（768/769 必须分属不同档）', () => {
    expect(resolveMinHeight(tiers, 1279)).toBe(792)
    expect(resolveMinHeight(tiers, 1087)).toBe(847)
    expect(resolveMinHeight(tiers, 768)).toBe(1446)
    expect(resolveMinHeight(tiers, 374)).toBe(1479)
    expect(resolveMinHeight(tiers, 320)).toBe(1479)
  })

  it('超宽视口取最大档（≥1280 高度平台期）', () => {
    expect(resolveMinHeight(tiers, 1920)).toBe(740)
    expect(resolveMinHeight(tiers, 2560)).toBe(740)
  })

  it('宽度小于所有档位下界时回退末档', () => {
    expect(resolveMinHeight([{ minWidth: 375, value: 100 }], 320)).toBe(100)
  })

  it('空档位返回 0', () => {
    expect(resolveMinHeight([], 375)).toBe(0)
  })

  // 真实档位形态（engineering 的 9 档）：覆盖 640/768/896/1024/1088/1152/1216 全部边界
  const engineeringTiers: MinHeightTier[] = [
    { minWidth: 1216, value: 1246 },
    { minWidth: 1152, value: 1210 },
    { minWidth: 1088, value: 1173 },
    { minWidth: 1024, value: 1137 },
    { minWidth: 896, value: 1100 },
    { minWidth: 768, value: 1036 },
    { minWidth: 640, value: 979 },
    { minWidth: 375, value: 1036 },
    { minWidth: 0, value: 1039 },
  ]

  it('真实档位形态下的边界命中（639/640/767/768/769/1023/1024/1279/1280）', () => {
    expect(resolveMinHeight(engineeringTiers, 639)).toBe(1036)
    expect(resolveMinHeight(engineeringTiers, 640)).toBe(979)
    expect(resolveMinHeight(engineeringTiers, 767)).toBe(979)
    expect(resolveMinHeight(engineeringTiers, 768)).toBe(1036)
    expect(resolveMinHeight(engineeringTiers, 769)).toBe(1036)
    expect(resolveMinHeight(engineeringTiers, 1023)).toBe(1100)
    expect(resolveMinHeight(engineeringTiers, 1024)).toBe(1137)
    expect(resolveMinHeight(engineeringTiers, 1279)).toBe(1246)
    expect(resolveMinHeight(engineeringTiers, 1280)).toBe(1246)
  })
})
