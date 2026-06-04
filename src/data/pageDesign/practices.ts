import type {
  PracticeCategory,
  PracticeItem,
  HotPost,
  Contributor,
  Team,
} from '@/types/pageDesign/practices'

export const practicesMeta = {
  title: '优秀实践',
  description: '沉淀各团队 AI 辅助作业经验，聚焦可复用流程、工具和项目方法',
}

export const practiceCategories: PracticeCategory[] = [
  {
    id: 'wireless',
    name: '无线研发',
    icon: 'radio-tower',
    count: 41,
    defaultExpanded: true,
    children: [
      { id: 'protocol', name: '协议分析', count: 18 },
      { id: 'network-opt', name: '网络优化', count: 14 },
      { id: 'simulation', name: '仿真建模', count: 9 },
    ],
  },
  {
    id: 'testing',
    name: '测试验证',
    icon: 'flask-conical',
    count: 41,
    children: [
      { id: 'case-gen', name: '用例生成', count: 22 },
      { id: 'defect-locate', name: '缺陷定位', count: 11 },
      { id: 'regression', name: '回归分析', count: 8 },
    ],
  },
  {
    id: 'engineering',
    name: '工程效率',
    icon: 'code-2',
    count: 38,
    children: [
      { id: 'code-review', name: '代码审查', count: 16 },
      { id: 'kb-qa', name: '知识库问答', count: 12 },
      { id: 'doc-auto', name: '文档自动化', count: 10 },
    ],
  },
]

export const practiceItems: PracticeItem[] = [
  {
    id: 'p1',
    title: '用多 Agent 拆解 5G 信令异常的排查流程',
    summary: '将日志归因、协议字段解释、历史缺陷检索拆成独立 Agent，减少单次排障中的上下文切换，并沉淀为可复用的诊断模板。',
    categoryId: 'protocol',
    tags: ['协议分析', '精华'],
    author: '张明远',
    time: '2小时前',
    views: '1,248',
  },
  {
    id: 'p2',
    title: 'RRC 配置变更评审 Prompt 与核对清单',
    summary: '围绕参数差异、邻区影响、回滚风险和测试覆盖设计四组提示词，让评审结果可以直接进入需求评审纪要。',
    categoryId: 'protocol',
    tags: ['协议分析', '模板'],
    author: '李思涵',
    time: '4小时前',
    views: '986',
  },
  {
    id: 'p3',
    title: '一次跨版本 NAS 消息解析问题的 AI 辅助复盘',
    summary: '通过版本差异摘要、规范条款定位和代码路径映射，定位解析器兼容性问题，并补齐后续自动化验证用例。',
    categoryId: 'protocol',
    tags: ['协议分析', '案例复盘'],
    author: '陈志强',
    time: '昨天',
    views: '742',
  },
  {
    id: 'p4',
    title: '从信令日志到缺陷单：半自动化链路实践',
    summary: '将日志片段抽取、异常解释、相似问题检索和缺陷单草稿串联，帮助一线同事更稳定地输出问题上下文。',
    categoryId: 'protocol',
    tags: ['协议分析', '工具链'],
    author: '王雪晴',
    time: '2天前',
    views: '621',
  },
  {
    id: 'p5',
    title: '基于多模态模型的无线网络拓扑自动生成',
    summary: '利用视觉语言模型解析网络拓扑草图，自动生成标准化的网元连接图和配置文件，减少人工绘图与校对耗时。',
    categoryId: 'network-opt',
    tags: ['网络优化', '精华'],
    author: '刘浩然',
    time: '3天前',
    views: '1,523',
  },
  {
    id: 'p6',
    title: '干扰矩阵 AI 分析：从定位到方案的闭环',
    summary: '基于历史干扰数据和实时 MR 测量，用聚类算法定位干扰源类型，并推荐最优频率调整方案。',
    categoryId: 'network-opt',
    tags: ['网络优化', '案例复盘'],
    author: '赵敏华',
    time: '5天前',
    views: '887',
  },
  {
    id: 'p7',
    title: '基于扩散模型的信道估计数据增强方法',
    summary: '利用扩散模型生成高保真信道估计样本，补充极端场景训练数据，将信道预测精度提升约 15%。',
    categoryId: 'simulation',
    tags: ['仿真建模', '精华'],
    author: '刘浩然',
    time: '1周前',
    views: '1,102',
  },
  {
    id: 'p8',
    title: '毫米波信道建模与 AI 预测的融合实践',
    summary: '在传统几何信道模型基础上引入神经网络残差修正，提升非视距场景下的路径损耗预测准确率。',
    categoryId: 'simulation',
    tags: ['仿真建模'],
    author: '陈志强',
    time: '1周前',
    views: '634',
  },
  {
    id: 'p9',
    title: '基于 LLM 的测试用例智能生成框架',
    summary: '从需求文档和接口规范出发，用大模型生成覆盖正常、异常和边界条件的测试用例，人工评审通过率达 85%。',
    categoryId: 'case-gen',
    tags: ['用例生成', '精华'],
    author: '王雪晴',
    time: '3天前',
    views: '2,041',
  },
  {
    id: 'p10',
    title: 'AI 辅助缺陷定位：日志聚类与调用链分析',
    summary: '将失败用例的日志进行语义聚类，结合调用链拓扑缩小可疑代码范围，减少人工排查时间约 40%。',
    categoryId: 'defect-locate',
    tags: ['缺陷定位', '工具链'],
    author: '张明远',
    time: '6天前',
    views: '768',
  },
  {
    id: 'p11',
    title: '基于自然语言的代码审查助手',
    summary: '在 MR 流程中嵌入 AI 审查 Agent，自动识别常见编码规范违规、安全漏洞和测试覆盖缺口。',
    categoryId: 'code-review',
    tags: ['代码审查', '精华'],
    author: '李思涵',
    time: '4天前',
    views: '1,875',
  },
  {
    id: 'p12',
    title: '内部知识库 RAG 问答系统的落地与优化',
    summary: '基于企业 Wiki 和文档库构建检索增强生成管道，解决权限过滤、多轮对话和引用溯源等工程问题。',
    categoryId: 'kb-qa',
    tags: ['知识库问答'],
    author: '赵敏华',
    time: '1周前',
    views: '1,456',
  },
]

export const hotPosts: HotPost[] = [
  { title: 'Agent 如何接入现网告警知识库', views: '2.4k', replies: '42' },
  { title: '自动生成测试报告的三种落地方式', views: '1.9k', replies: '31' },
  { title: 'RAG 在协议规范检索中的召回优化', views: '1.5k', replies: '27' },
]

export const contributors: Contributor[] = [
  { name: '刘浩然', surname: '刘', articles: '18', likes: '326', rank: 1 },
  { name: '赵敏华', surname: '赵', articles: '14', likes: '281', rank: 2 },
  { name: '李思涵', surname: '李', articles: '12', likes: '244', rank: 3 },
]

export const teams: Team[] = [
  { name: '无线测试部', total: '31', monthlyNew: '6', badge: '活跃', badgeStyle: 'bg-blue-50 text-blue-600' },
  { name: '协议研发部', total: '27', monthlyNew: '4', badge: '精选', badgeStyle: 'bg-emerald-50 text-emerald-600' },
  { name: 'AI实验室', total: '22', monthlyNew: '5', badge: '共创', badgeStyle: 'bg-purple-50 text-purple-600' },
]
