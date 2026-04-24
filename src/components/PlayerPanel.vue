<template>
  <div
    class="relative flex flex-col h-full w-full px-3 py-2"
    :class="bgClass"
    :style="player === 1 ? 'transform: rotate(180deg)' : ''"
  >
    <!-- ── Scoring / Round-Win Overlay ─────────────────────────────────── -->
    <Transition name="fade">
      <div
        v-if="frozen"
        class="absolute inset-0 flex flex-col items-center justify-center z-20 gap-1"
        :class="overlayBgClass"
      >
        <!-- Icon -->
        <component :is="overlayIconComponent" class="w-14 h-14" />

        <!-- Title -->
        <span class="text-2xl font-black text-center px-4 leading-snug">
          {{ overlayTitle }}
        </span>

        <!-- Level progression line (round end only) -->
        <span
          v-if="roundWinner !== null"
          class="text-sm font-bold opacity-80"
        >
          Level {{ level }} → {{ level + 1 }}
        </span>

        <!-- Motivational quote (round end only) -->
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

    <!-- ── Header: player name + level badge ───────────────────────────── -->
    <div class="flex justify-between items-center flex-shrink-0">
      <span class="text-sm font-bold opacity-60">{{ playerLabel }}</span>
      <span class="text-sm font-bold px-2 py-0.5 rounded-full" :class="levelBadgeClass">
        Lvl {{ level }}
      </span>
    </div>

    <!-- ── Tug-of-War Momentum Gauge ───────────────────────────────────── -->
    <!--
      Left  5 dots = Player 1 (red)  – fill right→left as momentum → +5
      Right 5 dots = Player 2 (blue) – fill left→right as momentum → -5
    -->
    <div class="flex items-center justify-center gap-1.5 mt-1.5 flex-shrink-0">
      <div
        v-for="i in 5"
        :key="`p1-${i}`"
        class="w-4 h-4 rounded-full border-2 transition-all duration-300"
        :class="p1DotClass(i)"
      ></div>
      <Zap class="w-3.5 h-3.5 mx-0.5 flex-shrink-0 opacity-30" />
      <div
        v-for="i in 5"
        :key="`p2-${i}`"
        class="w-4 h-4 rounded-full border-2 transition-all duration-300"
        :class="p2DotClass(i)"
      ></div>
    </div>

    <!-- ── Question + Answer display ──────────────────────────────────── -->
    <div class="flex flex-col items-center flex-1 justify-center gap-2 min-h-0">
      <p class="text-2xl font-extrabold tracking-wide text-center leading-tight px-2">
        {{ question.text }} =
      </p>

      <!-- Answer input box (no native <input>, shake on wrong same-length) -->
      <div
        class="rounded-xl text-center px-6 py-1 text-2xl font-extrabold tracking-widest
               min-w-[110px] shadow-inner"
        :class="[answerBoxClass, shake ? 'shake' : '']"
      >
        {{ input || '?' }}
      </div>
    </div>

    <!-- ── Numeric Keypad ──────────────────────────────────────────────── -->
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
import { Trophy, CheckCircle, Flame, PauseCircle, Zap } from 'lucide-vue-next'
import NumericKeypad from './NumericKeypad.vue'

const props = defineProps({
  player:       { type: Number,  required: true },
  level:        { type: Number,  required: true },
  momentum:     { type: Number,  required: true },
  question:     { type: Object,  required: true },
  input:        { type: String,  required: true },
  frozen:       { type: Boolean, default: false  },
  scoredPlayer: { type: Number,  default: null   },
  roundWinner:  { type: Number,  default: null   },
  currentQuote: { type: Object,  default: null   },  // { winner, loser } | null
  shake:        { type: Boolean, default: false  },
})

defineEmits(['digit', 'backspace'])

const playerLabel = computed(() => `Player ${props.player}`)
const isRed       = computed(() => props.player === 1)

// ── Colour theming ──────────────────────────────────────────────────────────
const bgClass = computed(() =>
  isRed.value ? 'bg-red-100 text-red-900' : 'bg-blue-100 text-blue-900'
)
const levelBadgeClass = computed(() =>
  isRed.value ? 'bg-red-200 text-red-800' : 'bg-blue-200 text-blue-800'
)
const answerBoxClass = computed(() =>
  isRed.value ? 'bg-red-200 text-red-900' : 'bg-blue-200 text-blue-900'
)
const keypadColorClass = computed(() =>
  isRed.value
    ? 'bg-red-300 hover:bg-red-400 active:bg-red-500 text-red-900'
    : 'bg-blue-300 hover:bg-blue-400 active:bg-blue-500 text-blue-900'
)

// ── Overlay helpers ─────────────────────────────────────────────────────────
const isScoredMe  = computed(() => props.frozen && props.scoredPlayer === props.player)
const isRoundWon  = computed(() => props.frozen && props.roundWinner  === props.player)
const isRoundLost = computed(() =>
  props.frozen && props.roundWinner !== null && props.roundWinner !== props.player
)

const overlayBgClass = computed(() => {
  if (isRoundWon.value)  return 'bg-green-500/95 text-white'
  if (isRoundLost.value) return 'bg-gray-900/80  text-white'
  if (isScoredMe.value)  return 'bg-green-400/90 text-white'
  // Opponent scored – gently dim this side
  return isRed.value ? 'bg-red-200/75 text-red-900' : 'bg-blue-200/75 text-blue-900'
})

// Lucide icon component for each overlay state
const overlayIconComponent = computed(() => {
  if (isRoundWon.value)  return Trophy
  if (isRoundLost.value) return Flame
  if (isScoredMe.value)  return CheckCircle
  return PauseCircle
})

const overlayTitle = computed(() => {
  if (isRoundWon.value)  return 'Round Won!'
  if (isRoundLost.value) return 'Round Lost...'
  if (isScoredMe.value)  return 'Correct!'
  if (props.frozen && props.scoredPlayer !== null)
    return `Player ${props.scoredPlayer} Scored!`
  return ''
})

// Which quote to show on this player's screen
const activeQuote = computed(() => {
  if (!props.currentQuote || props.roundWinner === null) return null
  return props.roundWinner === props.player
    ? props.currentQuote.winner
    : props.currentQuote.loser
})

// ── Momentum dots ───────────────────────────────────────────────────────────
// P1 dots (left, i=1..5): nearest-to-center (i=5) fills first when momentum=+1
//   → dot i is filled when momentum >= (6 - i)
function p1DotClass(i) {
  return props.momentum >= (6 - i)
    ? 'bg-red-500  border-red-500'
    : 'bg-transparent border-red-300'
}

// P2 dots (right, i=1..5): nearest-to-center (i=1) fills first when momentum=-1
//   → dot i is filled when momentum <= -i
function p2DotClass(i) {
  return props.momentum <= -i
    ? 'bg-blue-500  border-blue-500'
    : 'bg-transparent border-blue-300'
}
</script>

<style scoped>
/* Overlay fade */
.fade-enter-active,
.fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from,
.fade-leave-to      { opacity: 0; }

/* Quote fade-in */
.quote-fade-enter-active { transition: opacity 0.5s ease 0.3s; }
.quote-fade-enter-from   { opacity: 0; }
.quote-fade-leave-active { transition: opacity 0.15s ease; }
.quote-fade-leave-to     { opacity: 0; }

/* Gentle pulse on the quote text */
@keyframes quotePulse {
  0%, 100% { opacity: 1;    }
  50%       { opacity: 0.7; }
}
.quote-pulse {
  animation: quotePulse 2s ease-in-out infinite;
}
</style>
