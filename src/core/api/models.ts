import type { MessageItem } from '@/core/api/mistral.ts'

export interface Chat{
  id: string;
  name: string;
  updateAt?: Date;
  conversations: MessageItem[]
}