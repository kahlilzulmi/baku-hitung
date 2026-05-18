import { createLearningEvent } from './learningEvent.js'
import { isCloudSyncEnabled, syncLearningEvent } from '../services/cloudSync.js'

const STORAGE_KEY = 'baku-hitung-learning-events'
export const MAX_LEARNING_EVENTS = 500

/**
 * @returns {import('./learningEvent.js').LearningEvent[]}
 */
export function loadLearningEvents() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/**
 * @param {import('./learningEvent.js').LearningEvent} event
 */
export function appendLearningEvent(event) {
  const full = createLearningEvent(event)
  const events = loadLearningEvents()
  events.push(full)
  const capped = events.length > MAX_LEARNING_EVENTS
    ? events.slice(-MAX_LEARNING_EVENTS)
    : events
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(capped))

  if (isCloudSyncEnabled()) {
    syncLearningEvent(full).catch(() => {})
  }
}

/**
 * @param {import('./learningEvent.js').LearningEvent[]} events
 * @returns {string[]} skill tags ranked by incorrect-answer frequency (weakest first)
 */
export function deriveWeakSkillTags(events) {
  const wrongCounts = /** @type {Record<string, number>} */ ({})
  for (const e of events) {
    if (e.correct) continue
    for (const tag of e.skillTags) {
      wrongCounts[tag] = (wrongCounts[tag] ?? 0) + 1
    }
  }
  return Object.entries(wrongCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([tag]) => tag)
}

/**
 * @param {string} sessionId
 * @returns {string}
 */
export function buildSessionExportJson(sessionId) {
  return JSON.stringify(
    {
      app: 'baku-hitung',
      sessionId,
      exportedAt: new Date().toISOString(),
      events: loadLearningEvents(),
    },
    null,
    2,
  )
}

/**
 * @param {string} sessionId
 */
export function downloadSessionExport(sessionId) {
  const date = new Date().toISOString().slice(0, 10)
  const blob = new Blob([buildSessionExportJson(sessionId)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `baku-hitung-session-${date}.json`
  a.click()
  URL.revokeObjectURL(url)
}
