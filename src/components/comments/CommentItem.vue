<script setup lang="ts">
import { ref, shallowRef, onBeforeUnmount, nextTick, defineAsyncComponent } from 'vue'
import type { IDomEditor, IToolbarConfig } from '@wangeditor/editor'
import type { Comment } from '@/types/pageDesign/forumPostDetail'
import IconRenderer from '@/components/ui/IconRenderer.vue'

// wangeditor 本体约 780KB：回复编辑器由 v-if 门控，
// 异步组件保证用户首次点击“回复”时才加载编辑器 chunk；
// CSS 一并动态引入（静态 CSS import 会生成对 JS chunk 的副作用静态边）
const Editor = defineAsyncComponent(() =>
  Promise.all([
    import('@wangeditor/editor-for-vue').then(m => m.Editor),
    import('@wangeditor/editor/dist/css/style.css'),
  ]).then(([component]) => component),
)
const Toolbar = defineAsyncComponent(() =>
  import('@wangeditor/editor-for-vue').then(m => m.Toolbar),
)

defineProps<{
  comment: Comment
  currentUserAvatar: string
}>()

const emit = defineEmits<{
  toggleLike: [commentId: string]
  submitReply: [commentId: string, html: string]
}>()

const showReplyEditor = ref<boolean>(false)

const replyEditorRef = shallowRef<IDomEditor>()

const replyToolbarConfig: Partial<IToolbarConfig> = {
  excludeKeys: [
    'headerSelect', 'fontSize', 'fontFamily', 'lineHeight',
    'foreColor', 'backColor', 'emotion', 'fullScreen',
    'insertImage', 'insertVideo', 'insertTable', 'divider',
    'clearStyle', 'group-video', 'group-image',
    'through', 'sup', 'sub', 'justifyLeft', 'justifyRight',
    'justifyCenter', 'justifyJustify',
  ],
}

const replyEditorConfig = {
  placeholder: '写下你的回复...',
  autoFocus: false,
  MENU_CONF: {},
}

function handleReplyCreated(editor: IDomEditor): void {
  replyEditorRef.value = editor
  nextTick(() => {
    editor.focus()
  })
}

function toggleReplyEditor(): void {
  showReplyEditor.value = !showReplyEditor.value
}

function handleSubmitReply(commentId: string): void {
  const editor = replyEditorRef.value
  if (!editor) return
  const text = editor.getText()
  if (!text.trim()) return
  const html = editor.getHtml()
  emit('submitReply', commentId, html)
  editor.clear()
  showReplyEditor.value = false
}

function handleCancelReply(): void {
  const editor = replyEditorRef.value
  if (editor) {
    editor.clear()
  }
  showReplyEditor.value = false
}

onBeforeUnmount(() => {
  const editor = replyEditorRef.value
  if (editor) {
    editor.destroy()
    replyEditorRef.value = undefined
  }
})
</script>

<template>
  <div class="comment-item">
    <div class="flex items-start gap-3">
      <img
        :src="comment.author.avatar"
        :alt="comment.author.name"
        class="w-9 h-9 rounded-full bg-muted border border-border flex-shrink-0"
      >
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <span class="text-sm font-semibold text-foreground">{{ comment.author.name }}</span>
          <span class="text-xs text-muted-foreground">{{ comment.author.title }}</span>
          <span class="text-xs text-muted-foreground">· {{ comment.time }}</span>
        </div>
        <div class="text-sm text-foreground leading-relaxed mb-2" v-html="comment.contentHtml"></div>
        <div class="flex items-center gap-4">
          <button
            :class="[
              'flex items-center gap-1.5 text-xs transition-colors',
              comment.isLiked ? 'text-rose-500' : 'text-muted-foreground hover:text-rose-500'
            ]"
            @click="$emit('toggleLike', comment.id)"
          >
            <IconRenderer name="thumbs-up" class="w-3.5 h-3.5" />
            <span>{{ comment.likes }}</span>
          </button>
          <button
            class="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
            @click="toggleReplyEditor"
          >
            <IconRenderer name="message-circle" class="w-3.5 h-3.5" />
            <span>回复</span>
          </button>
        </div>

        <!-- Reply Editor -->
        <div v-if="showReplyEditor" class="mt-3">
          <div class="bg-muted/40 rounded-xl p-3">
            <div class="flex items-start gap-2.5">
              <img
                :src="currentUserAvatar"
                alt="我"
                class="w-7 h-7 rounded-full bg-muted border border-border flex-shrink-0"
              >
              <div class="flex-1">
                <div class="text-xs text-muted-foreground mb-1.5">
                  回复 <span class="text-primary font-medium">{{ comment.author.name }}</span>
                </div>
                <Toolbar
                  :editor="replyEditorRef"
                  :default-config="replyToolbarConfig"
                  mode="simple"
                  class="reply-toolbar border border-border rounded-lg bg-muted/30 mb-1"
                />
                <Editor
                  :default-config="replyEditorConfig"
                  mode="simple"
                  class="reply-editor-wrapper"
                  @onCreated="handleReplyCreated"
                />
                <div class="flex justify-end gap-2 mt-2">
                  <button
                    class="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
                    @click="handleCancelReply"
                  >
                    取消
                  </button>
                  <button
                    class="px-4 py-1.5 text-xs font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
                    @click="handleSubmitReply(comment.id)"
                  >
                    回复
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Nested Replies -->
        <div v-if="comment.replies.length > 0" class="mt-4 space-y-4 pl-4 border-l-2 border-border/60">
          <div v-for="reply in comment.replies" :key="reply.id" class="reply-item">
            <div class="flex items-start gap-2.5">
              <img
                :src="reply.author.avatar"
                :alt="reply.author.name"
                class="w-7 h-7 rounded-full bg-muted border border-border flex-shrink-0"
              >
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-sm font-semibold text-foreground">{{ reply.author.name }}</span>
                  <span v-if="reply.authorBadge" class="text-xs text-muted-foreground">{{ reply.authorBadge }}</span>
                  <span class="text-xs text-muted-foreground">· {{ reply.time }}</span>
                </div>
                <div class="text-sm text-foreground leading-relaxed mb-1.5" v-html="reply.contentHtml"></div>
                <div class="flex items-center gap-4">
                  <button
                    :class="[
                      'flex items-center gap-1.5 text-xs transition-colors',
                      reply.isLiked ? 'text-rose-500' : 'text-muted-foreground hover:text-rose-500'
                    ]"
                    @click="$emit('toggleLike', reply.id)"
                  >
                    <IconRenderer name="thumbs-up" class="w-3.5 h-3.5" />
                    <span>{{ reply.likes }}</span>
                  </button>
                  <button
                    class="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                    @click="toggleReplyEditor"
                  >
                    <IconRenderer name="message-circle" class="w-3.5 h-3.5" />
                    <span>回复</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.reply-toolbar {
  padding: 2px 6px;
}
.reply-toolbar .w-e-toolbar {
  border: none;
  background: transparent;
}
.reply-toolbar .w-e-bar-item button {
  padding: 3px 5px;
  border-radius: 4px;
  color: #64748b;
}
.reply-toolbar .w-e-bar-item button:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.reply-editor-wrapper {
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background: white;
}
.reply-editor-wrapper .w-e-text-container {
  border: none;
  border-radius: 0.5rem;
  background: white;
}
.reply-editor-wrapper .w-e-text-container [data-slate-editor] {
  min-height: 80px;
  padding: 8px 10px;
  line-height: 1.7;
  font-size: 0.875rem;
}
.reply-editor-wrapper .w-e-text-placeholder {
  top: 8px;
  left: 10px;
  font-size: 0.875rem;
  color: #94a3b8;
}
</style>
