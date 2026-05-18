<template>
  <div
    class="grid grid-cols-3 gap-1.5 w-full select-none"
    role="group"
    :aria-label="t('keypad.group')"
  >
    <button
      v-for="n in [1,2,3,4,5,6,7,8,9]"
      :key="n"
      type="button"
      :disabled="disabled"
      :aria-label="t('keypad.digit', { n })"
      @click="$emit('digit', String(n))"
      class="keypad-btn"
      :class="[colorClass, disabled ? 'opacity-40' : '']"
    >
      {{ n }}
    </button>
    <div aria-hidden="true" />
    <button
      type="button"
      :disabled="disabled"
      :aria-label="t('keypad.digit', { n: 0 })"
      @click="$emit('digit', '0')"
      class="keypad-btn"
      :class="[colorClass, disabled ? 'opacity-40' : '']"
    >
      0
    </button>
    <button
      type="button"
      :disabled="disabled"
      :aria-label="t('keypad.backspace')"
      @click="$emit('backspace')"
      class="keypad-btn"
      :class="[colorClass, disabled ? 'opacity-40' : '']"
    >
      <Delete class="w-5 h-5" aria-hidden="true" />
    </button>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { Delete } from 'lucide-vue-next'

const { t } = useI18n()

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
