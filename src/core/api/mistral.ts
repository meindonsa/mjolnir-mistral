import { Mistral } from '@mistralai/mistralai'

const apiKey = import.meta.env.VITE_MISTRAL_API_KEY || 'your_api_key'

const client = new Mistral({ apiKey: apiKey })

export default client;

export interface Message {
  role: Role
  content: string
}

export interface MessageItem extends Message{
  uuid: string;
}

export enum Role {
  user = 'user',
  assistant = 'assistant',
  system = 'system',
}

export interface Model {
  id: string
  name: string
  root: string
  maxContextLength: number,
  capabilities: {
    audio: boolean
    audioSpeech: boolean
    audioTranscription: boolean
    audioTranscriptionRealtime: boolean
    completion_chat: boolean
    completion_fim: boolean
  }
}