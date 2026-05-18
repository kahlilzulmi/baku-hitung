<template>
  <div class="min-h-screen bg-slate-50 p-4">
    <div class="max-w-3xl mx-auto space-y-6">
      <header class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-black text-slate-900">{{ t('teacher.title') }}</h1>
          <p class="text-sm text-slate-600">{{ t('teacher.subtitle') }}</p>
        </div>
        <router-link to="/" class="text-xs font-bold text-blue-600 hover:underline">
          {{ t('backToLobby') }}
        </router-link>
      </header>

      <section class="bg-white rounded-xl shadow border border-slate-200 p-5 space-y-4">
        <h2 class="text-sm font-bold uppercase text-slate-500">{{ t('teacher.loadJson') }}</h2>
        <input
          type="file"
          accept="application/json,.json"
          class="block w-full text-sm"
          @change="onFile"
        />
        <p v-if="fileError" class="text-xs text-red-600">{{ fileError }}</p>
      </section>

      <section
        v-if="isCloudSyncEnabled()"
        class="bg-white rounded-xl shadow border border-slate-200 p-5 space-y-3"
      >
        <h2 class="text-sm font-bold uppercase text-slate-500">{{ t('teacher.loadCloud') }}</h2>
        <div class="flex gap-2">
          <input
            v-model="sessionIdInput"
            type="text"
            :placeholder="t('teacher.sessionIdPlaceholder')"
            class="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono"
          />
          <button
            type="button"
            class="px-4 py-2 rounded-lg bg-slate-800 text-white text-sm font-bold disabled:opacity-40"
            :disabled="loadingCloud || !sessionIdInput.trim()"
            @click="loadFromCloud"
          >
            {{ loadingCloud ? '…' : t('teacher.fetch') }}
          </button>
        </div>
        <p v-if="cloudError" class="text-xs text-red-600">{{ cloudError }}</p>
      </section>

      <template v-if="stats">
        <section class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard :label="t('teacher.total')" :value="String(stats.total)" />
          <StatCard :label="t('teacher.accuracy')" :value="`${stats.accuracy}%`" />
          <StatCard :label="t('teacher.correct')" :value="String(stats.correct)" />
          <StatCard :label="t('teacher.avgMs')" :value="String(stats.avgResponseMs)" />
        </section>

        <AggregateTable
          :title="t('teacher.byPlayer')"
          :headers="[t('teacher.colPlayer'), t('teacher.colTotal'), t('teacher.colAccuracy'), t('teacher.colAvgMs')]"
          :rows="stats.byPlayer.map((p) => [String(p.player), String(p.total), `${p.accuracy}%`, String(p.avgResponseMs)])"
        />

        <AggregateTable
          :title="t('teacher.byTag')"
          :headers="[t('teacher.colTag'), t('teacher.colTotal'), t('teacher.colAccuracy'), t('teacher.colAvgMs')]"
          :rows="stats.byTag.map((tag) => [tag.tag, String(tag.total), `${tag.accuracy}%`, String(tag.avgResponseMs)])"
        />

        <AggregateTable
          :title="t('teacher.byLevel')"
          :headers="[t('teacher.colLevel'), t('teacher.colTotal'), t('teacher.colAccuracy')]"
          :rows="stats.byLevel.map((lv) => [String(lv.level), String(lv.total), `${lv.accuracy}%`])"
        />
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { aggregateSession, parseSessionExport } from '../domain/teacherAggregates.js'
import { isCloudSyncEnabled, fetchSessionEvents } from '../services/cloudSync.js'
import StatCard from '../components/teacher/StatCard.vue'
import AggregateTable from '../components/teacher/AggregateTable.vue'

const { t } = useI18n()

const stats = ref(null)
const fileError = ref('')
const sessionIdInput = ref('')
const loadingCloud = ref(false)
const cloudError = ref('')

function loadEvents(events) {
  fileError.value = ''
  cloudError.value = ''
  if (!events?.length) {
    fileError.value = t('teacher.noEvents')
    stats.value = null
    return
  }
  stats.value = aggregateSession(events)
}

async function onFile(e) {
  const file = e.target.files?.[0]
  if (!file) return
  try {
    const text = await file.text()
    const data = JSON.parse(text)
    const events = parseSessionExport(data)
    if (!events) {
      fileError.value = t('teacher.invalidFile')
      return
    }
    loadEvents(events)
  } catch {
    fileError.value = t('teacher.invalidFile')
  }
}

async function loadFromCloud() {
  loadingCloud.value = true
  cloudError.value = ''
  try {
    const events = await fetchSessionEvents(sessionIdInput.value.trim())
    loadEvents(events)
  } catch (err) {
    cloudError.value = err instanceof Error ? err.message : t('teacher.cloudFailed')
  } finally {
    loadingCloud.value = false
  }
}
</script>
