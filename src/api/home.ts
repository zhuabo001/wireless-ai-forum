import { get } from './http'
import type {
  ActivityItem,
  AtmosphereEvent,
  CapabilityItem,
  ChangelogItem,
  CourseItem,
  FooterColumn,
  FooterContact,
  ForumStat,
  ForumTopic,
  HeroStat,
  HomeSectionMeta,
  IntelligenceItem,
  MarketItem,
  NavLink,
  PracticeItem,
  QuickLink,
  RoadmapItem,
  TickerItem,
  ToolItem,
} from '@/types/home'

export interface HomeResponse {
  sections: HomeSectionMeta[]
  hero: {
    content: {
      eyebrow: string
      title: string
      subtitle: string
      actions: { label: string; href: string; variant: string; icon?: string }[]
    }
    stats: HeroStat[]
  }
  changelog: ChangelogItem[]
  tickerRows: TickerItem[][]
  capabilities: CapabilityItem[]
  practices: PracticeItem[]
  tools: ToolItem[]
  intelligence: IntelligenceItem[]
  courses: CourseItem[]
  atmosphereEvents: AtmosphereEvent[]
  forum: { stats: ForumStat[]; topics: ForumTopic[] }
  market: { categories: string[]; items: MarketItem[] }
  roadmap: RoadmapItem[]
  activities: ActivityItem[]
}

export interface NavigationResponse {
  brand: { name: string; tagline: string; description: string }
  navLinks: NavLink[]
  quickLinks: QuickLink[]
  footer: {
    columns: FooterColumn[]
    contacts: FooterContact[]
    legalLinks: NavLink[]
  }
}

export function fetchHome(): Promise<HomeResponse> {
  return get('/api/home')
}

export function fetchNavigation(): Promise<NavigationResponse> {
  return get('/api/navigation')
}
