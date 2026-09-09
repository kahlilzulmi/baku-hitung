<template>
  <div
    class="memory-window w-full"
    role="progressbar"
    :aria-valuemin="0"
    :aria-valuemax="windowMs"
    :aria-valuenow="clampedElapsed"
    :aria-label="ariaLabel"
  >
    <div
      class="memory-window-track h-1.5 w-full overflow-hidden rounded-full"
      :class="trackClass"
    >
      <div
        class="memory-window-fill h-full rounded-full"
        :class="fillClass"
        :style="{ width: fillPercent + '%' }"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { MEMORY_WINDOW_MS } from '../config/gameDefaults.js'
import { isCriticalHit, memoryWindowFillPercent } from '../domain/memoryWindow.js'
import { useA11yPrefs } from '../composables/useA11yPrefs.js'

const props = defineProps({
  elapsedMs: { type: Number, default: 0 },
  windowMs:  { type: Number, default: MEMORY_WINDOW_MS },
})

const { t } = useI18n()
const { prefersReducedMotion } = useA11yPrefs()

const clampedElapsed = computed(() =>
  Math.max(0, Math.min(props.windowMs, Math.round(props.elapsedMs))),
)

const inWindow = computed(() => isCriticalHit(props.elapsedMs, props.windowMs))

const fillPercent = computed(() =>
  memoryWindowFillPercent(props.elapsedMs, props.windowMs),
)

const remainingMs = computed(() =>
  Math.max(0, props.windowMs - Math.round(props.elapsedMs)),
)

const ariaLabel = computed(() =>
  inWindow.value
    ? t('a11y.memoryWindow', { remaining: remainingMs.value })
    : t('a11y.memoryWindowClosed'),
)

const trackClass = computed(() =>
  inWindow.value
    ? 'bg-slate-800/25 memory-window-track--live'
    : 'bg-red-900/40 memory-window-track--gone',
)

const fillClass = computed(() => {
  if (inWindow.value) {
    return [
      'memory-window-fill--live bg-cyan-400',
      prefersReducedMotion.value ? '' : 'memory-window-fill--glow',
    ]
  }
  return 'memory-window-fill--gone bg-red-600/80'
})
</script>

<style scoped>
.memory-window-fill {
  transform-origin: left center;
}

.memory-window-fill--glow {
  box-shadow: 0 0 8px 2px rgb(34 211 238 / 0.85), 0 0 16px 4px rgb(16 185 129 / 0.45);
  animation: memory-glow 1.1s ease-in-out infinite;
}

.memory-window-fill--gone {
  box-shadow: none;
  opacity: 0.72;
}

@keyframes memory-glow {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.35); }
}
</style>
