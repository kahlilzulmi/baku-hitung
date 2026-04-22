<template>
  <div
    class="flex flex-col justify-between h-full w-full px-4 py-3"
    :class="[bgClass, flashClass]"
    :style="player === 1 ? 'transform: rotate(180deg)' : ''"
  >
    <!-- Score row -->
    <div class="flex justify-between items-center">
      <span class="text-lg font-bold opacity-70">{{ playerLabel }}</span>
      <span class="text-3xl font-extrabold tracking-wider">{{ score }} pts</span>
    </div>

    <!-- Question -->
    <div class="flex flex-col items-center gap-2 flex-1 justify-center">
      <p class="text-4xl font-extrabold tracking-wide opacity-90">
        {{ question.text }} =
      </p>

      <!-- Answer display (custom input) -->
      <div
        class="rounded-2xl min-w-[120px] text-center px-6 py-2 text-4xl font-extrabold tracking-widest shadow-inner"
        :class="answerBoxClass"
      >
        {{ input || '?' }}
      </div>
    </div>

    <!-- Keypad -->
    <div class="w-full max-w-xs mx-auto pb-1">
      <NumericKeypad
        :color-class="keypadColorClass"
        @digit="(d) => $emit('digit', d)"
        @backspace="$emit('backspace')"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import NumericKeypad from './NumericKeypad.vue'

const props = defineProps({
  player: { type: Number, required: true },   // 1 or 2
  score: { type: Number, required: true },
  question: { type: Object, required: true },  // { text, answer }
  input: { type: String, required: true },
  flash: { type: Boolean, default: false },
})

defineEmits(['digit', 'backspace'])

const playerLabel = computed(() => props.player === 1 ? 'Player 1' : 'Player 2')

// ── Colour theming ──────────────────────────────────────────────────────────
// Player 1 = red pastels, Player 2 = blue pastels
const bgClass = computed(() =>
  props.player === 1 ? 'bg-red-100 text-red-900' : 'bg-blue-100 text-blue-900'
)

const flashClass = computed(() => {
  if (!props.flash) return ''
  return props.player === 1 ? 'bg-red-300' : 'bg-blue-300'
})

const answerBoxClass = computed(() =>
  props.player === 1 ? 'bg-red-200 text-red-900' : 'bg-blue-200 text-blue-900'
)

const keypadColorClass = computed(() =>
  props.player === 1
    ? 'bg-red-300 hover:bg-red-400 text-red-900'
    : 'bg-blue-300 hover:bg-blue-400 text-blue-900'
)
</script>
