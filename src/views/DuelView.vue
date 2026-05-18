<template>
  <div class="relative flex flex-col h-screen w-screen overflow-hidden">
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

    <div
      class="relative z-30 flex-shrink-0 flex items-center justify-center gap-2
             py-2 bg-gray-300 border-y border-gray-400"
      role="toolbar"
      :aria-label="t('duel.toolbar')"
    >
      <HoldPressButton
        size="sm"
        :aria-label="t('backToLobby')"
        @activate="$emit('exit')"
      >
        {{ t('backToLobby') }}
      </HoldPressButton>

      <HoldPressButton
        size="sm"
        :aria-label="t('exportSession')"
        @activate="exportSession"
      >
        {{ t('exportSession') }}
      </HoldPressButton>

      <HoldPressButton
        v-if="isFullscreenSupported"
        size="icon"
        :aria-label="isFullscreen ? t('fullscreen.exit') : t('fullscreen.enter')"
        @activate="toggleFullscreen"
      >
        <Minimize v-if="isFullscreen" class="w-4 h-4" aria-hidden="true" />
        <Maximize v-else class="w-4 h-4" aria-hidden="true" />
      </HoldPressButton>
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
import { Maximize, Minimize } from 'lucide-vue-next'
import PlayerPanel from '../components/PlayerPanel.vue'
import HoldPressButton from '../components/HoldPressButton.vue'
import { useGameState } from '../composables/useGameState.js'
import { useFullscreen } from '../composables/useFullscreen.js'
import { downloadSessionExport } from '../domain/learningStore.js'

const props = defineProps({
  session: { type: Object, required: true },
})

defineEmits(['exit'])

const { t } = useI18n()
const { isSupported: isFullscreenSupported, isFullscreen, toggle: toggleFullscreen } = useFullscreen()

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
