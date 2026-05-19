<template>
  <Transition name="fade">
    <div
      v-if="frozen"
      :class="[rootClass, bgClass]"
      role="status"
      aria-live="assertive"
    >
      <div
        class="flex flex-col items-center justify-center gap-1 px-4"
        :class="innerClass"
      >
        <component :is="iconComponent" class="h-14 w-14" aria-hidden="true" />

        <span class="text-center text-2xl font-black leading-snug">
          {{ title }}
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
            class="mt-1 px-5 text-center text-sm font-semibold italic leading-snug"
            :class="{ 'quote-pulse': !prefersReducedMotion }"
          >
            "{{ activeQuote }}"
          </span>
        </Transition>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Trophy, CheckCircle, Flame, PauseCircle } from 'lucide-vue-next'
import { useA11yPrefs } from '../composables/useA11yPrefs.js'

const props = defineProps({
  player:         { type: Number,  required: true },
  level:          { type: Number,  required: true },
  frozen:         { type: Boolean, default: false },
  practiceMode:   { type: Boolean, default: false },
  scoredPlayer:   { type: Number,  default: null },
  roundWinner:    { type: Number,  default: null },
  currentQuote:   { type: Object,  default: null },
  opponentName:   { type: String,  default: '' },
  /** practice | panel | duel-p1 | duel-p2 */
  placement:      { type: String,  default: 'panel' },
})

const { t } = useI18n()
const { prefersReducedMotion } = useA11yPrefs()

const isRed = computed(() => props.player === 1)

const isScoredMe = computed(() => props.frozen && props.scoredPlayer === props.player)
const isRoundWon = computed(() => props.frozen && props.roundWinner === props.player)
const isRoundLost = computed(() =>
  !props.practiceMode
  && props.frozen
  && props.roundWinner !== null
  && props.roundWinner !== props.player,
)

const rootClass = computed(() => {
  switch (props.placement) {
    case 'practice':
      return 'fixed inset-0 z-50 flex items-center justify-center'
    case 'duel-p1':
      return 'duel-zone__overlay duel-zone__overlay--p1'
    case 'duel-p2':
      return 'duel-zone__overlay duel-zone__overlay--p2'
    default:
      return 'absolute inset-0 z-50 flex items-center justify-center'
  }
})

const isDuelZone = computed(() =>
  props.placement === 'duel-p1' || props.placement === 'duel-p2',
)

const innerClass = computed(() =>
  props.placement === 'duel-p1' ? 'duel-zone__overlay-inner' : '',
)

const bgClass = computed(() => {
  if (isRoundWon.value) return 'bg-green-500/95 text-white'
  if (isRoundLost.value) return 'bg-gray-900/95 text-white'
  if (isScoredMe.value) return 'bg-green-400/95 text-white'
  const tint = isRed.value ? 'bg-red-200/90 text-red-900' : 'bg-blue-200/90 text-blue-900'
  if (isDuelZone.value) return tint
  return isRed.value && !props.practiceMode
    ? 'bg-red-200/75 text-red-900'
    : 'bg-blue-200/75 text-blue-900'
})

const iconComponent = computed(() => {
  if (isRoundWon.value) return Trophy
  if (isRoundLost.value) return Flame
  if (isScoredMe.value) return CheckCircle
  return PauseCircle
})

const title = computed(() => {
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
