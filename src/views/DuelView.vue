<template>
  <div class="relative flex flex-col h-screen w-screen overflow-hidden">
    <button
      type="button"
      class="absolute top-2 left-2 z-40 px-2 py-1 text-[10px] font-bold rounded-full
             bg-white/90 text-gray-700 shadow border border-gray-300"
      @click="$emit('exit')"
    >
      {{ t('backToLobby') }}
    </button>

    <div class="flex-1 overflow-hidden">
      <PlayerPanel
        :player="1"
        :display-name="player1Display"
        :level="level"
        :momentum="momentum"
        :show-momentum="true"
        :question="currentQuestion"
        :input="input1"
        :frozen="frozen"
        :scored-player="scoredPlayer"
        :round-winner="roundWinner"
        :current-quote="currentQuote"
        :shake="shake1"
        :show-timer="showTimer"
        :elapsed-ms="questionElapsedMs"
        :last-response-ms="lastResponseMs"
        :opponent-name="player2Display"
        @digit="(d) => appendDigit(1, d)"
        @backspace="backspace(1)"
      />
    </div>

    <div class="relative h-1 bg-gray-400 flex-shrink-0 z-30">
      <button
        type="button"
        class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
               px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide
               rounded-full bg-white text-gray-700 shadow border border-gray-300
               hover:bg-gray-50 active:bg-gray-100"
        :title="t('exportSession')"
        @click="exportSession"
      >
        {{ t('exportSession') }}
      </button>
    </div>

    <div class="flex-1 overflow-hidden">
      <PlayerPanel
        :player="2"
        :display-name="player2Display"
        :level="level"
        :momentum="momentum"
        :show-momentum="true"
        :question="currentQuestion"
        :input="input2"
        :frozen="frozen"
        :scored-player="scoredPlayer"
        :round-winner="roundWinner"
        :current-quote="currentQuote"
        :shake="shake2"
        :show-timer="showTimer"
        :elapsed-ms="questionElapsedMs"
        :last-response-ms="lastResponseMs"
        :opponent-name="player1Display"
        @digit="(d) => appendDigit(2, d)"
        @backspace="backspace(2)"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import PlayerPanel from '../components/PlayerPanel.vue'
import { useGameState } from '../composables/useGameState.js'
import { downloadSessionExport } from '../domain/learningStore.js'

const props = defineProps({
  session: { type: Object, required: true },
})

defineEmits(['exit'])

const { t } = useI18n()

const player1Display = computed(() =>
  props.session.player1Name ?? t('player', { n: 1 }),
)
const player2Display = computed(() =>
  props.session.player2Name ?? t('player', { n: 2 }),
)

const {
  sessionId,
  level,
  momentum,
  input1,
  input2,
  frozen,
  scoredPlayer,
  roundWinner,
  currentQuote,
  shake1,
  shake2,
  currentQuestion,
  showTimer,
  questionElapsedMs,
  lastResponseMs,
  appendDigit,
  backspace,
} = useGameState(props.session)

function exportSession() {
  downloadSessionExport(sessionId)
}
</script>
