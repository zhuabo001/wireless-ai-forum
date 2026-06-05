import type { CourseItem, CourseCategoryGroup, CoursesPageMeta, PaginationConfig } from '@/types/pageDesign/courses'

export const paginationConfig: PaginationConfig = {
  pageSize: 6,
}

export const coursesMeta: CoursesPageMeta = {
  title: '课程中心',
  description: '把公司内外的优秀课程在社区分享',
}

export const courseCategoryGroups: CourseCategoryGroup[] = [
  {
    id: 'wireless',
    name: '无线技术',
    children: [
      { id: '5g-core', name: '5G核心网' },
      { id: 'ran', name: '无线接入网' },
      { id: 'signal', name: '信号处理' },
    ],
  },
  {
    id: 'ai-basics',
    name: 'AI基础',
    children: [
      { id: 'llm-principle', name: '大模型原理' },
      { id: 'prompt-eng', name: 'Prompt工程' },
      { id: 'rag', name: 'RAG技术' },
    ],
  },
  {
    id: 'agent-dev',
    name: 'Agent开发',
    children: [
      { id: 'agent-framework', name: 'Agent框架' },
      { id: 'multi-agent', name: '多Agent协作' },
      { id: 'agent-deploy', name: 'Agent部署' },
    ],
  },
]

export const courseItems: CourseItem[] = [
  {
    id: 'c1',
    title: '大模型驱动无线研发入门',
    summary: '本课程系统讲解大模型在无线网络规划、优化与运维中的核心应用场景，结合华为现网案例进行实战演练。',
    categoryId: 'ran',
    initials: 'LLM',
    gradientFrom: 'from-blue-500',
    gradientTo: 'to-indigo-600',
    author: { name: '张明远', employeeId: 'a00123456', department: '无线研究院算法部' },
  },
  {
    id: 'c2',
    title: 'LangChain应用开发实战',
    summary: '从Chain构建到Memory管理，全面掌握LangChain核心模块，能够独立搭建面向无线领域的知识库问答系统。',
    categoryId: 'rag',
    initials: 'LC',
    gradientFrom: 'from-emerald-500',
    gradientTo: 'to-teal-600',
    author: { name: '李思涵', employeeId: 'a00123789', department: 'AI实验室大模型部' },
  },
  {
    id: 'c3',
    title: 'AI辅助代码审查实践',
    summary: '学习利用大模型进行自动化Code Review，掌握Prompt模板设计、缺陷模式识别与评审报告生成的完整流程。',
    categoryId: 'agent-framework',
    initials: 'CR',
    gradientFrom: 'from-violet-500',
    gradientTo: 'to-purple-600',
    author: { name: '王雪晴', employeeId: 'a00124012', department: '工程技术部平台架构部' },
  },
  {
    id: 'c4',
    title: '无线信号AI处理技术',
    summary: '深入讲解基于深度学习的信道估计、调制识别与频谱感知算法，覆盖仿真验证到基站部署的全链路实践。',
    categoryId: 'signal',
    initials: '5G',
    gradientFrom: 'from-amber-500',
    gradientTo: 'to-orange-600',
    author: { name: '陈志强', employeeId: 'a00124567', department: '数据科学中心射频部' },
  },
  {
    id: 'c5',
    title: 'Agent开发与部署指南',
    summary: '从零构建无线运维Agent，涵盖工具调用设计、ReAct推理循环、容器化部署及生产环境监控告警配置。',
    categoryId: 'agent-deploy',
    initials: 'AG',
    gradientFrom: 'from-rose-500',
    gradientTo: 'to-pink-600',
    author: { name: '刘浩然', employeeId: 'a00125001', department: '工程技术部平台架构部' },
  },
  {
    id: 'c6',
    title: '多模态AI技术与应用',
    summary: '系统梳理视觉-语言联合建模、图文检索与跨模态生成技术，结合基站巡检与网络拓扑可视化场景展开实战。',
    categoryId: 'llm-principle',
    initials: 'MM',
    gradientFrom: 'from-cyan-500',
    gradientTo: 'to-sky-600',
    author: { name: '赵敏华', employeeId: 'a00125555', department: 'AI实验室多模态部' },
  },
]

export const defaultCategoryId = ''
