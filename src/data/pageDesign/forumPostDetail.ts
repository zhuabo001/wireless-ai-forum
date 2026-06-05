import type { PostDetail, ContentBlock, ResourceLink, CommentSortOption, Comment } from '@/types/pageDesign/forumPostDetail'

export const postDetail: PostDetail = {
  id: '1',
  title: '基于强化学习的5G调度算法优化实践：从仿真到现网部署的完整路径',
  categories: ['实践分享', '5G', '强化学习'],
  author: {
    name: '陈威',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chenwei',
    title: '无线算法工程师 · 华为',
  },
  publishDate: '2024年12月15日',
  viewCount: 3842,
  commentCount: 36,
  likeCount: 128,
}

export const postContentBlocks: ContentBlock[] = [
  {
    type: 'paragraph',
    html: '在5G NR的MAC层调度中，传统的比例公平（PF）算法虽然能够保证基本的吞吐量与公平性平衡，但在面对高动态负载、多样化业务类型（eMBB/URLLC/mMTC）共存时，其固定的启发式规则往往难以达到最优。本文分享我们团队在过去一年中，将深度强化学习（DRL）引入5G调度决策的完整实践路径，包括仿真环境搭建、算法选型、训练策略，以及最终在某城市热点区域的现网试点结果。',
  },
  {
    type: 'heading',
    level: 2,
    html: '一、问题背景与动机',
  },
  {
    type: 'paragraph',
    html: '5G网络需要同时支撑增强移动宽带（eMBB）、超可靠低时延通信（URLLC）和海量机器类通信（mMTC）三大类业务。不同业务对吞吐量、时延、可靠性的需求差异巨大：',
  },
  {
    type: 'list',
    ordered: false,
    html: '<li>eMBB 业务追求峰值速率，对时延不敏感</li><li>URLLC 业务要求端到端时延低于 1ms，可靠性 99.999%</li><li>mMTC 业务连接密度高，但单次传输数据量极小</li>',
  },
  {
    type: 'paragraph',
    html: '传统 PF 算法以 <code>R_i(t) / ̅R_i(t)</code> 作为优先级度量，无法根据业务类型动态调整调度策略。我们在现网观测到，在 URLLC 与 eMBB 并发场景下，PF 算法的 URLLC 丢包率比理论最优高出约 18%。',
  },
  {
    type: 'heading',
    level: 2,
    html: '二、强化学习方案设计',
  },
  {
    type: 'heading',
    level: 3,
    html: '2.1 状态空间（State Space）',
  },
  {
    type: 'paragraph',
    html: '我们将每个 TTI（Transmission Time Interval）的调度决策建模为一个 MDP 过程。状态向量包含以下维度：',
  },
  {
    type: 'code',
    html: 'state = [\n  buffer_occupancy,      # 各UE逻辑信道缓存占用\n  head_of_line_delay,    # 队首包等待时延\n  channel_quality,       # CQI/PMI/RI 上报值\n  traffic_type_onehot,   # [eMBB, URLLC, mMTC] 独热编码\n  historical_throughput, # 滑动窗口平均吞吐量\n  slot_index            # 时隙索引（用于学习周期 pattern）\n]',
  },
  {
    type: 'heading',
    level: 3,
    html: '2.2 动作空间（Action Space）',
  },
  {
    type: 'paragraph',
    html: '动作定义为每个资源块组（RBG）分配给哪个 UE，以及对应的 MCS 等级选择。为降低动作空间维度，我们采用分层的动作结构：先选择 UE，再在该 UE 支持的 MCS 集合中选择最优等级。',
  },
  {
    type: 'heading',
    level: 3,
    html: '2.3 奖励函数（Reward）',
  },
  {
    type: 'paragraph',
    html: '奖励设计是本项目最关键的部分。我们采用多目标加权的方式：',
  },
  {
    type: 'code',
    html: 'reward = w1 * normalized_throughput\n       - w2 * normalized_delay_violation\n       - w3 * normalized_packet_loss\n       + w4 * fairness_index(Jain)',
  },
  {
    type: 'paragraph',
    html: '其中权重 <code>w1-w4</code> 通过网格搜索在验证集上调优。值得注意的是，我们没有使用固定的权重，而是训练了一个辅助的元网络（Meta-Network）根据网络负载动态调整权重，这使得算法在轻载和重载场景下都能保持较好的适应性。',
  },
  {
    type: 'heading',
    level: 2,
    html: '三、仿真环境与训练',
  },
  {
    type: 'paragraph',
    html: '仿真环境基于 3GPP TR 38.901 信道模型搭建，关键配置如下：',
  },
  {
    type: 'table',
    html: '<tr><th>参数</th><th>配置</th></tr><tr><td>载波频率</td><td>3.5 GHz (n78)</td></tr><tr><td>系统带宽</td><td>100 MHz (273 RBs)</td></tr><tr><td>子载波间隔</td><td>30 kHz</td></tr><tr><td>UE数量</td><td>50-200（动态接入）</td></tr><tr><td>业务模型</td><td>Full-buffer + Poisson arrival</td></tr><tr><td>移动性</td><td>3 km/h pedestrian, 30 km/h vehicular</td></tr>',
  },
  {
    type: 'paragraph',
    html: '我们对比了 PPO、SAC 和 A3C 三种算法。在相同的训练步数（10M steps）下，SAC 在收敛稳定性和最终性能上均优于其他两种算法。推测原因与 SAC 的最大熵框架有关——它鼓励策略探索，避免过早陷入局部最优。',
  },
  {
    type: 'blockquote',
    html: '"强化学习在无线通信中的应用，最大的挑战不是算法本身，而是如何设计一个既贴近现网、又足够高效的仿真环境。过度简化的信道模型会导致 sim-to-real 差距过大。"',
  },
  {
    type: 'heading',
    level: 2,
    html: '四、现网试点结果',
  },
  {
    type: 'paragraph',
    html: '在某一线城市的商业热点区域，我们将训练好的策略网络部署到 gNB 的 MAC 层调度模块中（通过 ONNX 格式导出，推理时延约 0.3ms，满足 TTI 级调度要求）。',
  },
  {
    type: 'paragraph',
    html: '与基线 PF 算法相比，关键指标提升如下：',
  },
  {
    type: 'list',
    ordered: false,
    html: '<li><strong>小区平均吞吐量</strong>：+12.3%</li><li><strong>URLLC 丢包率</strong>：-23.7%（从 0.095% 降至 0.072%）</li><li><strong>边缘用户吞吐量（5th percentile）</strong>：+18.6%</li><li><strong>Jain 公平性指数</strong>：从 0.82 提升至 0.89</li>',
  },
  {
    type: 'heading',
    level: 2,
    html: '五、踩过的坑与经验',
  },
  {
    type: 'list',
    ordered: true,
    html: '<li><strong>Sim-to-real gap</strong>：仿真中的 CQI 上报是完美的，现网存在测量误差和上报延迟。我们在训练阶段加入了高斯噪声和随机延迟来增强鲁棒性。</li><li><strong>训练稳定性</strong>：早期训练经常出现策略崩溃（policy collapse），所有资源都分配给某一个 UE。通过加入熵正则和 reward shaping 缓解。</li><li><strong>计算资源</strong>：在 200 UE 场景下，单次推理需要评估的动作空间过大。我们采用 action masking 技术，只评估缓存非空且信道条件允许的 UE-MCS 组合，将计算量降低了约 70%。</li><li><strong>在线更新</strong>：无线环境随时间变化（用户行为、干扰源），离线训练的策略会退化。我们正在探索轻量级的在线微调方案，每周用现网收集的数据进行几轮 PPO 更新。</li>',
  },
  {
    type: 'paragraph',
    html: '完整的仿真代码和训练脚本已开源在 GitHub（链接见文末）。欢迎社区同学一起探讨，尤其是在多智能体协作调度方向的思路。',
  },
]

export const resourceLinks: ResourceLink[] = [
  { type: 'github', title: '开源代码', icon: 'github', url: '#' },
  { type: 'document', title: '技术白皮书', icon: 'file-text', url: '#' },
]

export const commentSortOptions: CommentSortOption[] = [
  { id: 'hottest', label: '最热' },
  { id: 'latest', label: '最新' },
]

export const comments: Comment[] = [
  {
    id: '1',
    author: {
      name: '刘明',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=liuming',
      title: '中兴通讯 · 算法工程师',
    },
    contentHtml:
      '非常有价值的实践分享！我们在做类似的 DRL 调度项目，但在状态空间设计上走了一些弯路。想请教一下，你们的 <code>historical_throughput</code> 滑动窗口长度是怎么确定的？我们在 10/50/100 TTI 之间反复试验，发现对收敛速度影响挺大的。',
    time: '2小时前',
    likes: 24,
    isLiked: false,
    replies: [
      {
        id: '1-1',
        author: {
          name: '陈威',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chenwei',
          title: '无线算法工程师 · 华为',
        },
        authorBadge: '作者',
        contentHtml:
          '好问题！我们最终用的是 <strong>50 TTI</strong>（约 25ms @ 30kHz SCS）。太短的窗口（10 TTI）对信道变化过于敏感，策略容易震荡；太长的窗口（100+ TTI）则导致状态滞后，尤其在高速移动场景下。建议你们在验证集上画一条 "窗口长度 vs. 收敛步数" 的曲线，我们观察到 40-60 TTI 是一个相对平坦的区间。',
        time: '1小时前',
        likes: 12,
        isLiked: false,
      },
    ],
  },
  {
    id: '2',
    author: {
      name: '张帆',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangfan',
      title: '爱立信 · 系统工程师',
    },
    contentHtml:
      '关于 reward shaping 的部分很有启发。我们之前直接用了原始 KPI 作为 reward，训练非常不稳定。请问你们的 reward 缩放（reward scaling）是怎么做的？有没有遇到过 reward 爆炸的问题？',
    time: '5小时前',
    likes: 18,
    isLiked: false,
    replies: [],
  },
  {
    id: '3',
    author: {
      name: '王浩',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wanghao',
      title: '清华大学 · 博士后',
    },
    contentHtml:
      '从学术角度补充一点：最近有一篇来自 KTH Royal Institute 的论文 <em>"DeepRL for Radio Resource Management: A Comprehensive Survey"</em> 对这一类工作做了很好的归纳。文中提到一个关键趋势——从单小区独立优化向多小区协作优化转变，这恰好是你们未来可以探索的方向。多智能体强化学习（MARL）在抑制小区间干扰方面已经有一些 promising 的结果了。',
    time: '昨天',
    likes: 31,
    isLiked: false,
    replies: [],
  },
  {
    id: '4',
    author: {
      name: '赵悦',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhaoyue',
      title: '大唐移动 · 测试工程师',
    },
    contentHtml:
      '现网部署的推理时延 0.3ms 是怎么测的？是端到端从 MAC 层收到 CQI 到发出调度决策吗？我们测的 SAC 推理时延在 GPU 上都要 2-3ms，想了解一下你们的硬件加速方案。',
    time: '2天前',
    likes: 9,
    isLiked: false,
    replies: [],
  },
]

export const backLink = '/forum'
export const backTitle = '返回论坛'

export const currentUser = {
  name: '当前用户',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=currentuser',
}
