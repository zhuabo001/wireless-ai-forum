import { http, HttpResponse } from 'msw'
import {
  forumMeta,
  forumTabs,
  categoryFilterOptions,
  sortFilterOptions,
  topicItems,
  sidebarData,
} from '@/data/pageDesign/forum'
import {
  postDetail,
  postContentHtml,
  resourceLinks,
  commentSortOptions,
  comments,
  currentUser,
} from '@/data/pageDesign/forumPostDetail'
import { forumStats, forumTopics } from '@/data/home'
import { createListHandler, paginate, parseListQuery } from './utils'

export const forumHandlers = [
  createListHandler('/api/forum/topics', topicItems, {
    filterByQuery: (items, url) => {
      const tab = url.searchParams.get('tab')
      const category = url.searchParams.get('category')

      let result = items
      // tab 对应 forumTabs：hot 按热度排序，其余按 tab 名称匹配 categoryBadge
      if (tab && tab !== 'all') {
        if (tab === 'hot') {
          result = [...result].sort((a, b) => b.likes - a.likes)
        } else {
          const tabName = forumTabs.find(t => t.id === tab)?.name
          result = tabName ? result.filter(item => item.categoryBadge === tabName) : []
        }
      }
      // category 对应 categoryFilterOptions：my-replies 无 mock 回复数据，返回空
      if (category === 'my-posts') {
        result = result.filter(item => item.author.name === currentUser.name)
      } else if (category === 'my-replies') {
        result = []
      }
      return result
    },
    keywordFields: item => [item.title, item.author.name],
    sorters: {
      hottest: (a, b) => b.likes - a.likes,
      'newest-reply': (a, b) => b.replies - a.replies,
    },
  }),

  http.get('/api/forum/stats', () => {
    return HttpResponse.json({ stats: forumStats, hotTopics: forumTopics })
  }),

  http.get('/api/forum/meta', () => {
    return HttpResponse.json({
      meta: forumMeta,
      tabs: forumTabs,
      categoryFilters: categoryFilterOptions,
      sortFilters: sortFilterOptions,
      sidebar: sidebarData,
    })
  }),

  http.get('/api/forum/posts/:id', ({ params }) => {
    if (params.id !== postDetail.id) {
      return HttpResponse.json({ message: 'Post not found' }, { status: 404 })
    }
    return HttpResponse.json({
      post: postDetail,
      contentHtml: postContentHtml,
      resourceLinks,
    })
  }),

  http.get('/api/forum/posts/:id/comments', ({ params, request }) => {
    if (params.id !== postDetail.id) {
      return HttpResponse.json({ message: 'Post not found' }, { status: 404 })
    }
    const url = new URL(request.url)
    const sort = url.searchParams.get('sort')
    const items =
      sort === 'likes' ? [...comments].sort((a, b) => b.likes - a.likes) : comments
    return HttpResponse.json({
      ...paginate(items, parseListQuery(url)),
      sortOptions: commentSortOptions,
    })
  }),
]
