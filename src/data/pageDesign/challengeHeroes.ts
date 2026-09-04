import type {
  ChallengeCategoryOption,
  ChallengeClaimant,
  ChallengeDepartmentOption,
  ChallengeDetail,
  ChallengeDifficultyOption,
  ChallengeItem,
  ChallengePageMeta,
  ChallengeSidebarData,
  ChallengeSortOption,
  ChallengeTab,
  ChallengeTimelineEntry,
} from '@/types/pageDesign/challengeHeroes'
import type { Comment, CommentSortOption, PostAuthor } from '@/types/pageDesign/forumPostDetail'

export const challengePageMeta: ChallengePageMeta = {
  title: '难题英雄榜',
  description: '张榜发布实际业务难题，揭榜解题赢取积分，让真正的解题英雄脱颖而出',
  createButtonText: '发起难题',
}

export const challengeTabs: ChallengeTab[] = [
  { id: 'all', name: '全部' },
  { id: 'my-published', name: '我的发布' },
  { id: 'my-claimed', name: '我的揭榜' },
]

export const challengeCategoryOptions: ChallengeCategoryOption[] = [
  { id: 'energy', name: '基站节能' },
  { id: 'protocol', name: '协议分析' },
  { id: 'optimization', name: '网络优化' },
  { id: 'ai-ops', name: 'AI运维' },
  { id: 'mass-test', name: '大规模测试' },
  { id: 'channel', name: '信道建模' },
  { id: 'other', name: '其他' },
]

export const challengeDepartmentOptions: ChallengeDepartmentOption[] = [
  { id: 'wireless-research', name: '无线网络研究部' },
  { id: 'base-station', name: '基站平台部' },
  { id: 'core-network', name: '核心网软件部' },
  { id: 'terminal-protocol', name: '终端协议栈部' },
  { id: 'test-verify', name: '测试与验证部' },
]

export const challengeDifficultyOptions: ChallengeDifficultyOption[] = [
  { id: 'light', name: '轻微', description: '单点问题' },
  { id: 'normal', name: '一般', description: '影响单模块' },
  { id: 'hard', name: '复杂', description: '跨模块协同' },
  { id: 'critical', name: '重大', description: '影响现网业务' },
]

export const challengeSortOptions: ChallengeSortOption[] = [
  { id: 'latest', name: '最新发布' },
  { id: 'highest-score', name: '悬赏最高' },
  { id: 'most-claimed', name: '最多揭榜' },
]

/** 演示用当前登录用户（mock 视角） */
export const challengeCurrentUser: PostAuthor & { department: string } = {
  name: '周明轩',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhoumingxuan',
  title: '无线网络研究部',
  initials: '周',
  department: '无线网络研究部',
}

const userZhang = {
  name: '张明远',
  initials: '张',
  department: '无线网络研究部',
  gradientFrom: 'from-blue-400',
  gradientTo: 'to-indigo-500',
}
const userLi = {
  name: '李思涵',
  initials: '李',
  department: '终端协议栈部',
  gradientFrom: 'from-emerald-400',
  gradientTo: 'to-teal-500',
}
const userChen = {
  name: '陈志强',
  initials: '陈',
  department: '核心网软件部',
  gradientFrom: 'from-amber-400',
  gradientTo: 'to-orange-500',
}
const userWang = {
  name: '王雪晴',
  initials: '王',
  department: '测试与验证部',
  gradientFrom: 'from-violet-400',
  gradientTo: 'to-purple-500',
}
const userLiu = {
  name: '刘浩然',
  initials: '刘',
  department: '基站平台部',
  gradientFrom: 'from-rose-400',
  gradientTo: 'to-pink-500',
}
const userZhao = {
  name: '赵敏华',
  initials: '赵',
  department: '无线网络研究部',
  gradientFrom: 'from-cyan-400',
  gradientTo: 'to-sky-500',
}

export const challengeItems: ChallengeItem[] = [
  {
    id: 'ch-1',
    title: '高话务场景下基站节能策略与体验保障如何兼得？',
    category: 'energy',
    department: 'wireless-research',
    score: null,
    status: 'scoring',
    author: userZhang,
    publishTime: '2小时前',
    publishDate: '2026-09-03',
    claimCount: 12,
    viewCount: 1200,
    likeCount: 89,
  },
  {
    id: 'ch-2',
    title: '5G NR 切换失败日志量大，如何自动聚类定位根因？',
    category: 'protocol',
    department: 'terminal-protocol',
    score: null,
    status: 'scoring',
    author: userLi,
    publishTime: '4小时前',
    publishDate: '2026-09-03',
    claimCount: 8,
    viewCount: 876,
    likeCount: 56,
  },
  {
    id: 'ch-3',
    title: '地铁场景弱覆盖下的掉线率优化，现有参数调整已到瓶颈',
    category: 'optimization',
    department: 'core-network',
    score: 800,
    status: 'solving',
    author: userChen,
    publishTime: '5小时前',
    publishDate: '2026-08-26',
    claimCount: 15,
    viewCount: 2400,
    likeCount: 132,
    claimedBy: '王雪晴',
  },
  {
    id: 'ch-4',
    title: '告警风暴压缩：如何用 LLM 将千级告警收敛为可行动的工单？',
    category: 'ai-ops',
    department: 'test-verify',
    score: 200,
    status: 'open',
    author: userWang,
    publishTime: '昨天',
    publishDate: '2026-09-02',
    claimCount: 6,
    viewCount: 654,
    likeCount: 43,
  },
  {
    id: 'ch-5',
    title: '千站规模参数批量核查，人工巡检周期长且易漏检，求自动化方案',
    category: 'mass-test',
    department: 'base-station',
    score: 600,
    status: 'closed',
    author: userLiu,
    publishTime: '昨天',
    publishDate: '2026-09-02',
    claimCount: 11,
    viewCount: 1800,
    likeCount: 97,
    claimedBy: '赵敏华',
  },
  {
    id: 'ch-6',
    title: '室内毫米波信道数据稀缺，仿真模型与实测偏差大怎么破？',
    category: 'channel',
    department: 'wireless-research',
    score: 400,
    status: 'open',
    author: userZhao,
    publishTime: '2天前',
    publishDate: '2026-09-01',
    claimCount: 4,
    viewCount: 543,
    likeCount: 31,
  },
  {
    id: 'ch-7',
    title: 'Massive MIMO 权值寻优：覆盖与干扰的平衡如何自动化？',
    category: 'optimization',
    department: 'wireless-research',
    score: 500,
    status: 'open',
    author: userZhang,
    publishTime: '3天前',
    publishDate: '2026-08-31',
    claimCount: 9,
    viewCount: 980,
    likeCount: 64,
  },
  {
    id: 'ch-8',
    title: '核心网升级期间的灰度发布回滚策略，如何做到分钟级止损？',
    category: 'ai-ops',
    department: 'core-network',
    score: 300,
    status: 'solving',
    author: userChen,
    publishTime: '4天前',
    publishDate: '2026-08-30',
    claimCount: 7,
    viewCount: 720,
    likeCount: 48,
    claimedBy: '李思涵',
  },
  {
    id: 'ch-9',
    title: 'RRC 信令风暴定位：如何快速区分终端异常与网络侧问题？',
    category: 'protocol',
    department: 'terminal-protocol',
    score: 350,
    status: 'open',
    author: userLi,
    publishTime: '5天前',
    publishDate: '2026-08-29',
    claimCount: 5,
    viewCount: 610,
    likeCount: 37,
  },
  {
    id: 'ch-10',
    title: '高低频组网下的载波聚合负载均衡策略优化',
    category: 'optimization',
    department: 'base-station',
    score: 450,
    status: 'open',
    author: userLiu,
    publishTime: '6天前',
    publishDate: '2026-08-28',
    claimCount: 3,
    viewCount: 455,
    likeCount: 29,
  },
  {
    id: 'ch-11',
    title: '功耗建模：如何仅用网管 counter 预估单站能耗趋势？',
    category: 'energy',
    department: 'test-verify',
    score: 250,
    status: 'closed',
    author: userWang,
    publishTime: '1周前',
    publishDate: '2026-08-27',
    claimCount: 10,
    viewCount: 830,
    likeCount: 58,
    claimedBy: '张明远',
  },
  {
    id: 'ch-12',
    title: '外场路测数据自动分析：异常事件提取与报告生成',
    category: 'mass-test',
    department: 'test-verify',
    score: 300,
    status: 'open',
    author: userZhao,
    publishTime: '1周前',
    publishDate: '2026-08-26',
    claimCount: 2,
    viewCount: 388,
    likeCount: 21,
  },
]

/** 分数榜人物（近期榜与总榜共用，避免头像渐变漂移） */
const rankUserWang = { name: '王雪晴', initials: '王', department: '测试与验证部', gradientFrom: 'from-yellow-400', gradientTo: 'to-amber-500' }
const rankUserZhao = { name: '赵敏华', initials: '赵', department: '无线网络研究部', gradientFrom: 'from-gray-300', gradientTo: 'to-gray-400' }
const rankUserZhaoCyan = { name: '赵敏华', initials: '赵', department: '无线网络研究部', gradientFrom: 'from-cyan-400', gradientTo: 'to-sky-500' }
const rankUserLi = { name: '李思涵', initials: '李', department: '终端协议栈部', gradientFrom: 'from-orange-300', gradientTo: 'to-amber-400' }
const rankUserZhang = { name: '张明远', initials: '张', department: '无线网络研究部', gradientFrom: 'from-blue-400', gradientTo: 'to-indigo-500' }
const rankUserLiu = { name: '刘浩然', initials: '刘', department: '基站平台部', gradientFrom: 'from-emerald-400', gradientTo: 'to-teal-500' }
const rankUserChen = { name: '陈志强', initials: '陈', department: '核心网软件部', gradientFrom: 'from-amber-400', gradientTo: 'to-orange-500' }

export const challengeSidebarData: ChallengeSidebarData = {
  viewRank: [
    { id: 'ch-3', title: '地铁场景弱覆盖下的掉线率优化，现有参数调整已到瓶颈', value: '2.4k' },
    { id: 'ch-5', title: '千站规模参数批量核查，人工巡检周期长且易漏检，求自动化方案', value: '1.8k' },
    { id: 'ch-1', title: '高话务场景下基站节能策略与体验保障如何兼得？', value: '1.2k' },
    { id: 'ch-2', title: '5G NR 切换失败日志量大，如何自动聚类定位根因？', value: '876' },
    { id: 'ch-11', title: '功耗建模：如何仅用网管 counter 预估单站能耗趋势？', value: '830' },
  ],
  usefulRank: [
    { id: 'ch-3', title: '地铁场景弱覆盖下的掉线率优化，现有参数调整已到瓶颈', value: '132' },
    { id: 'ch-5', title: '千站规模参数批量核查，人工巡检周期长且易漏检，求自动化方案', value: '97' },
    { id: 'ch-1', title: '高话务场景下基站节能策略与体验保障如何兼得？', value: '89' },
    { id: 'ch-7', title: 'Massive MIMO 权值寻优：覆盖与干扰的平衡如何自动化？', value: '64' },
    { id: 'ch-11', title: '功耗建模：如何仅用网管 counter 预估单站能耗趋势？', value: '58' },
  ],
  scoreRank: [
    { user: rankUserWang, scoreGain: '+800 分' },
    { user: rankUserZhao, scoreGain: '+600 分' },
    { user: rankUserLi, scoreGain: '+450 分' },
    { user: rankUserZhang, scoreGain: '+320 分' },
    { user: rankUserLiu, scoreGain: '+280 分' },
  ],
  totalScoreRank: [
    { user: rankUserWang, scoreGain: '2,450 分', subText: '测试与验证部 · 揭榜 4 题' },
    { user: rankUserZhang, scoreGain: '1,890 分', subText: '无线网络研究部 · 揭榜 6 题' },
    { user: rankUserLi, scoreGain: '1,620 分', subText: '终端协议栈部 · 揭榜 5 题' },
    { user: rankUserChen, scoreGain: '1,380 分', subText: '核心网软件部 · 揭榜 3 题' },
    { user: rankUserZhaoCyan, scoreGain: '1,120 分', subText: '无线网络研究部 · 揭榜 3 题' },
  ],
}

/* ---------------- 详情页数据（ch-3 为完整示例） ---------------- */

export const challengeDetailClaimant: ChallengeClaimant = {
  user: userWang,
  claimTime: '8月27日 揭榜',
  stats: '揭榜 4 题 · 累计 +1,650 分',
}

export const challengeDetailTimeline: ChallengeTimelineEntry[] = [
  { id: 'tl-1', type: 'done', title: '陈志强 发布难题', time: '08-26 10:24' },
  {
    id: 'tl-2',
    type: 'done',
    title: '平台管理员 评定分值 800 分',
    time: '08-26 15:02',
    note: '依据难度自评「复杂 · 跨模块协同」与业务影响面评定',
  },
  { id: 'tl-3', type: 'done', title: '王雪晴 揭榜', time: '08-27 09:15' },
  {
    id: 'tl-4',
    type: 'done',
    title: '王雪晴 提交解决方案',
    time: '08-30 17:40',
    note: '《基于 MR 时空栅格聚类的动态弱覆盖识别与参数寻优》',
  },
  {
    id: 'tl-5',
    type: 'current',
    title: '试点验证中',
    time: '进行中',
    note: '第一周：掉线率 2.3% → 1.4%',
  },
  { id: 'tl-6', type: 'pending', title: '验收结题 · 悬赏积分划转', time: '待完成' },
]

export const challengeDetail: ChallengeDetail = {
  id: 'ch-3',
  title: '地铁场景弱覆盖下的掉线率优化，现有参数调整已到瓶颈',
  category: 'optimization',
  department: 'core-network',
  score: 800,
  status: 'solving',
  difficulty: 'hard',
  author: { ...userChen, name: '陈志强' },
  publishDate: '2026年8月26日',
  viewCount: 2418,
  commentCount: 3,
  likeCount: 132,
  claimant: challengeDetailClaimant,
  progressPercent: 70,
  timeline: challengeDetailTimeline,
}

export const challengeContentHtml = `
<h2>一、背景与场景</h2>
<p>某市地铁 2 号线全线 38 个站点的室分系统开通已超 5 年，覆盖采用传统 DAS 方案。近三个月，早晚高峰时段的 VoLTE 掉线率持续攀升，从 0.8% 升至 2.3%，用户投诉集中在换乘通道和站台两端。该线路日均客流量超过 80 万人次，属于典型的高价值、高敏感度场景。</p>
<h2>二、现状与痛点</h2>
<p>我们已经完成的优化动作和遇到的瓶颈：</p>
<ul>
<li><strong>功率与切换参数调整</strong>：对 23 个弱覆盖栅格完成两轮 A3/A5 门限和下倾角优化，掉线率仅下降 0.2 个百分点，收益已不明显</li>
<li><strong>扩容</strong>：高峰时段 PRB 利用率未超过 65%，排除容量瓶颈</li>
<li><strong>告警排查</strong>：无硬件告警，排除了设备故障因素</li>
<li><strong>核心矛盾</strong>：弱覆盖区域分散且随客流潮汐移动，基于固定栅格的参数配置无法匹配动态的人流分布；人工分析 MR 数据周期长（单轮约 2 周），等优化方案上线时场景已变化</li>
</ul>
<h2>三、期望目标与验收标准</h2>
<p>希望社区的专家提供可落地的方案，目标：</p>
<ol>
<li>高峰时段 VoLTE 掉线率降至 <strong>1.0% 以下</strong>，且不影响数据业务吞吐量</li>
<li>弱覆盖区域的识别周期从 2 周缩短到 <strong>3 天以内</strong></li>
<li>方案需能在现有运维体系内落地，不依赖大规模硬件改造</li>
</ol>
<p>验收方式：方案在 2 个试点站点运行 4 周，以网管 counter 和 MR 报告为准进行前后对比，达到上述指标即为揭榜成功。</p>
<h2>四、已有材料</h2>
<ul>
<li>近 90 天的 MR 采样数据（已脱敏，约 40GB）与网管 counter 导出</li>
<li>线路室分拓扑图与天线点位勘察记录</li>
<li>前两轮参数优化的完整操作记录与效果对比</li>
<li>客流分时数据（来自运营方公开年报口径）</li>
</ul>
<blockquote>"这个问题卡了我们一个季度。参数调整的常规武器已经打完了，期待 AI 或数据驱动的新思路——尤其是能把'动态弱覆盖识别'做快的方案。"</blockquote>
`

/* ---------------- 评论区数据 ---------------- */

export const challengeCommentSortOptions: CommentSortOption[] = [
  { id: 'hottest', label: '最热' },
  { id: 'latest', label: '最新' },
]

const authorLiu: PostAuthor = {
  name: '刘浩然',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=liuhaoran',
  title: '基站平台部',
  initials: '刘',
}
const authorWang: PostAuthor = {
  name: '王雪晴',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangxueqing',
  title: '测试与验证部',
  initials: '王',
}
const authorLi: PostAuthor = {
  name: '李思涵',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisihan',
  title: '终端协议栈部',
  initials: '李',
}
const authorChen: PostAuthor = {
  name: '陈志强',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chenzhiqiang',
  title: '核心网软件部',
  initials: '陈',
}

export const challengeComments: Comment[] = [
  {
    id: 'cc-1',
    author: authorLiu,
    contentHtml:
      '动态弱覆盖识别这条，我们部门做过一个类似的试点：用 MR 的 RSRP 采样叠加闸机客流数据做时空栅格聚类，识别周期从人工 2 周压到了 2 天。关键点是栅格粒度不要贪细，50m × 15min 的粒度在地铁场景已经足够。可以给揭榜人参考。',
    time: '3小时前',
    likes: 24,
    isLiked: false,
    replies: [
      {
        id: 'cc-1-r1',
        author: authorWang,
        authorBadge: '揭榜人',
        contentHtml:
          '感谢！我的方案里正好采用了类似的时空栅格思路，粒度定在 50m × 30min（考虑到客流数据更新频率）。已在验证环境跑通，详见我提交的方案文档。',
        time: '2小时前',
        likes: 12,
        isLiked: false,
      },
    ],
  },
  {
    id: 'cc-2',
    author: authorLi,
    contentHtml:
      '提醒一个容易忽视的点：地铁场景的掉线有相当一部分发生在站台→车厢的切换带上，这段的覆盖来自隧道泄漏电缆而不是站台天线，优化参数时建议把这两类覆盖源分开评估，否则指标会互相掩盖。',
    time: '昨天',
    likes: 18,
    isLiked: false,
    replies: [],
  },
  {
    id: 'cc-3',
    author: authorChen,
    authorBadge: '发布者',
    contentHtml:
      '统一回复大家：脱敏后的 MR 数据集和前两轮优化记录已经打包，揭榜后可以在方案工作区直接获取。目前王雪晴同学的方案已进入试点验证阶段，第一周数据显示掉线率从 2.3% 降至 1.4%，趋势乐观，欢迎继续围观和补充思路。',
    time: '昨天',
    likes: 31,
    isLiked: false,
    replies: [],
  },
]
