<template>
  <button
    type="button"
    class="relative overflow-hidden rounded-full border border-gray-300 bg-white/95
           text-gray-700 shadow font-bold select-none touch-none
           disabled:opacity-40 touch-manipulation"
    :class="[sizeClass, { 'ring-2 ring-blue-400': holding }]"
    :disabled="disabled"
    :aria-label="ariaLabel"
    :title="holdTitle"
    @click.prevent
    @pointerdown.prevent="onPointerDown"
    @pointerup="onPointerUp"
    @pointerleave="onPointerUp"
    @pointercancel="onPointerUp"
    @contextmenu.prevent
  >
    <span
      class="absolute inset-0 bg-blue-500/35 origin-left pointer-events-none transition-none"
      :style="{ transform: `scaleX(${progress})` }"
      aria-hidden="true"
    />
    <span class="relative z-10 inline-flex items-center justify-center gap-1">
      <slot />
    </span>
  </button>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { HOLD_ACTIVATE_MS } from '../config/gameDefaults.js'

const props = defineProps({
  ariaLabel: { type: String, default: '' },
  holdMs: { type: Number, default: HOLD_ACTIVATE_MS },
  disabled: { type: Boolean, default: false },
  size: { type: String, default: 'sm' }, // sm | icon | pause
})

const emit = defineEmits(['activate'])

const { t } = useI18n()

const holding = ref(false)
const progress = ref(0)

let rafId = null
let startedAt = 0

const sizeClass = computed(() => {
  if (props.size === 'pause') return 'h-9 w-9 p-0'
  if (props.size === 'icon') return 'h-8 w-8 text-[10px]'
  return 'px-2.5 py-0.5 text-[10px] uppercase tracking-wide'
})

const holdTitle = computed(() => {
  const hint = t('duel.holdToActivate')
  return props.ariaLabel ? `${props.ariaLabel} — ${hint}` : hint
})

function clearHold() {
  holding.value = false
  progress.value = 0
  startedAt = 0
  if (rafId != null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
}

function tick() {
  if (!startedAt) return
  const p = Math.min(1, (performance.now() - startedAt) / props.holdMs)
  progress.value = p
  if (p >= 1) {
    clearHold()
    emit('activate')
    return
  }
  rafId = requestAnimationFrame(tick)
}

function onPointerDown() {
  if (props.disabled) return
  clearHold()
  holding.value = true
  startedAt = performance.now()
  rafId = requestAnimationFrame(tick)
}

function onPointerUp() {
  if (progress.value < 1) clearHold()
}
</script>
