<template>
  <div
    class="flex items-center justify-center"
    :class="compact ? 'gap-1' : 'gap-1.5'"
    role="img"
    :aria-label="momentumAriaLabel"
  >
    <template v-if="showP1">
      <div
        v-for="i in 5"
        :key="`p1-${i}`"
        class="rounded-full border-2 transition-all duration-300"
        :class="[compact ? 'w-3 h-3' : 'w-4 h-4', p1DotClass(i)]"
      />
    </template>

    <Zap
      v-if="showCenterZap"
      class="flex-shrink-0 opacity-40"
      :class="compact ? 'w-3 h-3 mx-0.5' : 'w-3.5 h-3.5 mx-0.5'"
      aria-hidden="true"
    />

    <template v-if="showP2">
      <div
        v-for="i in 5"
        :key="`p2-${i}`"
        class="rounded-full border-2 transition-all duration-300"
        :class="[compact ? 'w-3 h-3' : 'w-4 h-4', p2DotClass(i)]"
      />
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Zap } from 'lucide-vue-next'

const props = defineProps({
  momentum: { type: Number, required: true },
  compact:  { type: Boolean, default: false },
  /** both = full tug-of-war; p1 | p2 = one player's dots only */
  side:     { type: String, default: 'both' },
})

const { t } = useI18n()

const showP1 = computed(() => props.side === 'both' || props.side === 'p1')
const showP2 = computed(() => props.side === 'both' || props.side === 'p2')
const showCenterZap = computed(() => props.side === 'both')

const momentumAriaLabel = computed(() => {
  if (props.side === 'p1') return t('a11y.momentumP1', { score: props.momentum })
  if (props.side === 'p2') return t('a11y.momentumP2', { score: props.momentum })
  return t('a11y.momentum', { score: props.momentum })
})

function p1DotClass(i) {
  const filled = props.momentum >= (6 - i)
  return filled
    ? 'momentum-dot-filled-p1 bg-red-500 border-red-500'
    : 'momentum-dot-empty bg-transparent border-red-300'
}

function p2DotClass(i) {
  const filled = props.momentum <= -i
  return filled
    ? 'momentum-dot-filled-p2 bg-blue-500 border-blue-500'
    : 'momentum-dot-empty bg-transparent border-blue-300'
}
</script>
