<script setup lang="ts">
import { computed, ref } from 'vue'
import { type Chat, type ChatProps } from '@/core/api/models.ts'
import { useChatStore } from '@/core/stores/chat.ts'

const chatStore = useChatStore()
const loading = computed(() => chatStore.loading)
const activeUuid = computed(() => chatStore.currentChat?.uuid)
const conversations = computed(() => chatStore.chats as Chat[])

const renamingUuid = ref<string | null>(null)
const renameValue = ref('')

const emit = defineEmits(['onClose'])

function startRename(conv: Chat) {
  renamingUuid.value = conv.uuid
  renameValue.value = conv.name
}

function confirmRename() {
  if (loading.value) return
  if (renamingUuid.value === null || renameValue.value === null) return
  chatStore.renameChat(renamingUuid.value, renameValue.value)
  renamingUuid.value = null
  renameValue.value = ''
}

function selectChat(uuid: string) {
  chatStore.selectChat(uuid)
}

function deteleChat(uuid: string) {
  chatStore.removeChat(uuid)
}

const close = () => {
  emit('onClose')
}
</script>

<template>
  <div
    class="z-100 w-[50vw] px-5 py-3 h-[calc(100vh-5rem)] fixed top-0 left-0 bg-[#050d18]/95 border-b border-[#1a3455]/50 backdrop-blur-xl"
  >
    <!-- Header -->
    <div class="flex items-center justify-between mb-10">
      <span class="text-md tracking-[0.2em] text-cyan-500/70 uppercase font-semibold">
        ⬡ Historique
      </span>
      <div @click="close" class="close-modal-btn">X</div>
    </div>

    <!-- Liste vide -->
    <div
      v-if="conversations.length === 0"
      class="text-center py-8 text-cyan-900/60 text-xs tracking-widest"
    >
      — Aucune conversation —
    </div>

    <!-- Items -->
    <div
      v-for="(conv, i) in conversations"
      :key="conv.uuid"
      class="conversation-item group relative flex items-center gap-3 px-3 py-3 rounded-sm border cursor-pointer transition-all duration-200"
      :class="[
        activeUuid === conv.uuid
          ? 'bg-cyan-950/60 border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
          : 'bg-slate-900/40 border-slate-700/40 hover:bg-cyan-950/30 hover:border-cyan-700/40',
      ]"
      :style="{ animationDelay: `${i * 40}ms` }"
      @click="selectChat(conv.uuid)"
    >
      <!-- Accent bar gauche -->
      <div
        class="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-sm transition-all duration-200"
        :class="
          activeUuid === conv.uuid ? 'bg-cyan-400' : 'bg-transparent group-hover:bg-cyan-700/50'
        "
      />

      <div class="flex-1 min-w-0">
        <input
          v-if="renamingUuid === conv.uuid"
          v-model="renameValue"
          class="w-full bg-transparent border-b border-cyan-400 text-cyan-100 text-sm outline-none pb-px"
          autofocus
          @blur="confirmRename()"
          @keydown.enter.prevent="confirmRename()"
          @keydown.escape="renamingUuid = null"
          @click.stop
        />
        <div
          v-else
          class="text-sm font-semibold truncate transition-colors duration-150"
          :class="
            activeUuid === conv.uuid ? 'text-cyan-100' : 'text-slate-300 group-hover:text-cyan-200'
          "
        >
          {{ conv.name }}
        </div>
      </div>

      <!-- Actions (visibles au hover) -->
      <div
        class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 shrink-0"
        @click.stop
      >
        <!-- Renommer -->
        <button
          class="action-btn text-white hover:text-orange-400 hover:border-orange-500/40 hover:bg-orange-950/30"
          title="Renommer"
          @click="startRename(conv)"
        >
          <i class="bx bx-edit"></i>
        </button>

        <!-- Supprimer -->
        <button
          class="action-btn text-white hover:text-red-400 hover:border-red-500/40 hover:bg-red-950/30"
          title="Supprimer"
          @click="deteleChat(conv.uuid)"
        >
          <i class="bx bx-trash"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.conversation-list {
}

.action-btn {
  cursor: pointer;
}

/* Animation d'entrée des items */
.conversation-item {
  animation: slideIn 0.25s ease both;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-6px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
