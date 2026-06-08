<script setup lang="ts">
import Sidebar from '@/pages/views/Sidebar.vue'
import { ref } from 'vue'

const sideOpened = ref(false)
/*
ONLINE
Model
API KEY
LOGOUT
 */
</script>

<template>
  <header
    class="top-0 z-50 bg-[#050d18]/95 border-b border-[#1a3455]/50 backdrop-blur-xl h-14 flex items-center px-4 shadow-lg"
  >
    <div class="flex items-center gap-3 shrink-0">
      <!-- Logo -->
      <div class="w-9 h-9 flex items-center justify-center">
        <svg viewBox="0 0 36 36" class="w-9 h-9 drop-shadow-[0_0_8px_#00e5ff]">
          <polygon
            points="18,2 34,12 34,24 18,34 2,24 2,12"
            fill="none"
            stroke="#00e5ff"
            stroke-width="1.5"
            opacity="0.6"
          />
          <circle cx="18" cy="18" r="4" fill="#00e5ff" />
        </svg>
      </div>
      <div>
        <div
          class="text-2xl font-black tracking-[4px] text-white"
          style="font-family: 'Orbitron', sans-serif"
        >
          VOANH
        </div>
        <div class="text-[10px] text-cyan-400 tracking-[2px] -mt-1 font-mono">PERSONAL AI v3.0</div>
      </div>
    </div>

    <!-- Right side -->
    <div class="flex items-center gap-2 ml-auto">
      <div
        class="px-3 py-1 bg-[#091525] border border-[#1a3455] rounded-md text-xs font-mono flex items-center gap-1.5"
      >
        <div class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
        ONLINE
      </div>
      <button class="hud-btn" @click="sideOpened = true">⚙️</button>
    </div>
  </header>

  <Teleport to="body">
    <Transition name="slide-fade" mode="out-in" appear>
      <Sidebar v-if="sideOpened" @onClose="sideOpened = false" />
    </Transition>
  </Teleport>
</template>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.2s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
