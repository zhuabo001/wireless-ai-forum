import type {
  ActivityItem,
  AtmosphereEvent,
  CapabilityItem,
  ChangelogItem,
  CourseItem,
  ForumStat,
  ForumTopic,
  HeroStat,
  HomeSectionMeta,
  IntelligenceItem,
  MarketItem,
  PracticeItem,
  TickerItem,
  ToolItem,
} from '../types/home'

export const homeSections: HomeSectionMeta[] = [
  { id: 'hero', component: 'HeroSection', className: 'py-16' },
  { id: 'engineering', component: 'EngineeringSection', className: 'py-16' },
  { id: 'practices', component: 'PracticesSection', className: 'py-16' },
  { id: 'toolbox', component: 'ToolboxSection', className: 'py-16' },
  { id: 'intelligence', component: 'IntelligenceSection', className: 'py-16' },
  { id: 'courses', component: 'CoursesSection', className: 'py-16' },
  { id: 'atmosphere', component: 'AtmosphereSection', className: 'py-16' },
  { id: 'forum', component: 'ForumSection', className: 'py-16' },
  { id: 'market', component: 'AgentMarketSection', className: 'py-16' },
]

export const heroContent = {
  eyebrow: 'AI-Powered Wireless R&D Community',
  title: '无线AI极客汇',
  subtitle: 'AI赋能无线研发，连接每一位创新者',
  actions: [
    { label: '进入论坛', href: '/forum', variant: 'primary', icon: 'arrow-right' },
    { label: '进入优秀实践', href: '/practices', variant: 'secondary' },
  ],
}

export const heroStats: HeroStat[] = [
  { icon: 'users', label: '社区成员', value: '2,500+' },
  { icon: 'message-square', label: '活跃话题', value: '3,600+' },
  { icon: 'wrench', label: 'Agent工具', value: '180+' },
  { icon: 'book-open', label: '精品课程', value: '50+' },
  { icon: 'file-text', label: '实践案例', value: '360+' },
  { icon: 'activity', label: '今日活跃', value: '128' },
]

export const changelog: ChangelogItem[] = [
  {
    version: 'v1.2.0',
    date: '2026-06-01',
    title: 'Agent市场正式上线，支持工具和Agent的一键部署与分享',
    changes: ['新增Agent市场模块', '上线首批社区精选Agent工具', '优化首页加载性能'],
  },
  {
    version: 'v1.1.0',
    date: '2026-05-15',
    title: '课程中心与AI论坛上线，社区互动功能全面开放',
    changes: ['新增课程中心，支持内外部课程分享', 'AI论坛上线，支持话题发布与讨论', '新增优秀实践与百宝箱模块'],
  },
]

export const tickerRows: TickerItem[][] = [
  [
    { tag: 'HOT', tagColor: 'bg-red-50 text-red-600', text: 'GPT-4在协议分析中的应用心得', author: '张明远' },
    { tag: 'NEW', tagColor: 'bg-green-50 text-green-600', text: 'Agent市场正式上线，欢迎体验', author: '社区公告' },
    { tag: 'HOT', tagColor: 'bg-red-50 text-red-600', text: 'Agent调试常见问题和解决方案', author: '李思涵' },
    { tag: '活动', tagColor: 'bg-blue-50 text-blue-600', text: '本周五AI辅助无线研发技术分享会', author: '线下活动' },
    { tag: '分享', tagColor: 'bg-purple-50 text-purple-600', text: '自制代码审查Prompt模板分享', author: '王雪晴' },
    { tag: 'HOT', tagColor: 'bg-red-50 text-red-600', text: '大模型微调 vs 提示工程如何选择', author: '陈志强' },
    { tag: 'NEW', tagColor: 'bg-green-50 text-green-600', text: 'LangChain v0.2模块化架构解读', author: 'AI情报局' },
    { tag: '实践', tagColor: 'bg-amber-50 text-amber-600', text: '多Agent协作在基站部署中的实践', author: '刘浩然' },
  ],
  [
    { tag: '课程', tagColor: 'bg-violet-50 text-violet-600', text: '大模型驱动无线研发入门 - 新课上线', author: '无线研究院' },
    { tag: 'HOT', tagColor: 'bg-red-50 text-red-600', text: 'AI生成代码安全性审查最佳实践', author: '赵敏华' },
    { tag: '工具', tagColor: 'bg-cyan-50 text-cyan-600', text: 'CodeLens智能代码分析插件发布', author: 'Agent市场' },
    { tag: '活动', tagColor: 'bg-blue-50 text-blue-600', text: 'Q1季度AI技术圆桌讨论报名中', author: '氛围建设' },
    { tag: 'HOT', tagColor: 'bg-red-50 text-red-600', text: '5G协议测试边界case处理求助', author: '求助区' },
    { tag: 'NEW', tagColor: 'bg-green-50 text-green-600', text: 'OpenAI Assistant API开放使用', author: 'AI情报局' },
    { tag: '课程', tagColor: 'bg-violet-50 text-violet-600', text: 'Agent开发与部署指南 - 热门推荐', author: '工程技术部' },
    { tag: '分享', tagColor: 'bg-purple-50 text-purple-600', text: '新手入门：快速搭建第一个AI Agent', author: '刘浩然' },
  ],
]

export const capabilities: CapabilityItem[] = [
  { icon: 'bot', title: '面向Agent的AR模板构建', desc: '基于Agent的增强现实模板快速构建能力' },
  { icon: 'package', title: 'Harness前馈资产构建', desc: '前馈资产自动化打包与分发' },
  { icon: 'tags', title: '代码批量标注能力', desc: '大规模代码库智能标注与分类' },
  { icon: 'git-branch', title: 'SDD开发流程定义与框架开发', desc: '规格驱动开发全流程框架支持' },
  { icon: 'zap', title: '软件开发流程Skills', desc: '可复用的开发流程技能模块' },
  { icon: 'server', title: 'MCP服务能力', desc: '模型上下文协议服务集成与管理' },
]

export const practices: PracticeItem[] = [
  { dept: '测试部', title: '智能测试用例生成', desc: '基于大模型的自动化测试用例生成，覆盖率达95%，效率提升3倍', tags: ['大模型', '自动化'] },
  { dept: '研发部', title: '代码智能审查', desc: 'AI辅助代码审查系统，自动发现潜在缺陷和安全漏洞', tags: ['代码审查', '安全'] },
  { dept: '网络部', title: '网络参数自动优化', desc: '利用强化学习实现无线网络参数自动调优，性能提升20%', tags: ['强化学习', '网络'] },
  { dept: '运维部', title: '故障预测与诊断', desc: '基于时序分析的故障预测系统，提前24小时预警', tags: ['时序分析', 'AIOps'] },
  { dept: '产品部', title: '需求智能分析', desc: 'AI辅助需求分析，自动生成需求文档和测试要点', tags: ['NLP', '需求工程'] },
  { dept: '架构部', title: '知识库智能问答', desc: '构建企业级知识库问答系统，响应时间小于1秒', tags: ['RAG', '知识库'] },
]

export const tools: ToolItem[] = [
  { icon: 'wrench', title: '调试助手', desc: '智能调试工具，快速定位问题' },
  { icon: 'file-text', title: '文档生成器', desc: '自动生成技术文档' },
  { icon: 'git-merge', title: '代码合并助手', desc: '智能合并冲突解决' },
  { icon: 'terminal', title: 'CLI工具集', desc: '命令行AI工具集合' },
  { icon: 'search', title: '智能检索', desc: '跨平台代码和文档检索' },
  { icon: 'settings', title: '模型管理', desc: 'AI模型版本和部署管理' },
  { icon: 'shield', title: '安全扫描', desc: '自动化安全漏洞检测' },
  { icon: 'database', title: '数据治理', desc: 'AI数据质量治理工具' },
]

export const intelligenceNews: IntelligenceItem[] = [
  { icon: 'brain', category: '大模型', time: '2小时前', title: 'GPT-4 Turbo发布新版本，推理能力大幅提升', source: 'AI前线' },
  { icon: 'layers', category: '框架', time: '4小时前', title: 'LangChain v0.2正式发布，全新模块化架构', source: '开源中国' },
  { icon: 'globe', category: '行业', time: '6小时前', title: '全球运营商加速AI部署，预计2025年AI驱动网络占比达60%', source: '通信世界' },
  { icon: 'file-code', category: '论文', time: '昨天', title: '最新研究：自监督学习在无线信号处理中的突破性应用', source: 'arXiv' },
  { icon: 'cpu', category: '工具', time: '昨天', title: 'OpenAI开放Assistant API，支持自定义AI助手构建', source: '机器之心' },
  { icon: 'shield-check', category: '政策', time: '2天前', title: '欧盟AI法案正式生效，对基础模型提出新的合规要求', source: 'TechCrunch' },
]

export const intelligenceCategoryColors: Record<string, string> = {
  大模型: 'bg-purple-50 text-purple-600',
  框架: 'bg-blue-50 text-blue-600',
  行业: 'bg-emerald-50 text-emerald-600',
  论文: 'bg-amber-50 text-amber-600',
  工具: 'bg-cyan-50 text-cyan-600',
  政策: 'bg-rose-50 text-rose-600',
}

export const courses: CourseItem[] = [
  { title: '大模型驱动无线研发入门', instructor: '张明远', avatar: '/avatar-1.webp', org: '无线研究院', hours: 8, rating: 4.9, students: 1250, cover: '/course-1.webp', tag: '内部课程' },
  { title: 'LangChain应用开发实战', instructor: '李思涵', avatar: '/avatar-2.webp', org: 'AI实验室', hours: 12, rating: 4.8, students: 980, cover: '/course-2.webp', tag: '外部推荐' },
  { title: 'AI辅助代码审查实践', instructor: '王雪晴', avatar: '/avatar-3.webp', org: '工程技术部', hours: 6, rating: 4.7, students: 756, cover: '/course-3.webp', tag: '内部课程' },
  { title: '无线信号AI处理技术', instructor: '陈志强', avatar: '/avatar-4.webp', org: '数据科学中心', hours: 10, rating: 4.9, students: 632, cover: '/course-4.webp', tag: '外部推荐' },
  { title: 'Agent开发与部署指南', instructor: '刘浩然', avatar: '/avatar-5.webp', org: '工程技术部', hours: 8, rating: 4.8, students: 890, cover: '/course-5.webp', tag: '内部课程' },
  { title: '多模态AI技术与应用', instructor: '赵敏华', avatar: '/avatar-6.webp', org: 'AI实验室', hours: 10, rating: 4.7, students: 543, cover: '/course-6.webp', tag: '外部推荐' },
]

export const atmosphereEvents: AtmosphereEvent[] = [
  { title: 'AI技术圆桌讨论 — Q1季度', date: '2024-03-15', location: '总部会议中心', desc: '季度技术分享，聚焦大模型在无线研发中的最新实践', image: '/event-1.webp', participants: 25 },
  { title: 'Agent开发 Workshop', date: '2024-04-20', location: '研发中心B栋', desc: '动手实践Agent开发，从Prompt设计到工具集成', image: '/event-2.webp', participants: 40 },
  { title: '年度AI创新颁奖典礼', date: '2024-06-30', location: '总部大礼堂', desc: '表彰年度AI创新项目和优秀实践团队', image: '/event-3.webp', participants: 200 },
]

export const forumStats: ForumStat[] = [
  { icon: 'messages-square', label: '话题', value: '3,600+' },
  { icon: 'reply', label: '回复', value: '12,800+' },
  { icon: 'users', label: '今日活跃', value: '128' },
]

export const forumTopics: ForumTopic[] = [
  { title: 'GPT-4在协议分析中的应用心得', author: '张明远', avatar: '/avatar-1.webp', tag: 'HOT', tagColor: 'bg-red-50 text-red-600', replies: 128, views: '1.2k', likes: 89 },
  { title: 'Agent调试中遇到的常见问题和解决方案', author: '李思涵', avatar: '/avatar-2.webp', tag: 'HOT', tagColor: 'bg-red-50 text-red-600', replies: 96, views: '876', likes: 56 },
  { title: '求助：Agent在5G协议测试中遇到的边界case处理', author: '陈志强', avatar: '/avatar-4.webp', tag: '求助', tagColor: 'bg-orange-50 text-orange-600', replies: 72, views: '654', likes: 23 },
  { title: '分享一个自制的代码审查Prompt模板', author: '王雪晴', avatar: '/avatar-3.webp', tag: '分享', tagColor: 'bg-green-50 text-green-600', replies: 84, views: '2.1k', likes: 156 },
  { title: '关于多Agent协作模式在基站部署项目中的实践总结', author: '刘浩然', avatar: '/avatar-5.webp', tag: '实践', tagColor: 'bg-blue-50 text-blue-600', replies: 65, views: '543', likes: 45 },
  { title: 'AI生成代码的安全性审查流程与最佳实践', author: '赵敏华', avatar: '/avatar-6.webp', tag: '讨论', tagColor: 'bg-purple-50 text-purple-600', replies: 58, views: '987', likes: 72 },
]

export const marketCategories = ['全部', 'Extension', 'Skill', 'MCP', 'Subagent', 'Command']

export const marketItems: MarketItem[] = [
  { name: 'CodeLens', type: 'Extension', desc: '智能代码分析插件，支持多种语言', downloads: '2.3k', rating: 4.8, icon: 'puzzle' },
  { name: 'TestGenius', type: 'Skill', desc: '自动化测试用例生成技能', downloads: '1.8k', rating: 4.7, icon: 'sparkles' },
  { name: 'GitBridge', type: 'MCP', desc: 'Git仓库AI增强连接器', downloads: '1.5k', rating: 4.6, icon: 'link' },
  { name: 'ReviewBot', type: 'Subagent', desc: '自动化代码审查子代理', downloads: '1.2k', rating: 4.9, icon: 'bot' },
  { name: 'DevCLI', type: 'Command', desc: '开发者命令行工具集', downloads: '980', rating: 4.5, icon: 'command' },
  { name: 'PromptHub', type: 'Extension', desc: 'Prompt模板管理与共享', downloads: '3.1k', rating: 4.8, icon: 'puzzle' },
]

export const marketTypeColors: Record<string, string> = {
  Extension: 'bg-blue-50 text-blue-600',
  Skill: 'bg-emerald-50 text-emerald-600',
  MCP: 'bg-purple-50 text-purple-600',
  Subagent: 'bg-orange-50 text-orange-600',
  Command: 'bg-gray-100 text-gray-600',
}

export const activities: ActivityItem[] = [
  { date: '2026-06-02', title: 'AI辅助编码实战 Workshop', desc: '动手体验AI辅助编程工具，提升研发效率', location: '研发中心A栋3楼', time: '14:00-17:00', participants: 30, type: '线下', typeColor: 'bg-blue-50 text-blue-600' },
  { date: '2026-06-05', title: '大模型在无线测试中的应用分享', desc: '测试部分享GPT-4在自动化测试中的最新实践', location: '线上会议室', time: '15:00-16:30', participants: 120, type: '线上', typeColor: 'bg-green-50 text-green-600' },
  { date: '2026-06-08', title: 'Agent开发入门培训', desc: '从零开始学习Agent开发与部署', location: '培训中心', time: '09:30-12:00', participants: 50, type: '线下', typeColor: 'bg-blue-50 text-blue-600' },
  { date: '2026-06-12', title: 'Q2 AI技术圆桌讨论', desc: '季度技术深度交流，聚焦多Agent协作', location: '总部会议中心', time: '14:00-18:00', participants: 25, type: '线下', typeColor: 'bg-blue-50 text-blue-600' },
  { date: '2026-06-15', title: '代码审查最佳实践分享会', desc: '分享AI辅助代码审查的流程与工具', location: '线上', time: '19:00-20:30', participants: 200, type: '线上', typeColor: 'bg-green-50 text-green-600' },
  { date: '2026-06-18', title: '无线AI极客汇周年庆', desc: '社区一周年庆典，回顾与展望', location: '总部大礼堂', time: '13:30-17:00', participants: 300, type: '线下', typeColor: 'bg-purple-50 text-purple-600' },
  { date: '2026-06-22', title: 'MCP协议深度解析', desc: '深入理解Model Context Protocol的设计与实现', location: '线上会议室', time: '20:00-21:30', participants: 80, type: '线上', typeColor: 'bg-green-50 text-green-600' },
  { date: '2026-06-25', title: 'Prompt Engineering 进阶课程', desc: '高级提示词工程技巧与实战案例', location: '研发中心B栋', time: '14:00-17:00', participants: 40, type: '线下', typeColor: 'bg-blue-50 text-blue-600' },
  { date: '2026-06-28', title: '月度优秀Agent评选颁奖', desc: '评选本月最佳Agent扩展，颁发荣誉证书', location: '线上', time: '16:00-17:00', participants: 500, type: '线上', typeColor: 'bg-amber-50 text-amber-600' },
]
