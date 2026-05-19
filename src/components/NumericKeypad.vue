<template>
  <div
    class="numeric-keypad grid grid-cols-3 gap-1.5 w-full select-none"
    role="group"
    :aria-label="t('keypad.group')"
  >
    <button
      v-for="n in [1,2,3,4,5,6,7,8,9]"
      :key="n"
      type="button"
      :disabled="disabled"
      :aria-label="t('keypad.digit', { n })"
      class="keypad-btn"
      :class="[colorClass, disabled ? 'opacity-40' : '']"
      @pointerdown="(e) => onDigitDown(e, String(n))"
    >
      {{ n }}
    </button>
    <div aria-hidden="true" />
    <button
      type="button"
      :disabled="disabled"
      :aria-label="t('keypad.digit', { n: 0 })"
      class="keypad-btn"
      :class="[colorClass, disabled ? 'opacity-40' : '']"
      @pointerdown="(e) => onDigitDown(e, '0')"
    >
      0
    </button>
    <button
      type="button"
      :disabled="disabled"
      :aria-label="t('keypad.backspace')"
      class="keypad-btn"
      :class="[colorClass, disabled ? 'opacity-40' : '']"
      @pointerdown="onBackspaceDown"
    >
      <Delete class="w-5 h-5" aria-hidden="true" />
    </button>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { Delete } from 'lucide-vue-next'

const props = defineProps({
  colorClass: { type: String,  default: '' },
  disabled:   { type: Boolean, default: false },
})

const emit = defineEmits(['digit', 'backspace'])

const { t } = useI18n()

function isPrimaryPointer(e) {
  return e.button === 0
}

function capturePointer(e) {
  try {
    e.currentTarget.setPointerCapture(e.pointerId)
  } catch {
    // unsupported
  }
}

function onDigitDown(e, digit) {
  if (props.disabled || !isPrimaryPointer(e)) return
  e.preventDefault()
  e.stopPropagation()
  capturePointer(e)
  emit('digit', digit)
}

function onBackspaceDown(e) {
  if (props.disabled || !isPrimaryPointer(e)) return
  e.preventDefault()
  e.stopPropagation()
  capturePointer(e)
  emit('backspace')
}
</script>

<style scoped>
.keypad-btn {
  @apply flex items-center justify-center rounded-2xl font-bold text-xl
         h-11 w-full cursor-pointer transition-transform active:scale-90
         shadow-md select-none touch-manipulation;
}
.keypad-btn:disabled {
  @apply cursor-not-allowed active:scale-100;
}
</style>
