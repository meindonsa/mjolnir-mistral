<script setup lang="ts">
import { Role, type MessageItem } from '@/core/api/mistral.ts'
import Markdownrenderer from '@/components/Markdownrenderer.vue'

withDefaults(
  defineProps<{
    message: MessageItem
    streaming?: boolean
  }>(),
  {
    message: () => ({
      uuid: '',
      content: '',
      role: Role.user,
    }),
    streaming: false,
  },
)
</script>

<template>
  <div class="message" :class="message?.role == 'user' ? 'user' : 'assistant'">
    <div class="msg-label">▸ {{ message?.role == 'user' ? 'Vous' : 'VOANH' }}</div>
    <div class="message-content">
      <Markdownrenderer :content="message.content" :streaming="streaming" />
    </div>
  </div>
</template>

<style scoped>
.message {
  max-width: 82%;
  padding: 14px 18px;
  border-radius: 12px;
  line-height: 1.65;
  position: relative;
  animation: msgIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.message.user {
  align-self: flex-end;
  background: linear-gradient(135deg, rgba(0, 229, 255, 0.12), rgba(0, 255, 157, 0.06));
  border: 1px solid rgba(0, 229, 255, 0.3);
  border-bottom-right-radius: 3px;
  color: #e8f4ff;
  box-shadow: 0 4px 20px rgba(0, 229, 255, 0.1);
}

.message.assistant {
  align-self: flex-start;
  background: #091525;
  border: 1px solid #1a3455;
  border-bottom-left-radius: 0;
  border-left: 2px solid rgba(0, 229, 255, 0.3);
}
</style>
