<template>
  <!-- 3×4 grid: 1-9 row-major, then [spacer] [0] [⌫] -->
  <div class="grid grid-cols-3 gap-1.5 w-full select-none">
    <button
      v-for="n in [1,2,3,4,5,6,7,8,9]"
      :key="n"
      :disabled="disabled"
      @click="$emit('digit', String(n))"
      class="keypad-btn"
      :class="[colorClass, disabled ? 'opacity-40' : '']"
    >
      {{ n }}
    </button>
    <!-- Bottom row: empty spacer | 0 | backspace -->
    <div></div>
    <button
      :disabled="disabled"
      @click="$emit('digit', '0')"
      class="keypad-btn"
      :class="[colorClass, disabled ? 'opacity-40' : '']"
    >
      0
    </button>
    <button
      :disabled="disabled"
      @click="$emit('backspace')"
      class="keypad-btn"
      :class="[colorClass, disabled ? 'opacity-40' : '']"
      aria-label="Backspace"
    >
      <Delete class="w-5 h-5" />
    </button>
  </div>
</template>

<script setup>
import { Delete } from 'lucide-vue-next'

defineProps({
  colorClass: { type: String,  default: '' },
  disabled:   { type: Boolean, default: false },
})

defineEmits(['digit', 'backspace'])
</script>

<style scoped>
.keypad-btn {
  @apply flex items-center justify-center rounded-2xl font-bold text-xl
         h-11 w-full cursor-pointer transition-transform active:scale-90
         shadow-md select-none;
}
.keypad-btn:disabled {
  @apply cursor-not-allowed active:scale-100;
}
</style>
