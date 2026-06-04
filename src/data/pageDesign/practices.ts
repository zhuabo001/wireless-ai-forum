import type {
  Contributor,
  HotPost,
  PracticeCategory,
  PracticeItem,
  PracticesPageMeta,
  Team,
} from '@/types/pageDesign/practices'

export const practicesMeta: PracticesPageMeta = {
  title: '优秀实践',
  description: '沉淀各团队 AI 辅助作业经验，聚焦可复用流程、工具和项目方法',
  publishButtonText: '发布实践',
}

export const practiceCategories: PracticeCategory[] = [
  {
    id: 'wireless-rd',
    name: '无线研发',
    icon: 'radio-tower',
    subCategories: [
      { id: 'protocol-analysis', name: '协议分析', count: 18 },
      { id: 'network-optimization', name: '网络优化', count: 14 },
      { id: 'simulation-modeling', name: '仿真建模', count: 9 },
    ],
  },
  {
    id: 'test-verification',
    name: '测试验证',
    icon: 'flask-conical',
    subCategories: [
      { id: 'case-generation', name: '用例生成', count: 22 },
      { id: 'defect-location', name: '缺陷定位', count: 11 },
      { id: 'regression-analysis', name: '回归分析', count: 8 },
    ],
  },
  {
    id: 'engineering-efficiency',
    name: '工程效率',
    icon: 'code-2',
    subCategories: [
      { id: 'code-review', name: '代码审查', count: 16 },
      { id: 'kb-qa', name: '知识库问答', count: 12 },
      { id: 'doc-automation', name: '文档自动化', count: 10 },
    ],
  },
]

export const practiceItems: PracticeItem[] = [
  {
    id: 'p1',
    title: '用多 Agent 拆解 5G 信令异常的排查流程',
    summary:
      '将日志归因、协议字段解释、历史缺陷检索拆成独立 Agent，减少单次排障中的上下文切换，并沉淀为可复用的诊断模板。',
    author: '张明远',
    authorAvatar: '/avatar-1.webp',
    date: '2小时前',
    views: 1248,
    categoryId: 'wireless-rd',
    subCategoryId: 'protocol-analysis',
    tags: ['精华'],
  },
  {
    id: 'p2',
    title: 'RRC 配置变更评审 Prompt 与核对清单',
    summary:
      '围绕参数差异、邻区影响、回滚风险和测试覆盖设计四组提示词，让评审结果可以直接进入需求评审纪要。',
    author: '李思涵',
    authorAvatar: '/avatar-2.webp',
    date: '4小时前',
    views: 986,
    categoryId: 'wireless-rd',
    subCategoryId: 'protocol-analysis',
    tags: ['模板'],
  },
  {
    id: 'p3',
    title: '一次跨版本 NAS 消息解析问题的 AI 辅助复盘',
    summary:
      '通过版本差异摘要、规范条款定位和代码路径映射，定位解析器兼容性问题，并补齐后续自动化验证用例。',
    author: '陈志强',
    authorAvatar: '/avatar-3.webp',
    date: '昨天',
    views: 742,
    categoryId: 'wireless-rd',
    subCategoryId: 'protocol-analysis',
    tags: ['案例复盘'],
  },
  {
    id: 'p4',
    title: '从信令日志到缺陷单：半自动化链路实践',
    summary:
      '将日志片段抽取、异常解释、相似问题检索和缺陷单草稿串联，帮助一线同事更稳定地输出问题上下文。',
    author: '王雪晴',
    authorAvatar: '/avatar-4.webp',
    date: '2天前',
    views: 621,
    categoryId: 'wireless-rd',
    subCategoryId: 'protocol-analysis',
    tags: ['工具链'],
  },
]

export const hotPosts: HotPost[] = [
  {
    id: 'hp1',
    title: 'Agent 如何接入现网告警知识库',
    views: '2.4k',
    replies: 42,
  },
  {
    id: 'hp2',
    title: '自动生成测试报告的三种落地方式',
    views: '1.9k',
    replies: 31,
  },
  {
    id: 'hp3',
    title: 'RAG 在协议规范检索中的召回优化',
    views: '1.5k',
    replies: 27,
  },
]

export const contributors: Contributor[] = [
  {
    name: '刘浩然',
    avatar: '/avatar-5.webp',
    practices: 18,
    likes: 326,
    rank: 1,
  },
  {
    name: '赵敏华',
    avatar: '/avatar-6.webp',
    practices: 14,
    likes: 281,
    rank: 2,
  },
  {
    name: '李思涵',
    avatar: '/avatar-2.webp',
    practices: 12,
    likes: 244,
    rank: 3,
  },
]

export const teams: Team[] = [
  {
    name: '无线测试部',
    count: 31,
    newThisMonth: 6,
    badge: '活跃',
    badgeStyle: 'bg-blue-50 text-blue-600',
  },
  {
    name: '协议研发部',
    count: 27,
    newThisMonth: 4,
    badge: '精选',
    badgeStyle: 'bg-emerald-50 text-emerald-600',
  },
  {
    name: 'AI实验室',
    count: 22,
    newThisMonth: 5,
    badge: '共创',
    badgeStyle: 'bg-purple-50 text-purple-600',
  },
]

export const tagStyles: Record<string, string> = {
  精华: 'bg-emerald-50 text-emerald-600',
  模板: 'bg-amber-50 text-amber-600',
  案例复盘: 'bg-purple-50 text-purple-600',
  工具链: 'bg-cyan-50 text-cyan-600',
}

export const categoryColorStyles: Record<string, string> = {
  'wireless-rd': 'bg-blue-50 text-blue-600',
  'test-verification': 'bg-green-50 text-green-600',
  'engineering-efficiency': 'bg-orange-50 text-orange-600',
}
