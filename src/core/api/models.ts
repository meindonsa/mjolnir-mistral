import type { MessageItem } from '@/core/api/mistral.ts'

export interface Chat {
  uuid: string
  name: string
  updateAt?: Date
  conversations?: MessageItem[]
}

export interface ChatProps {
  activeUuid?: string | any
}

export interface Conversation {
  uuid: string
  title: string
  preview?: string
  createdAt?: Date
}

export const fakeChats: Chat[] = [
  {
    uuid: '1',
    name: 'Conversation 1',
    updateAt: new Date(),
    conversations: [],
  },
]