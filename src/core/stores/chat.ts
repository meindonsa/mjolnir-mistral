import { defineStore } from 'pinia'
import { readonly, ref } from 'vue'
import  { type Chat, fakeChats } from '@/core/api/models.ts'

export const useChatStore = defineStore('chat', () => {
  const loading = ref(false);
  const chats = ref<Chat[]>(fakeChats)
  const currentChat = ref<Chat | null>(null);

  const renameChat = (uuid: string, name: string ) => {
    chats.value = chats.value.map((item) => {
      if (item.uuid == uuid) {
        return {
          ...item,
          name: name,
        }
      } else return item
    })
  }

  const selectChat = (uuid: string) => {
    currentChat.value = chats.value.find((item)=> item.uuid==uuid) || null;
  }

  const removeChat = (uuid: string) => {
    chats.value = chats.value.filter((item) => item.uuid != uuid);
    if(currentChat.value && currentChat.value.uuid == uuid){
      newChat()
    }
  }

  const newChat = () => {}

  return {
    chats: readonly(chats),
    loading: readonly(loading),
    currentChat: readonly(currentChat),
    selectChat,
    renameChat,
    removeChat,
  }
})