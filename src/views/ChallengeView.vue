<template>
  <div class="min-h-screen bg-slate-100 flex flex-col">
    <header class="flex items-center justify-between gap-2 px-4 py-2 bg-white border-b border-slate-200">
      <button
        type="button"
        class="text-xs font-bold text-slate-600 hover:text-slate-900"
        @click="router.push('/')"
      >
        {{ t('backToLobby') }}
      </button>
      <span class="text-xs font-mono text-slate-500 truncate flex-1 text-center">{{ seed }}</span>
      <FullscreenButton />
    </header>

    <div v-if="!started" class="flex-1 flex items-center justify-center p-4">
      <form class="w-full max-w-sm bg-white rounded-xl shadow p-6 space-y-4" @submit.prevent="started = true">
        <h1 class="text-xl font-black text-slate-900">{{ t('challenge.title') }}</h1>
        <p class="text-sm text-slate-600">{{ t('challenge.subtitle', { count: CHALLENGE_QUESTION_COUNT }) }}</p>
        <label class="block space-y-1">
          <span class="text-xs font-bold text-slate-600">{{ t('challenge.yourName') }}</span>
          <input
            v-model="name"
            type="text"
            maxlength="24"
            required
            class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
        <button type="submit" class="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold">
          {{ t('challenge.start') }}
        </button>
        <button type="button" class="w-full text-xs text-blue-600 font-semibold" @click="copyLink">
          {{ copyLabel || t('challenge.copyLink') }}
        </button>
      </form>
    </div>

    <ChallengePlay
      v-else-if="!showResults"
      :seed="seed"
      :player-name="name.trim()"
      @finished="onFinished"
    />

    <div v-else class="flex-1 overflow-y-auto p-4">
      <ChallengeResults :seed="seed" :player-name="name.trim()" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import FullscreenButton from '../components/FullscreenButton.vue'
import ChallengePlay from './ChallengePlay.vue'
import ChallengeResults from './ChallengeResults.vue'
import { CHALLENGE_QUESTION_COUNT } from '../domain/challengeEngine.js'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const seed = String(route.params.seed)
const name = ref(String(route.query.name ?? ''))
const started = ref(Boolean(route.query.name))
const showResults = ref(false)
const copyLabel = ref('')

function onFinished() {
  showResults.value = true
}

function copyLink() {
  const url = new URL(`/challenge/${seed}`, window.location.origin)
  if (name.value.trim()) url.searchParams.set('name', name.value.trim())
  navigator.clipboard?.writeText(url.toString())
  copyLabel.value = t('challenge.copied')
  setTimeout(() => { copyLabel.value = '' }, 2000)
}
</script>
