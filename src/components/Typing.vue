<script setup lang="ts"></script>

<template>
  <div class="typing-indicator" id="typing-indicator">
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
  </div>
</template>

<style scoped>
.typing-indicator {
  align-self: flex-start;
  background: #091525;
  border: var(--border);
  border-left: 2px solid rgba(0, 229, 255, 0.3);
  padding: 14px 18px;
  border-radius: var(--r-lg);
  border-bottom-left-radius: 3px;
  display: flex;
  align-items: center;
  gap: 5px;
  animation: msgIn 0.25s ease;
}
.typing-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: white;
  animation: typingBounce 1.2s infinite;
}
.typing-dot:nth-child(2) {
  animation-delay: 0.2s;
}
.typing-dot:nth-child(3) {
  animation-delay: 0.4s;
}
@keyframes typingBounce {
  0%,
  80%,
  100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  40% {
    transform: translateY(-5px);
    opacity: 1;
  }
}
</style>
