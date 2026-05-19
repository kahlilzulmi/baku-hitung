<template>
  <div
    class="player-panel relative flex flex-col h-full w-full overflow-visible px-3 py-2"
    :class="[bgClass, panelInsetClass]"
    data-player-panel
    :data-panel="panelDataAttr"
    :style="player === 1 && !practiceMode ? 'transform: rotate(180deg)' : ''"
  >
    <div class="flex justify-between items-center flex-shrink-0">
      <span class="text-sm font-bold opacity-60">{{ displayName }}</span>
      <span class="text-sm font-bold px-2 py-0.5 rounded-full level-badge" :class="levelBadgeClass">
        Lvl {{ level }}
      </span>
    </div>

    <MomentumIndicator
      v-if="showMomentum"
      class="mt-1.5 flex-shrink-0"
      :momentum="momentum"
    />

    <div
      v-if="practiceMode"
      class="flex h-32 flex-col items-center justify-start gap-2 pt-3"
    >
      <p
        class="text-2xl font-extrabold tracking-wide text-center leading-tight px-2"
        aria-live="polite"
        aria-atomic="true"
        :aria-label="t('a11y.question', { text: question.text })"
      >
        {{ question.text }} =
      </p>

      <div
        class="answer-box rounded-xl text-center px-6 py-1 text-2xl font-extrabold tracking-widest
               min-w-[110px] shadow-inner"
        :class="[answerBoxClass, shakeActive ? 'shake' : '']"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        :aria-label="answerAriaLabel"
      >
        {{ input || '?' }}
      </div>

      <p
        v-if="showTimer"
        class="text-[10px] font-mono opacity-50 tabular-nums"
        aria-live="polite"
      >
        <span>{{ t('timerMs', { ms: elapsedMs }) }}</span>
        <span v-if="lastResponseMs != null" class="ml-2">
          {{ t('timerLast', { ms: lastResponseMs }) }}
        </span>
      </p>
    </div>

    <div
      v-if="practiceMode"
      class="relative z-0 mx-auto mt-[220px] mr-[38px] mb-[max(2rem,env(safe-area-inset-bottom,0px))]
             w-full max-w-[280px] flex-shrink-0"
    >
      <NumericKeypad
        :color-class="keypadColorClass"
        :disabled="frozen || paused"
        @digit="(d) => $emit('digit', d)"
        @backspace="$emit('backspace')"
      />
    </div>

    <div
      v-else
      class="player-panel__duel-play flex min-h-0 flex-1 flex-col items-center justify-center gap-2"
    >
      <p
        class="text-2xl font-extrabold tracking-wide text-center leading-tight px-2"
        aria-live="polite"
        aria-atomic="true"
        :aria-label="t('a11y.question', { text: question.text })"
      >
        {{ question.text }} =
      </p>

      <div
        class="answer-box rounded-xl text-center px-6 py-1 text-2xl font-extrabold tracking-widest
               min-w-[110px] shadow-inner"
        :class="[answerBoxClass, shakeActive ? 'shake' : '']"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        :aria-label="answerAriaLabel"
      >
        {{ input || '?' }}
      </div>

      <p
        v-if="showTimer"
        class="text-[10px] font-mono opacity-50 tabular-nums"
        aria-live="polite"
      >
        <span>{{ t('timerMs', { ms: elapsedMs }) }}</span>
        <span v-if="lastResponseMs != null" class="ml-2">
          {{ t('timerLast', { ms: lastResponseMs }) }}
        </span>
      </p>

      <div class="relative z-0 mx-auto w-full max-w-[280px] flex-shrink-0 pb-0.5">
        <NumericKeypad
          :color-class="keypadColorClass"
          :disabled="frozen || paused"
          @digit="(d) => $emit('digit', d)"
          @backspace="$emit('backspace')"
        />
      </div>
    </div>

    <GameFeedbackOverlay
      v-if="showPanelOverlay"
      :placement="practiceMode ? 'practice' : 'panel'"
      :player="player"
      :level="level"
      :frozen="frozen"
      :practice-mode="practiceMode"
      :scored-player="scoredPlayer"
      :round-winner="roundWinner"
      :current-quote="currentQuote"
      :opponent-name="opponentName"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import NumericKeypad from './NumericKeypad.vue'
import MomentumIndicator from './MomentumIndicator.vue'
import GameFeedbackOverlay from './GameFeedbackOverlay.vue'
import { useA11yPrefs } from '../composables/useA11yPrefs.js'

const { t } = useI18n()
const { prefersReducedMotion } = useA11yPrefs()

const props = defineProps({
  player:          { type: Number,  required: true },
  displayName:     { type: String,  default: '' },
  level:           { type: Number,  required: true },
  momentum:        { type: Number,  required: true },
  showMomentum:    { type: Boolean, default: true },
  practiceMode:    { type: Boolean, default: false },
  question:        { type: Object,  required: true },
  input:           { type: String,  required: true },
  frozen:          { type: Boolean, default: false },
  paused:          { type: Boolean, default: false },
  scoredPlayer:    { type: Number,  default: null },
  roundWinner:     { type: Number,  default: null },
  currentQuote:    { type: Object,  default: null },
  shake:           { type: Boolean, default: false },
  showTimer:       { type: Boolean, default: false },
  elapsedMs:       { type: Number,  default: 0 },
  lastResponseMs:  { type: Number,  default: null },
  opponentName:    { type: String,  default: '' },
  duelOverlayExternal: { type: Boolean, default: false },
})

defineEmits(['digit', 'backspace'])

const displayName = computed(() =>
  props.displayName || t('player', { n: props.player }),
)
const isRed = computed(() => props.player === 1)

const panelDataAttr = computed(() => {
  if (props.practiceMode) return 'practice'
  return isRed.value ? 'p1' : 'p2'
})

const panelInsetClass = computed(() => {
  if (props.practiceMode) return 'player-panel--practice'
  return props.player === 1 ? 'player-panel--p1' : 'player-panel--p2'
})

const shakeActive = computed(() => props.shake && !prefersReducedMotion.value)

const answerAriaLabel = computed(() =>
  props.input
    ? t('a11y.answerValue', { value: props.input })
    : t('a11y.answerEmpty'),
)

const bgClass = computed(() => {
  if (props.practiceMode) return 'bg-blue-100 text-blue-900'
  return isRed.value ? 'bg-red-100 text-red-900' : 'bg-blue-100 text-blue-900'
})
const levelBadgeClass = computed(() =>
  isRed.value && !props.practiceMode
    ? 'bg-red-200 text-red-800'
    : 'bg-blue-200 text-blue-800',
)
const answerBoxClass = computed(() =>
  isRed.value && !props.practiceMode
    ? 'bg-red-200 text-red-900'
    : 'bg-blue-200 text-blue-900',
)
const keypadColorClass = computed(() =>
  isRed.value && !props.practiceMode
    ? 'bg-red-300 hover:bg-red-400 active:bg-red-500 text-red-900'
    : 'bg-blue-300 hover:bg-blue-400 active:bg-blue-500 text-blue-900',
)

const showPanelOverlay = computed(() =>
  props.frozen && !props.duelOverlayExternal,
)

</script>
