import { ref, onMounted, onUnmounted } from 'vue'

function getFullscreenElement() {
  return (
    document.fullscreenElement
    ?? document.webkitFullscreenElement
    ?? null
  )
}

function isApiAvailable() {
  const el = document.documentElement
  return !!(el.requestFullscreen ?? el.webkitRequestFullscreen)
}

export function useFullscreen() {
  const isSupported = ref(false)
  const isFullscreen = ref(false)

  function sync() {
    isFullscreen.value = !!getFullscreenElement()
  }

  async function enter() {
    const el = document.documentElement
    const fn = el.requestFullscreen ?? el.webkitRequestFullscreen
    if (!fn) return
    await fn.call(el)
  }

  async function exit() {
    const fn = document.exitFullscreen ?? document.webkitExitFullscreen
    if (!fn) return
    await fn.call(document)
  }

  async function toggle() {
    if (!isSupported.value) return
    try {
      if (getFullscreenElement()) {
        await exit()
      } else {
        await enter()
      }
    } catch {
      // Blocked without user gesture or by browser policy
    }
  }

  onMounted(() => {
    isSupported.value = isApiAvailable()
    sync()
    document.addEventListener('fullscreenchange', sync)
    document.addEventListener('webkitfullscreenchange', sync)
  })

  onUnmounted(() => {
    document.removeEventListener('fullscreenchange', sync)
    document.removeEventListener('webkitfullscreenchange', sync)
  })

  return { isSupported, isFullscreen, toggle, enter, exit }
}
