<template>
  <div class="duel-shell flex min-h-0 flex-col overflow-hidden">
    <div class="duel-zone duel-zone--p1">
      <div class="flex min-h-0 flex-1 flex-col overflow-hidden">
        <PlayerPanel
          :player="1"
          :display-name="player1Display"
          :level="level"
          :momentum="momentum"
          :show-momentum="false"
          :question="currentQuestion"
          :input="input1"
          :frozen="frozen"
          :paused="duelPaused"
          :scored-player="scoredPlayer"
          :round-winner="roundWinner"
          :current-quote="currentQuote"
          :shake="shake1"
          :show-timer="showTimer"
          :elapsed-ms="questionElapsedMs"
          :last-response-ms="lastResponseMs"
          :opponent-name="player2Display"
          duel-overlay-external
          @digit="(d) => appendDigit(1, d)"
          @backspace="backspace(1)"
        />
      </div>
      <GameFeedbackOverlay
        v-if="duelZoneOverlay(1)"
        placement="duel-p1"
        :player="1"
        :level="level"
        :frozen="frozen"
        :scored-player="scoredPlayer"
        :round-winner="roundWinner"
        :current-quote="currentQuote"
        :opponent-name="player2Display"
      />
    </div>

    <DuelCenterBar
      v-model:open="duelPaused"
      :momentum="momentum"
      @exit="$emit('exit')"
      @export="exportSession"
    />

    <div class="duel-zone duel-zone--p2">
      <div class="flex min-h-0 flex-1 flex-col overflow-hidden">
        <PlayerPanel
          :player="2"
          :display-name="player2Display"
          :level="level"
          :momentum="momentum"
          :show-momentum="false"
          :question="currentQuestion"
          :input="input2"
          :frozen="frozen"
          :paused="duelPaused"
          :scored-player="scoredPlayer"
          :round-winner="roundWinner"
          :current-quote="currentQuote"
          :shake="shake2"
          :show-timer="showTimer"
          :elapsed-ms="questionElapsedMs"
          :last-response-ms="lastResponseMs"
          :opponent-name="player1Display"
          duel-overlay-external
          @digit="(d) => appendDigit(2, d)"
          @backspace="backspace(2)"
        />
      </div>
      <GameFeedbackOverlay
        v-if="duelZoneOverlay(2)"
        placement="duel-p2"
        :player="2"
        :level="level"
        :frozen="frozen"
        :scored-player="scoredPlayer"
        :round-winner="roundWinner"
        :current-quote="currentQuote"
        :opponent-name="player1Display"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import PlayerPanel from '../components/PlayerPanel.vue'
import GameFeedbackOverlay from '../components/GameFeedbackOverlay.vue'
import DuelCenterBar from '../components/DuelCenterBar.vue'
import { useGameState } from '../composables/useGameState.js'
import { downloadSessionExport } from '../domain/learningStore.js'

const props = defineProps({
  session: { type: Object, required: true },
})

defineEmits(['exit'])

const { t } = useI18n()
const duelPaused = ref(false)

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

function duelZoneOverlay(player) {
  if (!frozen.value) return false
  if (roundWinner.value === player) return true
  if (roundWinner.value !== null && roundWinner.value !== player) return true
  if (scoredPlayer.value === player) return true
  if (scoredPlayer.value !== null && scoredPlayer.value !== player) return true
  return false
}

function exportSession() {
  downloadSessionExport(sessionId)
}
</script>
