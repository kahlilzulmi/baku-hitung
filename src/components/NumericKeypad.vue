<template>
  <!-- 3×4 grid: 1-9 row-major, then [0] [⌫] -->
  <div class="grid grid-cols-3 gap-2 w-full select-none">
    <button
      v-for="n in [1,2,3,4,5,6,7,8,9]"
      :key="n"
      @click="$emit('digit', String(n))"
      class="keypad-btn"
      :class="colorClass"
    >
      {{ n }}
    </button>
    <!-- Bottom row: empty spacer | 0 | backspace -->
    <div></div>
    <button
      @click="$emit('digit', '0')"
      class="keypad-btn"
      :class="colorClass"
    >
      0
    </button>
    <button
      @click="$emit('backspace')"
      class="keypad-btn backspace-btn"
      :class="colorClass"
    >
      ⌫
    </button>
  </div>
</template>

<script setup>
defineProps({
  colorClass: {
    type: String,
    default: '',
  },
})

defineEmits(['digit', 'backspace'])
</script>

<style scoped>
.keypad-btn {
  @apply flex items-center justify-center rounded-2xl font-bold text-2xl
         h-14 w-full cursor-pointer transition-transform active:scale-90
         shadow-md select-none;
}
</style>
