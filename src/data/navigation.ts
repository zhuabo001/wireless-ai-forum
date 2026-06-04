import type { FooterColumn, FooterContact, NavLink, QuickLink } from '../types/home'

export const brand = {
  name: '无线AI极客汇',
  tagline: 'AI赋能无线研发，连接每一位创新者',
  description: 'AI赋能无线研发，连接每一位创新者。致力于构建开放的AI技术交流平台。',
}

export const navLinks: NavLink[] = [
  { label: '首页', href: '/' },
  { label: 'AI优秀实践', href: '/practices' },
  { label: 'AI百宝箱', href: '/toolbox' },
  { label: '情报局', href: '/intelligence' },
  { label: '课程', href: '/courses' },
  { label: '论坛', href: '/forum' },
  { label: 'Agent市场', href: '/market' },
]

export const quickLinks: QuickLink[] = [
  { icon: 'cpu', label: '工程能力', href: '#engineering', color: 'bg-blue-50 text-blue-600', desc: '构建与部署核心工程能力' },
  { icon: 'award', label: '优秀实践', href: '#practices', color: 'bg-emerald-50 text-emerald-600', desc: '精选行业最佳实践案例' },
  { icon: 'briefcase', label: '百宝箱', href: '#toolbox', color: 'bg-amber-50 text-amber-600', desc: '高效工具与资源集合' },
  { icon: 'newspaper', label: '情报局', href: '#intelligence', color: 'bg-rose-50 text-rose-600', desc: '最新技术情报速递' },
  { icon: 'book-open', label: '热门课程', href: '#courses', color: 'bg-violet-50 text-violet-600', desc: '前沿技术体系化课程' },
  { icon: 'message-square', label: 'AI论坛', href: '#forum', color: 'bg-cyan-50 text-cyan-600', desc: '技术交流与观点碰撞' },
  { icon: 'layers', label: 'Agent市场', href: '#market', color: 'bg-orange-50 text-orange-600', desc: '智能体应用与服务市场' },
]

export const footerColumns: FooterColumn[] = [
  {
    title: '快速链接',
    items: [
      { label: '首页', href: '#hero' },
      { label: '论坛', href: '#forum' },
      { label: '课程', href: '#courses' },
      { label: 'Agent市场', href: '#market' },
    ],
  },
  {
    title: '资源',
    items: [
      { label: '文档中心', href: '#' },
      { label: '开发指南', href: '#' },
      { label: 'API参考', href: '#' },
    ],
  },
  {
    title: '社区',
    items: [
      { label: '优秀实践', href: '#practices' },
      { label: '线下活动', href: '#atmosphere' },
      { label: '成员名录', href: '#' },
    ],
  },
]

export const footerContacts: FooterContact[] = [
  { icon: 'github', label: 'GitHub', href: '#' },
  { icon: 'mail', label: 'feedback@wireless-ai.community', href: '#' },
]

export const footerLegalLinks: NavLink[] = [
  { label: '服务条款', href: '#' },
  { label: '隐私政策', href: '#' },
]
