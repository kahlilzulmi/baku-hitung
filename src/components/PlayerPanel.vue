<template>
  <div
    class="relative flex flex-col h-full w-full px-3 py-2"
    :class="bgClass"
    :style="player === 1 && !practiceMode ? 'transform: rotate(180deg)' : ''"
  >
    <Transition name="fade">
      <div
        v-if="frozen"
        class="absolute inset-0 flex flex-col items-center justify-center z-20 gap-1"
        :class="overlayBgClass"
      >
        <component :is="overlayIconComponent" class="w-14 h-14" />

        <span class="text-2xl font-black text-center px-4 leading-snug">
          {{ overlayTitle }}
        </span>

        <span
          v-if="roundWinner !== null"
          class="text-sm font-bold opacity-80"
        >
          {{ t('levelProgress', { from: level, to: level + 1 }) }}
        </span>

        <Transition name="quote-fade">
          <span
            v-if="roundWinner !== null && activeQuote"
            class="text-sm font-semibold text-center px-5 mt-1 leading-snug italic quote-pulse"
          >
            "{{ activeQuote }}"
          </span>
        </Transition>
      </div>
    </Transition>

    <div class="flex justify-between items-center flex-shrink-0">
      <span class="text-sm font-bold opacity-60">{{ displayName }}</span>
      <span class="text-sm font-bold px-2 py-0.5 rounded-full" :class="levelBadgeClass">
        Lvl {{ level }}
      </span>
    </div>

    <div
      v-if="showMomentum"
      class="flex items-center justify-center gap-1.5 mt-1.5 flex-shrink-0"
    >
      <div
        v-for="i in 5"
        :key="`p1-${i}`"
        class="w-4 h-4 rounded-full border-2 transition-all duration-300"
        :class="p1DotClass(i)"
      />
      <Zap class="w-3.5 h-3.5 mx-0.5 flex-shrink-0 opacity-30" />
      <div
        v-for="i in 5"
        :key="`p2-${i}`"
        class="w-4 h-4 rounded-full border-2 transition-all duration-300"
        :class="p2DotClass(i)"
      />
    </div>

    <div class="flex flex-col items-center flex-1 justify-center gap-2 min-h-0">
      <p class="text-2xl font-extrabold tracking-wide text-center leading-tight px-2">
        {{ question.text }} =
      </p>

      <div
        class="rounded-xl text-center px-6 py-1 text-2xl font-extrabold tracking-widest
               min-w-[110px] shadow-inner"
        :class="[answerBoxClass, shake ? 'shake' : '']"
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

    <div class="w-full max-w-[280px] mx-auto flex-shrink-0 pb-0.5">
      <NumericKeypad
        :color-class="keypadColorClass"
        :disabled="frozen"
        @digit="(d) => $emit('digit', d)"
        @backspace="$emit('backspace')"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Trophy, CheckCircle, Flame, PauseCircle, Zap } from 'lucide-vue-next'
import NumericKeypad from './NumericKeypad.vue'

const { t } = useI18n()

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
  scoredPlayer:    { type: Number,  default: null },
  roundWinner:     { type: Number,  default: null },
  currentQuote:    { type: Object,  default: null },
  shake:           { type: Boolean, default: false },
  showTimer:       { type: Boolean, default: false },
  elapsedMs:       { type: Number,  default: 0 },
  lastResponseMs:  { type: Number,  default: null },
  opponentName:    { type: String,  default: '' },
})

defineEmits(['digit', 'backspace'])

const displayName = computed(() =>
  props.displayName || t('player', { n: props.player }),
)
const isRed = computed(() => props.player === 1)

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

const isScoredMe = computed(() => props.frozen && props.scoredPlayer === props.player)
const isRoundWon = computed(() => props.frozen && props.roundWinner === props.player)
const isRoundLost = computed(() =>
  !props.practiceMode
  && props.frozen
  && props.roundWinner !== null
  && props.roundWinner !== props.player,
)

const overlayBgClass = computed(() => {
  if (isRoundWon.value) return 'bg-green-500/95 text-white'
  if (isRoundLost.value) return 'bg-gray-900/80 text-white'
  if (isScoredMe.value) return 'bg-green-400/90 text-white'
  return isRed.value && !props.practiceMode
    ? 'bg-red-200/75 text-red-900'
    : 'bg-blue-200/75 text-blue-900'
})

const overlayIconComponent = computed(() => {
  if (isRoundWon.value) return Trophy
  if (isRoundLost.value) return Flame
  if (isScoredMe.value) return CheckCircle
  return PauseCircle
})

const overlayTitle = computed(() => {
  if (isRoundWon.value) {
    return props.practiceMode ? t('overlay.levelUp') : t('overlay.roundWon')
  }
  if (isRoundLost.value) return t('overlay.roundLost')
  if (isScoredMe.value) return t('overlay.correct')
  if (props.frozen && props.scoredPlayer !== null && props.scoredPlayer !== props.player) {
    if (props.opponentName) {
      return t('overlay.opponentScoredNamed', { name: props.opponentName })
    }
    return t('overlay.opponentScored', { n: props.scoredPlayer })
  }
  return ''
})

const activeQuote = computed(() => {
  if (!props.currentQuote || props.roundWinner === null || props.practiceMode) return null
  return props.roundWinner === props.player
    ? props.currentQuote.winner
    : props.currentQuote.loser
})

function p1DotClass(i) {
  return props.momentum >= (6 - i)
    ? 'bg-red-500 border-red-500'
    : 'bg-transparent border-red-300'
}

function p2DotClass(i) {
  return props.momentum <= -i
    ? 'bg-blue-500 border-blue-500'
    : 'bg-transparent border-blue-300'
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }

.quote-fade-enter-active { transition: opacity 0.5s ease 0.3s; }
.quote-fade-enter-from { opacity: 0; }
.quote-fade-leave-active { transition: opacity 0.15s ease; }
.quote-fade-leave-to { opacity: 0; }

@keyframes quotePulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
.quote-pulse {
  animation: quotePulse 2s ease-in-out infinite;
}
</style>
