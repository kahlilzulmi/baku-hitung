import { createI18n } from 'vue-i18n'
import id from './messages/id.json'

export const i18n = createI18n({
  legacy: false,
  locale: 'id',
  fallbackLocale: 'id',
  messages: { id },
})
