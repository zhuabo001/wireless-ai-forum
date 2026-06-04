import type { IconName } from '../home'

export type AgentType = 'Extension' | 'Skill' | 'MCP' | 'Subagent' | 'Command'

export interface AgentItem {
  name: string
  type: AgentType
  desc: string
  downloads: string
  rating: number
  icon: IconName
  gradientFrom: string
  gradientTo: string
  typeStyle: string
  developer: string
}

export interface DownloadRankItem {
  name: string
  downloads: string
  rank: number
}

export interface NewDeveloperItem {
  surname: string
  fullName: string
  gradientFrom: string
  gradientTo: string
  contribution: string
}

export interface MarketPageMeta {
  title: string
  description: string
}
