import type { AgentItem, DownloadRankItem, MarketPageMeta, NewDeveloperItem } from '@/types/pageDesign/market'

export const marketMeta: MarketPageMeta = {
  title: 'Agent市场',
  description: '无线用户发布的Agent拓展生态 — extension、skill、MCP、subagent、command',
}

const typeStyles: Record<string, string> = {
  Extension: 'bg-blue-50 text-blue-600',
  Skill: 'bg-emerald-50 text-emerald-600',
  MCP: 'bg-purple-50 text-purple-600',
  Subagent: 'bg-orange-50 text-orange-600',
  Command: 'bg-gray-100 text-gray-600',
}

export const featuredAgents: AgentItem[] = [
  {
    name: 'CodeLens',
    type: 'Extension',
    desc: '智能代码分析插件，支持多种语言，提供实时代码质量评估和优化建议',
    downloads: '2.3k',
    rating: 4.8,
    icon: 'puzzle',
    gradientFrom: '#3b82f6',
    gradientTo: '#4f46e5',
    typeStyle: typeStyles.Extension,
    developer: '无线研究院',
  },
  {
    name: 'TestGenius',
    type: 'Skill',
    desc: '自动化测试用例生成技能，基于代码上下文智能生成高覆盖率的单元测试',
    downloads: '1.8k',
    rating: 4.7,
    icon: 'sparkles',
    gradientFrom: '#10b981',
    gradientTo: '#0d9488',
    typeStyle: typeStyles.Skill,
    developer: 'AI实验室',
  },
  {
    name: 'GitBridge',
    type: 'MCP',
    desc: 'Git仓库AI增强连接器，让Agent直接操作和分析代码库历史',
    downloads: '1.5k',
    rating: 4.6,
    icon: 'link',
    gradientFrom: '#8b5cf6',
    gradientTo: '#7c3aed',
    typeStyle: typeStyles.MCP,
    developer: '数据科学中心',
  },
]

export const agentItems: AgentItem[] = [
  {
    name: 'CodeLens',
    type: 'Extension',
    desc: '智能代码分析插件，支持多种语言',
    downloads: '2.3k',
    rating: 4.8,
    icon: 'puzzle',
    gradientFrom: '#3b82f6',
    gradientTo: '#4f46e5',
    typeStyle: typeStyles.Extension,
    developer: '无线研究院',
  },
  {
    name: 'TestGenius',
    type: 'Skill',
    desc: '自动化测试用例生成技能',
    downloads: '1.8k',
    rating: 4.7,
    icon: 'sparkles',
    gradientFrom: '#10b981',
    gradientTo: '#0d9488',
    typeStyle: typeStyles.Skill,
    developer: 'AI实验室',
  },
  {
    name: 'GitBridge',
    type: 'MCP',
    desc: 'Git仓库AI增强连接器',
    downloads: '1.5k',
    rating: 4.6,
    icon: 'link',
    gradientFrom: '#8b5cf6',
    gradientTo: '#7c3aed',
    typeStyle: typeStyles.MCP,
    developer: '数据科学中心',
  },
  {
    name: 'ReviewBot',
    type: 'Subagent',
    desc: '自动化代码审查子代理',
    downloads: '1.2k',
    rating: 4.9,
    icon: 'bot',
    gradientFrom: '#f97316',
    gradientTo: '#d97706',
    typeStyle: typeStyles.Subagent,
    developer: '工程技术部',
  },
  {
    name: 'DevCLI',
    type: 'Command',
    desc: '开发者命令行工具集',
    downloads: '980',
    rating: 4.5,
    icon: 'terminal',
    gradientFrom: '#4b5563',
    gradientTo: '#334155',
    typeStyle: typeStyles.Command,
    developer: 'AI实验室',
  },
  {
    name: 'PromptHub',
    type: 'Extension',
    desc: 'Prompt模板管理与共享',
    downloads: '3.1k',
    rating: 4.8,
    icon: 'puzzle',
    gradientFrom: '#06b6d4',
    gradientTo: '#0284c7',
    typeStyle: typeStyles.Extension,
    developer: '无线研究院',
  },
  {
    name: 'DocuMind',
    type: 'Skill',
    desc: '智能文档生成与知识库管理',
    downloads: '856',
    rating: 4.4,
    icon: 'file-text',
    gradientFrom: '#f43f5e',
    gradientTo: '#db2777',
    typeStyle: typeStyles.Skill,
    developer: '数据科学中心',
  },
  {
    name: 'DeployBot',
    type: 'Subagent',
    desc: '一键部署与持续集成子代理',
    downloads: '720',
    rating: 4.3,
    icon: 'package',
    gradientFrom: '#6366f1',
    gradientTo: '#7c3aed',
    typeStyle: typeStyles.Subagent,
    developer: '工程技术部',
  },
]

export const categoryOptions: string[] = ['全部', 'Extension', 'Skill', 'MCP', 'Subagent', 'Command']

export const sortOptions: { label: string; value: string }[] = [
  { label: '综合排序', value: 'default' },
  { label: '下载最多', value: 'downloads' },
  { label: '评分最高', value: 'rating' },
  { label: '最新发布', value: 'newest' },
]

export const downloadRank: DownloadRankItem[] = [
  { name: 'PromptHub', downloads: '3.1k', rank: 1 },
  { name: 'CodeLens', downloads: '2.3k', rank: 2 },
  { name: 'TestGenius', downloads: '1.8k', rank: 3 },
  { name: 'GitBridge', downloads: '1.5k', rank: 4 },
  { name: 'ReviewBot', downloads: '1.2k', rank: 5 },
]

export const newDevelopers: NewDeveloperItem[] = [
  { surname: '周', fullName: '周明轩', gradientFrom: '#818cf8', gradientTo: '#8b5cf6', contribution: '发布了 2 个 Extension' },
  { surname: '吴', fullName: '吴思琪', gradientFrom: '#f472b6', gradientTo: '#f43f5e', contribution: '发布了 1 个 MCP' },
  { surname: '郑', fullName: '郑浩然', gradientFrom: '#2dd4bf', gradientTo: '#06b6d4', contribution: '发布了 3 个 Skill' },
]

export const usageGuide = {
  description: '了解如何安装、配置和发布Agent，快速上手Agent市场',
  linkText: '查看文档',
  linkHref: '#',
}
