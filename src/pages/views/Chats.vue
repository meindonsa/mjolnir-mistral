<script setup lang="ts">
import { ref } from 'vue'

export interface Conversation {
  uuid: string
  title: string
  preview?: string
  createdAt?: Date
}

interface Props {
  conversations: Conversation[]
  activeUuid?: string
}

const props = withDefaults(defineProps<Props>(), {
  activeUuid: '',
})

const emit = defineEmits<{
  select: [uuid: string]
  rename: [uuid: string]
  duplicate: [uuid: string]
  delete: [uuid: string]
}>()

// ---------------------------------------------------------------------------
// Rename inline
// ---------------------------------------------------------------------------
const renamingUuid = ref<string | null>(null)
const renameValue = ref('')

function startRename(conv: Conversation) {
  renamingUuid.value = conv.uuid
  renameValue.value = conv.title
}

function confirmRename(uuid: string) {
  if (renameValue.value.trim()) emit('rename', uuid)
  renamingUuid.value = null
}
</script>

<template>
  <div class="conversation-list fixed flex flex-col gap-2 w-full font-mono">
    <!-- Header -->
    <div class="flex items-center justify-between px-1 mb-1">
      <span class="text-[10px] tracking-[0.2em] text-cyan-500/70 uppercase font-semibold">
        ⬡ Conversations
        <span class="ml-2 text-cyan-400/50">({{ conversations.length }})</span>
      </span>
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
      @click="emit('select', conv.uuid)"
    >
      <!-- Accent bar gauche -->
      <div
        class="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-sm transition-all duration-200"
        :class="
          activeUuid === conv.uuid ? 'bg-cyan-400' : 'bg-transparent group-hover:bg-cyan-700/50'
        "
      />

      <!-- Icône -->
      <span class="text-cyan-500/70 text-sm shrink-0 select-none">◆</span>

      <!-- Contenu -->
      <div class="flex-1 min-w-0">
        <!-- Titre (éditable en mode rename) -->
        <input
          v-if="renamingUuid === conv.uuid"
          v-model="renameValue"
          class="w-full bg-transparent border-b border-cyan-400 text-cyan-100 text-sm outline-none pb-px"
          autofocus
          @blur="confirmRename(conv.uuid)"
          @keydown.enter.prevent="confirmRename(conv.uuid)"
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
          {{ conv.title }}
        </div>

        <!-- Preview -->
        <div
          v-if="conv.preview && renamingUuid !== conv.uuid"
          class="text-[11px] text-slate-500 truncate mt-0.5 group-hover:text-slate-400 transition-colors"
        >
          {{ conv.preview }}
        </div>
      </div>

      <!-- Actions (visibles au hover) -->
      <div
        class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 shrink-0"
        @click.stop
      >
        <!-- Renommer -->
        <button class="action-btn" title="Renommer" @click="startRename(conv)">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            class="size-3"
          >
            <path
              d="M13.488 2.513a1.75 1.75 0 0 0-2.475 0L6.75 6.774a2.75 2.75 0 0 0-.596.892l-.848 2.047a.75.75 0 0 0 .98.98l2.047-.848a2.75 2.75 0 0 0 .892-.596l4.261-4.262a1.75 1.75 0 0 0 0-2.474Z"
            />
            <path
              d="M4.75 3.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h6.5c.69 0 1.25-.56 1.25-1.25V9A.75.75 0 0 1 14 9v2.25A2.75 2.75 0 0 1 11.25 14h-6.5A2.75 2.75 0 0 1 2 11.25v-6.5A2.75 2.75 0 0 1 4.75 2H7a.75.75 0 0 1 0 1.5H4.75Z"
            />
          </svg>
        </button>

        <!-- Dupliquer -->
        <button class="action-btn" title="Dupliquer" @click="emit('duplicate', conv.uuid)">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            class="size-3"
          >
            <path
              d="M2 4.75A2.75 2.75 0 0 1 4.75 2h4a2.75 2.75 0 0 1 2.739 2.479.75.75 0 1 1-1.492.166A1.25 1.25 0 0 0 8.75 3.5h-4A1.25 1.25 0 0 0 3.5 4.75v4a1.25 1.25 0 0 0 1.145 1.243.75.75 0 1 1-.166 1.492A2.75 2.75 0 0 1 2 8.75v-4Z"
            />
            <path
              d="M7.25 6A2.75 2.75 0 0 0 4.5 8.75v4A2.75 2.75 0 0 0 7.25 15.5h4A2.75 2.75 0 0 0 14 12.75v-4A2.75 2.75 0 0 0 11.25 6h-4Z"
            />
          </svg>
        </button>

        <!-- Supprimer -->
        <button
          class="action-btn hover:text-red-400 hover:border-red-500/40 hover:bg-red-950/30"
          title="Supprimer"
          @click="emit('delete', conv.uuid)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            class="size-3"
          >
            <path
              fill-rule="evenodd"
              d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.conversation-list {

}

.action-btn {

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
