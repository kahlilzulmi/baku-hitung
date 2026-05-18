<template>
  <div class="space-y-4">
    <div class="bg-white rounded-xl shadow p-5 space-y-2">
      <h2 class="text-lg font-black">{{ t('challenge.done') }}</h2>
      <p v-if="myResult" class="text-sm">
        {{ myResult.playerName }} — {{ myResult.correctCount }}/{{ myResult.runs.length }}
        {{ t('challenge.correct') }}
      </p>
      <p v-if="myResult" class="text-2xl font-black tabular-nums">{{ myResult.totalMs }} ms</p>
      <p class="text-xs text-slate-500">{{ t('challenge.totalTime') }}</p>
    </div>

    <div v-if="rankedResults.length" class="bg-white rounded-xl shadow p-5 space-y-2">
      <h3 class="text-sm font-bold uppercase text-slate-500">{{ t('challenge.compare') }}</h3>
      <div
        v-for="(r, i) in rankedResults"
        :key="`${r.playerName}-${r.completedAt}`"
        class="flex justify-between text-sm py-1 border-b border-slate-100 last:border-0"
        :class="r.playerName === playerName ? 'text-blue-700 font-bold' : ''"
      >
        <span>#{{ i + 1 }} {{ r.playerName }}</span>
        <span class="tabular-nums">{{ r.totalMs }} ms · {{ r.correctCount }}/{{ r.runs.length }}</span>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <button
        type="button"
        class="w-full py-2 rounded-lg bg-slate-800 text-white text-sm font-bold"
        @click="exportResult"
      >
        {{ t('challenge.exportResult') }}
      </button>
      <label class="block">
        <span class="text-xs font-bold text-slate-600">{{ t('challenge.importRival') }}</span>
        <textarea
          v-model="importJson"
          rows="3"
          class="mt-1 w-full text-xs font-mono rounded-lg border border-slate-300 p-2"
          :placeholder="t('challenge.importPlaceholder')"
        />
      </label>
      <button
        type="button"
        class="w-full py-2 rounded-lg border border-slate-300 text-sm font-bold disabled:opacity-40"
        :disabled="!importJson.trim()"
        @click="importRival"
      >
        {{ t('challenge.importBtn') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { loadChallengeResults, importChallengeResult } from '../domain/challengeStore.js'

const props = defineProps({
  seed: { type: String, required: true },
  playerName: { type: String, required: true },
})

const { t } = useI18n()
const importJson = ref('')
const results = ref(loadChallengeResults(props.seed))

const myResult = computed(() => {
  const mine = results.value.filter((r) => r.playerName === props.playerName)
  return mine[mine.length - 1] ?? null
})

const rankedResults = computed(() =>
  [...results.value].sort((a, b) => a.totalMs - b.totalMs),
)

onMounted(() => {
  results.value = loadChallengeResults(props.seed)
})

function refresh() {
  results.value = loadChallengeResults(props.seed)
}

function exportResult() {
  if (!myResult.value) return
  const blob = new Blob([JSON.stringify(myResult.value, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `baku-challenge-${props.seed}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function importRival() {
  try {
    const parsed = JSON.parse(importJson.value)
    importChallengeResult(parsed)
    importJson.value = ''
    refresh()
  } catch {
    window.alert(t('challenge.importError'))
  }
}
</script>
