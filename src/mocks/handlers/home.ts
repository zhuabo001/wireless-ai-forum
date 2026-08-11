import { http, HttpResponse } from 'msw'
import {
  homeSections,
  heroContent,
  heroStats,
  changelog,
  tickerRows,
  capabilities,
  practices,
  tools,
  intelligenceNews,
  courses,
  atmosphereEvents,
  forumStats,
  forumTopics,
  marketCategories,
  marketItems,
  roadmapItems,
  activities,
} from '@/data/home'
import { brand, navLinks, quickLinks, footerColumns, footerContacts, footerLegalLinks } from '@/data/navigation'

export const homeHandlers = [
  http.get('/api/home', () => {
    return HttpResponse.json({
      sections: homeSections,
      hero: { content: heroContent, stats: heroStats },
      changelog,
      tickerRows,
      capabilities,
      practices,
      tools,
      intelligence: intelligenceNews,
      courses,
      atmosphereEvents,
      forum: { stats: forumStats, topics: forumTopics },
      market: { categories: marketCategories, items: marketItems },
      roadmap: roadmapItems,
      activities,
    })
  }),

  http.get('/api/navigation', () => {
    return HttpResponse.json({
      brand,
      navLinks,
      quickLinks,
      footer: { columns: footerColumns, contacts: footerContacts, legalLinks: footerLegalLinks },
    })
  }),
]
