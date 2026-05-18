import { ref, watch } from 'vue'

const STORAGE_KEY = 'baku-hitung-a11y'

/** @type {ReturnType<typeof createA11yState> | null} */
let state = null

function loadStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { highContrast: false, dyslexiaFont: false }
    return JSON.parse(raw)
  } catch {
    return { highContrast: false, dyslexiaFont: false }
  }
}

function createA11yState() {
  const stored = loadStored()
  const highContrast = ref(stored.highContrast)
  const dyslexiaFont = ref(stored.dyslexiaFont)
  const prefersReducedMotion = ref(
    typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  function applyToDocument() {
    const html = document.documentElement
    html.classList.toggle('theme-high-contrast', highContrast.value)
    html.classList.toggle('font-dyslexia', dyslexiaFont.value)
    html.classList.toggle('reduce-motion', prefersReducedMotion.value)
  }

  function persist() {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        highContrast: highContrast.value,
        dyslexiaFont: dyslexiaFont.value,
      }),
    )
  }

  watch([highContrast, dyslexiaFont], () => {
    persist()
    applyToDocument()
  })

  if (typeof window !== 'undefined') {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    mq.addEventListener('change', (e) => {
      prefersReducedMotion.value = e.matches
      applyToDocument()
    })
    applyToDocument()
  }

  function toggleHighContrast() {
    highContrast.value = !highContrast.value
  }

  function toggleDyslexiaFont() {
    dyslexiaFont.value = !dyslexiaFont.value
  }

  return {
    highContrast,
    dyslexiaFont,
    prefersReducedMotion,
    toggleHighContrast,
    toggleDyslexiaFont,
    applyToDocument,
  }
}

export function useA11yPrefs() {
  if (!state) state = createA11yState()
  return state
}

export function initA11yPrefs() {
  return useA11yPrefs()
}
