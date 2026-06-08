import { defineStore } from 'pinia'
import { ref } from 'vue'
import mistral, { type Model } from '@/core/api/mistral.ts'

export const useConfigStore = defineStore('config', () => {
  const models = ref<Model[]>([])

   function getModels() {
    if(models.value.length > 0) return;
    mistral.models.list().then(res => {
      models.value =
        res.data
          ?.filter((m: any) => !m.archived)
          .map((item: any) => ({
            name: item.name,
            id: item.id,
            root: item.root,
            maxContextLength: item.maxContextLength,
            capabilities: {
              audio: item.audio,
              audioSpeech: item.audioSpeech,
              audioTranscription: item.audioTranscription,
              audioTranscriptionRealtime: item.audioTranscriptionRealtime,
              completion_chat: item.completion_chat,
              completion_fim: item.completion_fim,
            },
          })) || []
      console.log(models.value);
    })
  }

  return {
     models,
    getModels,
  }
})