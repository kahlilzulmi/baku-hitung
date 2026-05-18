<template>
  <button
    v-if="isSupported"
    type="button"
    class="inline-flex items-center justify-center rounded-full
           bg-white/90 text-gray-700 shadow border border-gray-300
           hover:bg-gray-50 active:bg-gray-100 disabled:opacity-40"
    :class="sizeClass"
    :aria-label="isFullscreen ? t('fullscreen.exit') : t('fullscreen.enter')"
    :title="isFullscreen ? t('fullscreen.exit') : t('fullscreen.enter')"
    @click="toggle"
  >
    <Minimize v-if="isFullscreen" class="shrink-0" :class="iconClass" aria-hidden="true" />
    <Maximize v-else class="shrink-0" :class="iconClass" aria-hidden="true" />
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Maximize, Minimize } from 'lucide-vue-next'
import { useFullscreen } from '../composables/useFullscreen.js'

const props = defineProps({
  size: { type: String, default: 'sm' }, // sm | md
})

const { t } = useI18n()
const { isSupported, isFullscreen, toggle } = useFullscreen()

const sizeClass = computed(() =>
  props.size === 'md' ? 'h-9 w-9' : 'h-8 w-8',
)
const iconClass = computed(() =>
  props.size === 'md' ? 'w-5 h-5' : 'w-4 h-4',
)
</script>
