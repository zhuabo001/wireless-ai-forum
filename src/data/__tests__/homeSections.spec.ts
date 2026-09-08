import { describe, expect, it } from 'vitest'
import { homeSections } from '@/data/home'
import type { MinHeightTier } from '@/types/home'
import { resolveMinHeight } from '@/utils/minHeight'

// 2026-08-12 桌面 1280×800 实测渲染高度（M1 懒加载基线）。
// 分档改造后 ≥1280 视口的占位值必须与这些历史标量逐项相等（桌面零变化）。
const DESKTOP_1280: Record<string, number> = {
  engineering: 1246,
  practices: 732,
  toolbox: 652,
  intelligence: 637,
  courses: 896,
  atmosphere: 642,
  forum: 945,
  market: 820,
  roadmap: 740,
}

// 2026-09-08 多视口实测：375×812 与 768×1024 下的**占位档值**（验收视口钉值，非该视口实测高度）。
// 档值取该宽度区间的实测最大渲染高度，故可能高于本视口实测值：engineering@375 档值 1036 vs 实测
// 1014、engineering@768 1036 vs 979、roadmap@768 1446 vs 1422——偏 over 是有意的，占位不得矮于
// 真实内容（under 即 CLS 风险），不要按实测值「修正」这三项，否则会在 896/1280 等宽度重新引入 under。
// 区块布局或 mock 数据变更后重跑测量协议并同步更新此表。
const TIER_AT_375: Record<string, number> = {
  engineering: 1036,
  practices: 1500,
  toolbox: 968,
  intelligence: 1207,
  courses: 1992,
  atmosphere: 1250,
  forum: 1053,
  market: 1620,
  roadmap: 1446,
}
const TIER_AT_768: Record<string, number> = {
  engineering: 1036,
  practices: 934,
  toolbox: 668,
  intelligence: 780,
  courses: 1170,
  atmosphere: 956,
  forum: 945,
  market: 1010,
  roadmap: 1446,
}

const lazySections = homeSections.filter((section) => section.minHeight !== undefined)

const tiersOf = (id: string): MinHeightTier[] => {
  const section = homeSections.find((item) => item.id === id)
  if (!section?.minHeight) throw new Error(`missing minHeight tiers for #${id}`)
  return section.minHeight
}

describe('homeSections 占位档位契约', () => {
  it('首屏 hero 无占位档位（立即渲染）', () => {
    expect(homeSections.find((section) => section.id === 'hero')?.minHeight).toBeUndefined()
  })

  it('懒加载区块与桌面基线一一对应', () => {
    expect(lazySections.map((section) => section.id).sort()).toEqual(Object.keys(DESKTOP_1280).sort())
  })

  it('档位按 minWidth 严格降序，末档 minWidth 为 0，值为正整数', () => {
    for (const section of lazySections) {
      const tiers = section.minHeight as MinHeightTier[]
      expect(tiers.length, section.id).toBeGreaterThan(0)
      expect(tiers[tiers.length - 1].minWidth, section.id).toBe(0)
      for (const tier of tiers) {
        expect(Number.isInteger(tier.minWidth), section.id).toBe(true)
        expect(Number.isInteger(tier.value), section.id).toBe(true)
        expect(tier.value, section.id).toBeGreaterThan(0)
      }
      for (let i = 1; i < tiers.length; i += 1) {
        expect(tiers[i - 1].minWidth, section.id).toBeGreaterThan(tiers[i].minWidth)
      }
    }
  })

  it('1280 视口占位值 === 桌面历史实测值（桌面零变化守卫）', () => {
    for (const [id, expected] of Object.entries(DESKTOP_1280)) {
      expect(resolveMinHeight(tiersOf(id), 1280), id).toBe(expected)
    }
  })

  it('375/768 视口占位值 === 档位钉值（防中间档被误改；部分档值有意高于本视口实测）', () => {
    for (const [id, expected] of Object.entries(TIER_AT_375)) {
      expect(resolveMinHeight(tiersOf(id), 375), `${id}@375`).toBe(expected)
    }
    for (const [id, expected] of Object.entries(TIER_AT_768)) {
      expect(resolveMinHeight(tiersOf(id), 768), `${id}@768`).toBe(expected)
    }
  })

  it('roadmap 在 768/769 分属 1 列与 4 列档（SCSS max-width:768 边界）', () => {
    const roadmap = tiersOf('roadmap')
    expect(resolveMinHeight(roadmap, 768)).toBe(1446)
    expect(resolveMinHeight(roadmap, 769)).toBe(847)
  })

  it('更窄视口的档值不低于更宽视口（除 engineering 外高度随宽度单调不增）', () => {
    for (const section of lazySections) {
      const tiers = section.minHeight as MinHeightTier[]
      // engineering 的实测高度随宽度上升（全景图随容器放大），形态不同，单独排除
      if (section.id === 'engineering') continue
      for (let i = 1; i < tiers.length; i += 1) {
        expect(tiers[i].value, `${section.id}@${tiers[i].minWidth}`).toBeGreaterThanOrEqual(
          tiers[i - 1].value,
        )
      }
    }
  })
})
