import { createApp } from 'vue'
import App from './App.vue'
import { i18n } from './i18n/index.js'
import { router } from './router/index.js'
import './style.css'
import { registerSW } from 'virtual:pwa-register'
import { initA11yPrefs } from './composables/useA11yPrefs.js'

initA11yPrefs()

const app = createApp(App).use(i18n).use(router)

if (import.meta.env.PROD) {
  registerSW({ immediate: true })
}

app.mount('#app')
