<script setup lang="ts">
import { computed } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

interface Props {
  content: string
  streaming?: boolean
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  streaming: false,
  placeholder: '',
})

marked.setOptions({
  gfm: true,
  breaks: true,
})

const sanitizedHtml = computed(() => {
  if (!props.content) return ''
  const raw = marked.parse(props.content) as string
  return DOMPurify.sanitize(raw, {
    USE_PROFILES: { html: true },
    ALLOWED_TAGS: [
      'p',
      'br',
      'strong',
      'em',
      's',
      'u',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'ul',
      'ol',
      'li',
      'blockquote',
      'hr',
      'pre',
      'code',
      'a',
      'img',
      'table',
      'thead',
      'tbody',
      'tr',
      'th',
      'td',
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'target', 'rel'],
  })
})
</script>

<template>
  <div class="md-renderer" :class="{ 'md-renderer--streaming': streaming }">
    <div v-if="!content && placeholder" class="md-renderer__placeholder">
      {{ placeholder }}
    </div>
    <div v-else class="md-renderer__body prose" v-html="sanitizedHtml" />
    <span v-if="streaming" class="md-renderer__cursor" aria-hidden="true" />
  </div>
</template>

<style scoped>
.md-renderer {
  position: relative;
  //font-family: 'Georgia', 'Times New Roman', serif;
  font-size: 0.8rem;
  //line-height: 1.75;
}

.md-renderer__placeholder {
  font-style: italic;
}

.md-renderer__cursor {
  display: inline-block;
  width: 2px;
  height: 1.1em;
  background: #6366f1;
  margin-left: 2px;
  vertical-align: text-bottom;
  animation: blink 0.8s step-end infinite;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

.md-renderer__body :deep(h1),
.md-renderer__body :deep(h2),
.md-renderer__body :deep(h3),
.md-renderer__body :deep(h4) {
  //font-family: 'Georgia', serif;
  //font-weight: 700;
  margin: 1.4em 0 0.4em;
  line-height: 1.3;
}
.md-renderer__body :deep(h1) {
  font-size: 1.75rem;
}
.md-renderer__body :deep(h2) {
  font-size: 1.4rem;
}
.md-renderer__body :deep(h3) {
  font-size: 1.15rem;
}

.md-renderer__body :deep(p) {
  margin: 0 0 0.9em;
}

.md-renderer__body :deep(strong) {
  //font-weight: 700;
}

.md-renderer__body :deep(em) {
  color: #92979e;
}

.md-renderer__body :deep(a) {
  color: #6366f1;
  text-decoration: underline;
  text-underline-offset: 3px;
}
.md-renderer__body :deep(a:hover) {
  color: #4f46e5;
}

.md-renderer__body :deep(ul),
.md-renderer__body :deep(ol) {
  padding-left: 1.5em;
  margin: 0 0 0.9em;
  list-style: inside;
}
.md-renderer__body :deep(li) {
  margin-bottom: 0.3em;
}

.md-renderer__body :deep(blockquote) {
  margin: 1em 0;
  padding: 0.6em 1em;
  border-left: 3px solid #6366f1;
  background: #f5f3ff;
  color: #4b5563;
  border-radius: 0 6px 6px 0;
  font-style: italic;
}

.md-renderer__body :deep(code) {
  //font-family: 'Fira Code', 'Courier New', monospace;
  font-size: 0.8em;
  background: #ccc;
  color: #040910;
  padding: 0.15em 0.4em;
  border-radius: 2px;
}

.md-renderer__body :deep(pre) {
  color: #e2e8f0;
  padding: 1em 1.2em;
  border-radius: 8px;
  overflow-x: auto;
  margin: 0 0 1em;
}
.md-renderer__body :deep(pre code) {
  background: transparent;
  color: inherit;
  padding: 0;
  font-size: 0.5rem;
}

.md-renderer__body :deep(hr) {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 1.5em 0;
}

.md-renderer__body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 0 0 1em;
  font-size: 0.5rem;
}
.md-renderer__body :deep(th),
.md-renderer__body :deep(td) {
  padding: 0.5em 0.75em;
  border: 1px solid #e5e7eb;
  text-align: left;
}
.md-renderer__body :deep(th) {
  background: #f8fafc;
  //font-weight: 600;
}
.md-renderer__body :deep(tr:nth-child(even)) {
  background: #f9fafb;
}

.md-renderer__body :deep(img) {
  max-width: 100%;
  border-radius: 6px;
}
</style>
