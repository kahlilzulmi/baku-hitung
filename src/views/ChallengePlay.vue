<template>
  <div class="flex-1 flex flex-col overflow-hidden">
    <PlayerPanel
      :player="1"
      :display-name="playerName"
      :level="5"
      :momentum="0"
      :show-momentum="false"
      :practice-mode="true"
      :question="currentQuestion"
      :input="input"
      :frozen="frozen"
      :scored-player="frozen ? 1 : null"
      :shake="shake"
      :show-timer="true"
      :elapsed-ms="questionElapsedMs"
      class="flex-1"
      @digit="appendDigit"
      @backspace="backspace"
    />
    <p class="text-center text-xs font-bold text-slate-500 py-1 flex-shrink-0">{{ progress }}</p>
  </div>
</template>

<script setup>
import { watch } from 'vue'
import PlayerPanel from '../components/PlayerPanel.vue'
import { useChallengeState } from '../composables/useChallengeState.js'

const props = defineProps({
  seed: { type: String, required: true },
  playerName: { type: String, required: true },
})

const emit = defineEmits(['finished'])

const {
  input,
  frozen,
  shake,
  finished,
  currentQuestion,
  progress,
  questionElapsedMs,
  appendDigit,
  backspace,
} = useChallengeState(props.seed, props.playerName)

watch(finished, (v) => {
  if (v) emit('finished')
})
</script>
