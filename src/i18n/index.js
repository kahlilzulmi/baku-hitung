import { createI18n } from 'vue-i18n'
import id from './messages/id.json'
import en from './messages/en.json'

export const i18n = createI18n({
  legacy: false,
  locale: 'id',
  fallbackLocale: 'id',
  messages: { id, en },
})
