import type { IntelligenceCategory, IntelligenceItem, IntelligencePageMeta } from '@/types/pageDesign/intelligence'

export const intelligenceMeta: IntelligencePageMeta = {
  title: 'AI情报局',
  description: '搜罗全球AI热点，聚焦无线研发前沿',
}

export const categoryFilters: IntelligenceCategory[] = [
  { id: 'all', name: '全部', count: 65 },
  { id: 'model', name: '大模型', count: 12 },
  { id: 'framework', name: '框架', count: 8 },
  { id: 'industry', name: '行业', count: 15 },
  { id: 'paper', name: '论文', count: 6 },
  { id: 'tool', name: '工具', count: 20 },
  { id: 'policy', name: '政策', count: 4 },
]

export const timeRangeOptions: string[] = ['今日', '本周', '本月', '全部']

export const searchConfig = {
  placeholder: '搜索情报关键词...',
}

export const intelligenceItems: IntelligenceItem[] = [
  {
    id: 'gpt4-turbo',
    title: 'GPT-4 Turbo发布新版本，推理能力大幅提升',
    summary:
      'OpenAI 正式发布 GPT-4 Turbo 的更新版本，在数学推理、代码生成和长上下文理解方面均有显著改进。新版本支持更长的上下文窗口，并在多项基准测试中超越了前代模型。',
    source: 'AI前线',
    publishedAt: '2小时前',
    categoryId: 'model',
    icon: 'brain',
  },
  {
    id: 'langchain-v02',
    title: 'LangChain v0.2正式发布，全新模块化架构',
    summary:
      'LangChain 团队发布了备受期待的 v0.2 版本，引入了全新的模块化架构设计。新版本显著提升了可扩展性，并提供了更加清晰的组件接口，让开发者可以更灵活地构建 LLM 应用。',
    source: '开源中国',
    publishedAt: '4小时前',
    categoryId: 'framework',
    icon: 'layers',
  },
  {
    id: 'operator-ai-deploy',
    title: '全球运营商加速AI部署，预计2025年AI驱动网络占比达60%',
    summary:
      '据最新行业报告显示，全球主要电信运营商正在加速AI技术在核心网络中的部署。预计到2025年底，AI驱动的网络优化和运维功能将覆盖超过60%的运营商基础设施。',
    source: '通信世界',
    publishedAt: '6小时前',
    categoryId: 'industry',
    icon: 'globe',
  },
  {
    id: 'ssl-wireless',
    title: '最新研究：自监督学习在无线信号处理中的突破性应用',
    summary:
      '来自顶尖无线通信实验室的研究团队提出了一种基于自监督学习的信号处理新方法，在极低信噪比环境下实现了前所未有的调制识别准确率。',
    source: 'arXiv',
    publishedAt: '昨天',
    categoryId: 'paper',
    icon: 'file-code',
  },
  {
    id: 'openai-assistant-api',
    title: 'OpenAI开放Assistant API，支持自定义AI助手构建',
    summary:
      'OpenAI 宣布全面开放 Assistant API，开发者现在可以构建具有记忆、代码解释、文件检索和函数调用能力的自定义 AI 助手。API 定价模式也同步更新。',
    source: '机器之心',
    publishedAt: '昨天',
    categoryId: 'tool',
    icon: 'cpu',
  },
  {
    id: 'eu-ai-act',
    title: '欧盟AI法案正式生效，对基础模型提出新的合规要求',
    summary:
      '欧盟《人工智能法案》已正式生效实施。该法案对基础模型提供商提出了透明度、风险评估和版权合规等方面的严格要求，违规企业可能面临巨额罚款。',
    source: 'TechCrunch',
    publishedAt: '2天前',
    categoryId: 'policy',
    icon: 'shield-check',
  },
  {
    id: 'claude35-sonnet',
    title: 'Claude 3.5 Sonnet 代码能力评测：在复杂重构任务中表现优异',
    summary:
      'Anthropic 发布的 Claude 3.5 Sonnet 在多项代码能力基准测试中取得领先成绩，尤其在大型代码库重构、架构设计和跨文件依赖分析方面展现出接近资深工程师的水平。',
    source: 'AI前线',
    publishedAt: '2天前',
    categoryId: 'model',
    icon: 'brain',
  },
  {
    id: 'cursor-040',
    title: 'Cursor 编辑器发布 0.40 版本，新增 Agent 模式自动执行终端命令',
    summary:
      'Cursor 在其最新版本中引入了革命性的 Agent 模式，允许 AI 在获得用户授权后自动执行终端命令、读写文件和运行测试，大幅提升了开发效率。',
    source: '机器之心',
    publishedAt: '3天前',
    categoryId: 'tool',
    icon: 'cpu',
  },
]

export const categoryColorStyles: Record<string, string> = {
  model: 'bg-purple-50 text-purple-600',
  framework: 'bg-blue-50 text-blue-600',
  industry: 'bg-emerald-50 text-emerald-600',
  paper: 'bg-amber-50 text-amber-600',
  tool: 'bg-cyan-50 text-cyan-600',
  policy: 'bg-rose-50 text-rose-600',
}
