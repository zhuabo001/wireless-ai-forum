import type {
  ForumTab,
  ForumFilterOption,
  TopicItem,
  ForumPageMeta,
  ForumSidebarData,
  PaginationConfig,
} from '@/types/pageDesign/forum'

export const paginationConfig: PaginationConfig = {
  pageSize: 4,
}

export const forumMeta: ForumPageMeta = {
  title: 'AI论坛',
  description: '用户交流广场，任何问题讨论和话题交流都可以在这里发起',
  createButtonText: '发起话题',
}

export const forumTabs: ForumTab[] = [
  { id: 'all', name: '全部' },
  { id: 'hot', name: '热门' },
  { id: 'faq', name: '工具FAQ' },
  { id: 'tech-discussion', name: '技术探讨' },
  { id: 'industry-trends', name: '业界趋势' },
  { id: 'engineering-capability', name: '工程能力全景' },
]

export const categoryFilterOptions: ForumFilterOption[] = [
  { id: 'all', name: '全部帖子' },
  { id: 'my-replies', name: '我的回复' },
  { id: 'my-posts', name: '我的发帖' },
]

export const sortFilterOptions: ForumFilterOption[] = [
  { id: 'latest', name: '最新发布' },
  { id: 'hottest', name: '最高热度' },
  { id: 'newest-reply', name: '最新回复' },
]

export const topicItems: TopicItem[] = [
  {
    id: 't1',
    author: {
      name: '张明远',
      initials: '张',
      gradientFrom: 'from-blue-400',
      gradientTo: 'to-indigo-500',
    },
    categoryBadge: '技术探讨',
    tagBadge: 'GPT-4',
    title: 'GPT-4在协议分析中的应用心得',
    time: '2小时前',
    replies: 128,
    views: '1.2k',
    likes: 89,
  },
  {
    id: 't2',
    author: {
      name: '李思涵',
      initials: '李',
      gradientFrom: 'from-emerald-400',
      gradientTo: 'to-teal-500',
    },
    categoryBadge: '工具FAQ',
    tagBadge: 'Agent调优',
    title: 'Agent调试中遇到的常见问题和解决方案',
    time: '4小时前',
    replies: 96,
    views: '876',
    likes: 56,
  },
  {
    id: 't3',
    author: {
      name: '陈志强',
      initials: '陈',
      gradientFrom: 'from-amber-400',
      gradientTo: 'to-orange-500',
    },
    categoryBadge: '工具FAQ',
    tagBadge: '5G协议',
    title: '求助：Agent在5G协议测试中遇到的边界case处理',
    time: '5小时前',
    replies: 72,
    views: '654',
    likes: 23,
  },
  {
    id: 't4',
    author: {
      name: '王雪晴',
      initials: '王',
      gradientFrom: 'from-violet-400',
      gradientTo: 'to-purple-500',
    },
    categoryBadge: '技术探讨',
    tagBadge: 'Prompt模板',
    title: '分享一个自制的代码审查Prompt模板',
    time: '昨天',
    replies: 84,
    views: '2.1k',
    likes: 156,
  },
  {
    id: 't5',
    author: {
      name: '刘浩然',
      initials: '刘',
      gradientFrom: 'from-rose-400',
      gradientTo: 'to-pink-500',
    },
    categoryBadge: '业界趋势',
    tagBadge: 'Multi-Agent',
    title: '关于多Agent协作模式在基站部署项目中的实践总结',
    time: '昨天',
    replies: 65,
    views: '543',
    likes: 45,
  },
  {
    id: 't6',
    author: {
      name: '赵敏华',
      initials: '赵',
      gradientFrom: 'from-cyan-400',
      gradientTo: 'to-sky-500',
    },
    categoryBadge: '工程能力全景',
    tagBadge: '安全审查',
    title: 'AI生成代码的安全性审查流程与最佳实践',
    time: '2天前',
    replies: 58,
    views: '987',
    likes: 72,
  },
]

export const sidebarData: ForumSidebarData = {
  hotTopics: [
    {
      rank: 1,
      title: 'GPT-4在协议分析中的应用心得',
      rankColor: 'text-red-500',
      flameColor: 'text-red-500',
    },
    {
      rank: 2,
      title: 'Agent调试中遇到的常见问题和解决方案',
      rankColor: 'text-orange-500',
      flameColor: 'text-orange-500',
    },
    {
      rank: 3,
      title: '分享一个自制的代码审查Prompt模板',
      rankColor: 'text-amber-500',
      flameColor: 'text-amber-500',
    },
    {
      rank: 4,
      title: '关于多Agent协作模式在基站部署项目中的实践总结',
      rankColor: 'text-yellow-500',
      flameColor: 'text-yellow-500',
    },
    {
      rank: 5,
      title: 'AI生成代码的安全性审查流程与最佳实践',
      rankColor: 'text-gray-400',
      flameColor: 'text-gray-400',
    },
  ],
  activeUsers: [
    {
      name: '张明远',
      initials: '张',
      gradientFrom: 'from-yellow-400',
      gradientTo: 'to-amber-500',
      weeklyPosts: 12,
      medalColor: 'text-amber-500',
    },
    {
      name: '李思涵',
      initials: '李',
      gradientFrom: 'from-gray-300',
      gradientTo: 'to-gray-400',
      weeklyPosts: 9,
      medalColor: 'text-gray-400',
    },
    {
      name: '王雪晴',
      initials: '王',
      gradientFrom: 'from-orange-300',
      gradientTo: 'to-amber-400',
      weeklyPosts: 7,
      medalColor: 'text-orange-400',
    },
    {
      name: '陈志强',
      initials: '陈',
      gradientFrom: 'from-blue-400',
      gradientTo: 'to-indigo-500',
      weeklyPosts: 5,
    },
    {
      name: '刘浩然',
      initials: '刘',
      gradientFrom: 'from-emerald-400',
      gradientTo: 'to-teal-500',
      weeklyPosts: 4,
    },
  ],
  hotTags: [
    { name: 'GPT-4', bgClass: 'bg-blue-50', textClass: 'text-blue-600' },
    { name: 'Agent', bgClass: 'bg-emerald-50', textClass: 'text-emerald-600' },
    { name: 'Prompt', bgClass: 'bg-purple-50', textClass: 'text-purple-600' },
    { name: '5G', bgClass: 'bg-amber-50', textClass: 'text-amber-600' },
    { name: '代码审查', bgClass: 'bg-rose-50', textClass: 'text-rose-600' },
    { name: 'RAG', bgClass: 'bg-cyan-50', textClass: 'text-cyan-600' },
    { name: 'LangChain', bgClass: 'bg-gray-100', textClass: 'text-gray-600' },
    { name: 'MCP', bgClass: 'bg-orange-50', textClass: 'text-orange-600' },
  ],
  rules: [
    { content: '友善交流，尊重每一位社区成员的观点和贡献' },
    { content: '发布内容前请确认信息准确性，避免传播不实消息' },
    { content: '鼓励分享实践经验和可复用的技术方案' },
    { content: '求助帖请尽量提供完整的上下文和复现步骤' },
  ],
}

export const defaultTabId = 'all'
