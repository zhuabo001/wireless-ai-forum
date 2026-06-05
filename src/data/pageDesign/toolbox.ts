import type { ToolCategory, ToolArticle, SortOption, ToolboxPageMeta } from '@/types/pageDesign/toolbox'

export const toolboxMeta: ToolboxPageMeta = {
  title: '百宝箱',
  description: '面向智能体工具的使用手册、故障处理、配置示例和经验帖',
}

export const toolCategories: ToolCategory[] = [
  { id: 'debug', name: '调试助手', icon: 'bug', count: 18 },
  { id: 'doc-gen', name: '文档生成器', icon: 'file-text', count: 15 },
  { id: 'code-merge', name: '代码合并助手', icon: 'git-merge', count: 12 },
  { id: 'cli-tools', name: 'CLI工具集', icon: 'terminal', count: 22 },
  { id: 'smart-search', name: '智能检索', icon: 'search', count: 20 },
  { id: 'security', name: '安全扫描', icon: 'shield-check', count: 9 },
]

export const toolboxArticles: ToolArticle[] = [
  {
    id: 't1',
    title: '调试助手如何定位 Agent 工具调用失败',
    summary: '从运行日志、工具入参、环境变量和模型输出四个位置快速定位失败原因，附带常见错误码处理清单。',
    categoryId: 'debug',
    author: '张明远',
    avatar: '/avatar-1.webp',
    date: '2026-05-28',
  },
  {
    id: 't2',
    title: '调试助手日志采样策略：减少噪声但保留证据',
    summary: '介绍如何设置采样等级、保留关键上下文，并在多人协作排查时导出可读的问题片段。',
    categoryId: 'debug',
    author: '李思涵',
    avatar: '/avatar-2.webp',
    date: '2026-05-26',
  },
  {
    id: 't3',
    title: '在本地沙箱复现智能体异常的步骤模板',
    summary: '给出最小复现场景、依赖版本锁定、输入样本裁剪和结果对比方法，适合提交给工具维护团队。',
    categoryId: 'debug',
    author: '陈志强',
    avatar: '/avatar-3.webp',
    date: '2026-05-23',
  },
  {
    id: 't4',
    title: '调试助手和智能检索联动的配置方式',
    summary: '通过共享索引、错误关键词映射和历史工单检索，让调试结论更快关联到已知解决方案。',
    categoryId: 'debug',
    author: '王雪晴',
    avatar: '/avatar-4.webp',
    date: '2026-05-20',
  },
  {
    id: 't5',
    title: '新同事调试助手上手路径',
    summary: '按日常问题、进阶排障和团队共享三阶段组织材料，帮助新人一周内掌握常用操作。',
    categoryId: 'debug',
    author: '刘浩然',
    avatar: '/avatar-5.webp',
    date: '2026-05-18',
  },
]

export const sortOptions: SortOption[] = [
  { key: 'latest', label: '最新' },
  { key: 'popular', label: '最热' },
  { key: 'recommended', label: '推荐' },
]

export const searchConfig = {
  placeholder: '搜索标题、摘要或作者',
}

export const paginationConfig = {
  pageSize: 4,
}
