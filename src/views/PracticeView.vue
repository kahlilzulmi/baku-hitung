<template>
  <div class="relative h-screen w-screen overflow-hidden bg-blue-100">
    <button
      type="button"
      class="absolute top-2 left-2 z-40 px-2 py-1 text-[10px] font-bold rounded-full
             bg-white/90 text-gray-700 shadow border border-gray-300"
      @click="$emit('exit')"
    >
      {{ t('backToLobby') }}
    </button>

    <div class="absolute top-2 right-2 z-40 flex items-center gap-1.5">
      <FullscreenButton />
      <button
        type="button"
        class="px-2 py-1 text-[10px] font-bold rounded-full
               bg-white/90 text-gray-700 shadow border border-gray-300"
        :title="t('exportSession')"
        @click="exportSession"
      >
        {{ t('exportSession') }}
      </button>
    </div>

    <PlayerPanel
      :player="1"
      :display-name="playerDisplay"
      :level="level"
      :momentum="0"
      :show-momentum="false"
      :practice-mode="true"
      :question="currentQuestion"
      :input="input1"
      :frozen="frozen"
      :scored-player="scoredPlayer"
      :round-winner="roundWinner"
      :shake="shake1"
      :show-timer="showTimer"
      :elapsed-ms="questionElapsedMs"
      :last-response-ms="lastResponseMs"
      class="h-full"
      @digit="(d) => appendDigit(1, d)"
      @backspace="backspace(1)"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import PlayerPanel from '../components/PlayerPanel.vue'
import FullscreenButton from '../components/FullscreenButton.vue'
import { useGameState } from '../composables/useGameState.js'
import { downloadSessionExport } from '../domain/learningStore.js'

const props = defineProps({
  session: { type: Object, required: true },
})

defineEmits(['exit'])

const { t } = useI18n()

const playerDisplay = computed(() =>
  props.session.player1Name ?? t('player', { n: 1 }),
)

const {
  sessionId,
  level,
  input1,
  frozen,
  scoredPlayer,
  roundWinner,
  shake1,
  currentQuestion,
  showTimer,
  questionElapsedMs,
  lastResponseMs,
  appendDigit,
  backspace,
} = useGameState({ ...props.session, playMode: 'practice' })

function exportSession() {
  downloadSessionExport(sessionId)
}
</script>
