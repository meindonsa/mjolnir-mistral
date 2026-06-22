import { defineStore } from 'pinia'
import { readonly, ref } from 'vue'
import type { Chat } from '@/core/api/models.ts'

export const useConfigStore = defineStore('chat', () => {
  const chats = ref<Chat[]>([]);
  const currentChat = ref<Chat | null>(null);
  
  return {
    chats: readonly(chats),
    currentChat: readonly(currentChat),
  }
})