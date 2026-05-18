<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-50 to-slate-200 flex items-center justify-center p-4">
    <form
      class="w-full max-w-md bg-white rounded-2xl shadow-lg border border-slate-200 p-6 space-y-5"
      @submit.prevent="onSubmit"
    >
      <header class="text-center space-y-1">
        <h1 class="text-2xl font-black text-slate-900">{{ t('lobby.title') }}</h1>
        <p class="text-sm text-slate-600">{{ t('lobby.subtitle') }}</p>
      </header>

      <div class="flex justify-end items-center gap-2">
        <span class="text-xs font-semibold text-slate-500">{{ t('lobby.language') }}</span>
        <button
          v-for="loc in locales"
          :key="loc"
          type="button"
          class="px-2.5 py-1 text-xs font-bold rounded-full border transition-colors"
          :class="locale === loc
            ? 'bg-slate-800 text-white border-slate-800'
            : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'"
          @click="setLocale(loc)"
        >
          {{ loc.toUpperCase() }}
        </button>
      </div>

      <fieldset class="space-y-3">
        <legend class="text-xs font-bold uppercase tracking-wide text-slate-500">
          {{ t('lobby.playMode') }}
        </legend>
        <div class="grid grid-cols-2 gap-2">
          <label
            v-for="mode in playModes"
            :key="mode"
            class="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-sm font-semibold cursor-pointer transition-colors"
            :class="playMode === mode
              ? 'border-blue-500 bg-blue-50 text-blue-900'
              : 'border-slate-200 text-slate-700 hover:bg-slate-50'"
          >
            <input v-model="playMode" type="radio" :value="mode" class="sr-only" />
            {{ mode === 'duel' ? t('lobby.modeDuel') : t('lobby.modePractice') }}
          </label>
        </div>
      </fieldset>

      <div v-if="playMode === 'duel'" class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label class="block space-y-1">
          <span class="text-xs font-bold text-slate-600">{{ t('lobby.player1') }}</span>
          <input
            v-model="player1Name"
            type="text"
            maxlength="24"
            :placeholder="t('lobby.player1Placeholder')"
            class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </label>
        <label class="block space-y-1">
          <span class="text-xs font-bold text-slate-600">{{ t('lobby.player2') }}</span>
          <input
            v-model="player2Name"
            type="text"
            maxlength="24"
            :placeholder="t('lobby.player1Placeholder')"
            class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </label>
      </div>

      <label class="block space-y-1">
        <span class="text-xs font-bold text-slate-600">{{ t('lobby.curriculum') }}</span>
        <select
          v-model="curriculumId"
          class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option :value="null">{{ t('lobby.curriculumFree') }}</option>
          <option
            v-for="preset in CURRICULUM_PRESETS"
            :key="preset.id"
            :value="preset.id"
          >
            {{ t(preset.labelKey) }}
          </option>
        </select>
      </label>

      <fieldset v-if="playMode === 'duel'" class="space-y-2">
        <legend class="text-xs font-bold uppercase tracking-wide text-slate-500">
          {{ t('lobby.scoringMode') }}
        </legend>
        <label
          v-for="mode in scoringModes"
          :key="mode"
          class="flex items-start gap-2 text-sm cursor-pointer"
        >
          <input v-model="scoringMode" type="radio" :value="mode" class="mt-0.5" />
          <span>
            {{ mode === 'gentle' ? t('lobby.scoringGentle') : t('lobby.scoringCompetitive') }}
          </span>
        </label>
      </fieldset>

      <label class="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
        <input v-model="showTimer" type="checkbox" class="rounded border-slate-300" />
        {{ t('lobby.showTimer') }}
      </label>

      <button
        type="submit"
        class="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800
               text-white font-bold text-base shadow-md transition-colors"
      >
        {{ playMode === 'duel' ? t('lobby.startDuel') : t('lobby.startPractice') }}
      </button>

      <div class="pt-2 border-t border-slate-200 space-y-2">
        <button
          type="button"
          class="w-full py-2 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          @click="createChallenge"
        >
          {{ challengeLinkLabel || t('lobby.createChallenge') }}
        </button>
        <router-link
          to="/teacher"
          class="block w-full py-2 text-center rounded-lg text-sm font-semibold text-blue-600 hover:bg-blue-50"
        >
          {{ t('lobby.teacherDashboard') }}
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { createChallengeSeed } from '../domain/challengeEngine.js'
import { CURRICULUM_PRESETS } from '../config/curriculumPresets.js'
import { SHOW_QUESTION_TIMER } from '../config/gameDefaults.js'

const emit = defineEmits(['start'])

const router = useRouter()
const { t, locale } = useI18n()
const challengeLinkLabel = ref('')
const locales = ['id', 'en']

const playModes = ['duel', 'practice']
const scoringModes = ['gentle', 'competitive']

const player1Name = ref('')
const player2Name = ref('')
const playMode = ref('duel')
const scoringMode = ref('gentle')
const curriculumId = ref(null)
const showTimer = ref(SHOW_QUESTION_TIMER)

function setLocale(loc) {
  locale.value = loc
}

function createChallenge() {
  const seed = createChallengeSeed()
  const url = new URL(`/challenge/${seed}`, window.location.origin)
  navigator.clipboard?.writeText(url.toString())
  challengeLinkLabel.value = t('lobby.challengeCopied')
  setTimeout(() => {
    router.push(`/challenge/${seed}`)
  }, 600)
}

function onSubmit() {
  emit('start', {
    playMode: playMode.value,
    scoringMode: scoringMode.value,
    curriculumId: curriculumId.value,
    showTimer: showTimer.value,
    player1Name: player1Name.value.trim() || null,
    player2Name: player2Name.value.trim() || null,
  })
}
</script>
