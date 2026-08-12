import { forumHandlers } from './forum'
import { courseHandlers } from './courses'
import { intelligenceHandlers } from './intelligence'
import { practiceHandlers } from './practices'
import { marketHandlers } from './market'
import { toolboxHandlers } from './toolbox'
import { homeHandlers } from './home'

export const handlers = [
  ...forumHandlers,
  ...courseHandlers,
  ...intelligenceHandlers,
  ...practiceHandlers,
  ...marketHandlers,
  ...toolboxHandlers,
  ...homeHandlers,
]
