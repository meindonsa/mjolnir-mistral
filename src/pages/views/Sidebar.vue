<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useConfigStore } from '@/core/stores/config.ts'

const useConfig = useConfigStore()
const showModels = ref(false)
const aiName = ref(useConfig.aiName)
const models = computed(() => useConfig.models)
const model = ref<string>('mistral-medium-2508')
const nameCheck = computed(() => aiName.value == useConfig.aiName)
const emit = defineEmits(['onClose'])

const close = () => {
  emit('onClose')
}

const selectModel = (id: string) => {
  model.value = id
}

onMounted(() => {
  useConfig.getModels()
})

function getBoolean(value: boolean) {
  return value ? 'Oui' : 'Non'
}

const saveAiName = () => {
  useConfig.updateAiName(aiName.value)
}
</script>

<template>
  <div
    class="z-100 w-[50vw] px-5 py-3 h-[calc(100vh-5rem)] fixed top-0 right-0 bg-[#050d18]/95 border-b border-[#1a3455]/50 backdrop-blur-xl"
  >
    <div class="flex items-center justify-between mb-1">
      <span class="text-md tracking-[0.2em] text-cyan-500/70 uppercase font-semibold">
        ⬡ Paramètre
      </span>
      <div @click="close" class="close-modal-btn">X</div>
    </div>

    <div class="w-full mt-10">
      <!-- MODELS -->
      <div class="border border-[#1a3455]/60 rounded-md p-3 mb-5">
        <div
          @click="showModels = !showModels"
          :class="showModels ? 'border-b border-[#1a3455]/60 mb-3' : ''"
          class="flex justify-between items-center cursor-pointer"
        >
          <h5 class="text-lg font-semibold text-white text-heading">Models</h5>
          <h5 class="text-lg font-semibold text-white text-heading cursor-pointer transition-all">
            <Transition mode="out-in" :duration="200" appear>
              <button v-if="showModels">-</button>
              <button v-else>+</button>
            </Transition>
          </h5>
        </div>
        <Transition mode="out-in" name="model">
          <ul
            v-if="showModels"
            role="list"
            class="divide-y divide-default overflow-auto max-h-[20vh]"
          >
            <li v-for="item of models" class="pb-4 sm:pb-4">
              <div class="flex items-center gap-2">
                <div class="shrink-0"></div>
                <div class="flex-1 min-w-0">
                  <p class="font-medium text-gray-200 truncate">{{ item.name }}</p>
                  <p class="text-xs truncate text-gray-500">
                    <span class="font-mono">
                      <span class="text-cyan-500/70">Max: </span>
                      {{ item.maxContextLength }}
                    </span>
                    <span> - </span>
                    <span>
                      <span class="text-cyan-500/70">Audio: </span>
                      {{ getBoolean(item.capabilities.audio) }}
                    </span>
                  </p>
                </div>
                <div class="inline-flex items-center space-x-1.5">
                  <button
                    type="button"
                    @click="selectModel(item.id)"
                    :class="model === item.id ? 'bg-cyan-500' : 'text-gray-600'"
                    class="cursor-pointer transition-all bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-0 shadow-xs font-medium leading-5 rounded-base text-xs px-3 py-1.5 focus:outline-none shrink-0"
                  >
                    Sélectionner
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </Transition>
      </div>

      <!-- API KEY -->
      <div class="border border-[#1a3455]/60 rounded-md p-3">
        <h5 class="text-lg font-semibold text-white text-heading mb-3">Nom de votre IA</h5>
        <div class="flex items-center gap-2">
          <input
            type="text"
            v-model.trim="aiName"
            placeholder="Transmettez votre message…"
            class="flex-1 bg-[#091525] border border-[#1a3455] text-white focus:border-cyan-400 rounded-md px-5 py-3 text-sm resize-y min-h-11.5 max-h-40 outline-none transition-all"
          />
          <button
            :disabled="nameCheck"
            @click="saveAiName"
            class="w-11 h-11 bg-[#091525] border border-[#1a3455] text-white hover:border-cyan-400 rounded-md flex items-center justify-center text-xl transition-all cursor-pointer"
          >
            +
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.model-enter-active,
.model-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.model-enter-from,
.model-leave-to {
  max-height: 0;
  opacity: 0;
}

.model-enter-to,
.model-leave-from {
  max-height: 20vh;
  opacity: 1;
}
</style>
