<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import client, { type MessageItem, Role } from '@/core/api/mistral.js'
import Header from '@/components/Header.vue'
import { generateUUID } from '@/core/api/Functions.js'
import Message from '@/components/Message.vue'
import Typing from '@/components/Typing.vue'
import Chats from '@/pages/views/Chats.vue'

const textareaRef = ref<HTMLTextAreaElement | null>(null)
const messagesContainer = ref<HTMLElement | null>(null)
const messages = ref<MessageItem[]>([])
const loading = ref(false)
const chatOpened = ref(false)
const thinking = ref(false)
const userInput = ref('Salut, comment puis-je vous aider ?')
const response = ref('')

async function sendMessage() {
  loading.value = true
  response.value = ''

  const stream = await client.chat.stream({
    model: 'mistral-large-latest',
    messages: [{ role: 'user', content: userInput.value }],
  })

  if (stream) {
    for await (const chunk of stream) {
      const delta = chunk.data.choices[0]?.delta?.content
      if (typeof delta === 'string') response.value += delta
    }
  }

  loading.value = false
}

async function chat() {
  loading.value = true
  thinking.value = true
  messages.value.push({ uuid: generateUUID(), role: Role.user, content: userInput.value })

  const assistantMessage: MessageItem = {
    uuid: generateUUID(),
    role: Role.assistant,
    content: '',
  }

  messages.value.push(assistantMessage)
  const lastIndex = messages.value.length - 1

  const apiMessages = messages.value.slice(0, -1).map((m) => ({
    role: m.role as 'user' | 'assistant' | 'system',
    content: m.content ?? '',
  }))

  const stream = await client.chat.stream({
    model: 'mistral-large-latest',
    messages: apiMessages,
  })

  for await (const chunk of stream) {
    if (thinking.value) thinking.value = false
    const delta = chunk.data.choices[0]?.delta?.content
    scrollToBottom()
    if (typeof delta === 'string') {
      if (messages.value && messages.value[lastIndex]) {
        messages.value[lastIndex].content += delta
      }
    }
  }

  loading.value = false
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}
function autoResize() {
  const el = textareaRef.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = el.scrollHeight + 'px'
}

onMounted(() => {})
</script>

<template>
  <div
    class="h-screen max-h-screen bg-[#020509] text-[#b8d4f0] font-['Exo_2'] overflow-hidden flex flex-col"
    data-theme="cyber"
  >
    <Header />

    <div
      class="flex flex-col flex-1 overflow-auto p-6 space-y-6 bg-[radial-gradient(ellipse_at_top,#00e5ff08_0%,transparent_60%)] relative"
      ref="messagesContainer"
    >
      <Message
        v-for="message of messages"
        :key="message.uuid"
        :message="message"
        :streaming="loading && message === messages[messages.length - 1]"
      />

      <Typing v-if="thinking" />
      <div v-if="messages.length == 0" class="max-w-md mx-auto text-center pt-12">
        <div
          class="text-6xl font-black tracking-widest text-white mb-2"
          style="font-family: 'Orbitron', sans-serif"
        >
          VOANH
        </div>
        <p class="text-cyan-400 text-xs tracking-[3px] mb-6">YOUR PERSONAL AI PLATFORM</p>
        <p class="text-gray-400 text-sm">
          Interface cyberpunk avec mémoire persistante, agents spécialisés et accès Mistral AI.
        </p>
      </div>
    </div>

    <div
      class="border-t border-[#1a3455] bg-[#050d18]/95 backdrop-blur-xl p-4 flex gap-3 items-end"
    >
      <button
        @click="chatOpened = !chatOpened"
        class="w-11 h-11 bg-[#091525] border border-[#1a3455] hover:border-cyan-400 rounded-xl flex items-center justify-center text-xl transition-all"
      >
        💬
      </button>
      <button
        class="w-11 h-11 bg-[#091525] border border-[#1a3455] hover:border-cyan-400 rounded-xl flex items-center justify-center text-xl transition-all"
      >
        +
      </button>

      <textarea
        rows="1"
        ref="textareaRef"
        @input="autoResize"
        v-model.trim="userInput"
        @keydown.enter.exact.prevent="chat"
        @keydown.ctrl.enter.exact="userInput += '\n'"
        class="flex-1 bg-[#091525] border border-[#1a3455] focus:border-cyan-400 rounded-md px-5 py-3 text-sm resize-y min-h-11.5 max-h-40 outline-none transition-all"
        placeholder="Transmettez votre message…"
      >
      </textarea>
    </div>
  </div>

  <Teleport to="body">
    <Transition name="slide-fade-chat" mode="out-in" appear>
      <Chats v-if="chatOpened" @onClose="chatOpened = false" />
    </Transition>
  </Teleport>
</template>

<style scoped>
.slide-fade-chat-enter-active {
  transition: all 0.2s ease-out;
}

.slide-fade-chat-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-chat-enter-from,
.slide-fade-chat-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>