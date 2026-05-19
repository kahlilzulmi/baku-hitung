<template>
  <div
    class="duel-center-bar relative z-30 flex h-11 w-full flex-shrink-0 items-center justify-center"
    role="toolbar"
    :aria-label="t('duel.toolbar')"
  >
    <button
      v-if="menuOpen"
      type="button"
      class="fixed inset-0 z-20 cursor-default border-0 bg-black/20 p-0"
      :aria-label="t('duel.closeMenu')"
      @click="closeMenu"
    />

    <div
      class="relative z-30 flex items-center justify-center gap-2 px-3"
      role="group"
      :aria-label="menuOpen ? t('duel.pauseMenu') : undefined"
    >
      <MomentumIndicator :momentum="momentum" side="p1" compact />

      <Transition name="center-controls" mode="out-in">
        <button
          v-if="!menuOpen"
          key="pause"
          type="button"
          class="duel-pause-btn flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full
                 border border-amber-500/60 shadow-md touch-manipulation
                 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                 focus-visible:outline-amber-400"
          :aria-label="t('duel.pauseMenu')"
          :aria-expanded="menuOpen"
          @click="openMenu"
        >
          <Zap class="duel-pause-icon h-5 w-5" aria-hidden="true" />
        </button>

        <div
          v-else
          key="menu"
          class="flex flex-shrink-0 items-center justify-center gap-2"
          role="menu"
        >
          <HoldPressButton
            size="pause"
            :aria-label="t('backToLobby')"
            role="menuitem"
            @activate="onExit"
          >
            <ArrowLeft class="h-5 w-5" aria-hidden="true" />
          </HoldPressButton>

          <HoldPressButton
            size="pause"
            :aria-label="t('exportSession')"
            role="menuitem"
            @activate="onExport"
          >
            <Download class="h-5 w-5" aria-hidden="true" />
          </HoldPressButton>

          <HoldPressButton
            v-if="isFullscreenSupported"
            size="pause"
            :aria-label="isFullscreen ? t('fullscreen.exit') : t('fullscreen.enter')"
            role="menuitem"
            @activate="onFullscreen"
          >
            <Minimize v-if="isFullscreen" class="h-5 w-5" aria-hidden="true" />
            <Maximize v-else class="h-5 w-5" aria-hidden="true" />
          </HoldPressButton>
        </div>
      </Transition>

      <MomentumIndicator :momentum="momentum" side="p2" compact />
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { Zap, ArrowLeft, Download, Maximize, Minimize } from 'lucide-vue-next'
import MomentumIndicator from './MomentumIndicator.vue'
import HoldPressButton from './HoldPressButton.vue'
import { useFullscreen } from '../composables/useFullscreen.js'

defineProps({
  momentum: { type: Number, required: true },
})

const menuOpen = defineModel('open', { type: Boolean, default: false })

const emit = defineEmits(['exit', 'export'])

const { t } = useI18n()
const { isSupported: isFullscreenSupported, isFullscreen, toggle: toggleFullscreen } = useFullscreen()

function closeMenu() {
  menuOpen.value = false
}

function openMenu() {
  menuOpen.value = true
}

function onExit() {
  closeMenu()
  emit('exit')
}

function onExport() {
  closeMenu()
  emit('export')
}

function onFullscreen() {
  closeMenu()
  toggleFullscreen()
}
</script>

<style scoped>
.duel-center-bar {
  background: linear-gradient(
    to bottom,
    rgb(254 226 226) 0%,
    rgb(254 226 226) 50%,
    rgb(219 234 254) 50%,
    rgb(219 234 254) 100%
  );
}

.duel-pause-btn {
  background: linear-gradient(145deg, #fde68a 0%, #fbbf24 45%, #f97316 100%);
}

.duel-pause-icon {
  color: #fff;
  filter: drop-shadow(0 1px 1px rgb(180 83 9 / 0.45));
  fill: currentColor;
  stroke: #fef3c7;
  stroke-width: 1.5px;
}

.center-controls-enter-active,
.center-controls-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.center-controls-enter-from,
.center-controls-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
