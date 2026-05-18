/**
 * @param {import('./learningEvent.js').LearningEvent[]} events
 */
export function aggregateSession(events) {
  if (!events.length) {
    return {
      total: 0,
      correct: 0,
      accuracy: 0,
      avgResponseMs: 0,
      byPlayer: [],
      byTag: [],
      byLevel: [],
    }
  }

  let correct = 0
  let responseSum = 0

  /** @type {Record<number, { player: number, total: number, correct: number, responseSum: number }>} */
  const byPlayerMap = {}
  /** @type {Record<string, { tag: string, total: number, correct: number, responseSum: number }>} */
  const byTagMap = {}
  /** @type {Record<number, { level: number, total: number, correct: number }>} */
  const byLevelMap = {}

  for (const e of events) {
    if (e.correct) correct++
    responseSum += e.responseMs ?? 0

    const p = byPlayerMap[e.player] ?? { player: e.player, total: 0, correct: 0, responseSum: 0 }
    p.total++
    if (e.correct) p.correct++
    p.responseSum += e.responseMs ?? 0
    byPlayerMap[e.player] = p

    for (const tag of e.skillTags ?? []) {
      const t = byTagMap[tag] ?? { tag, total: 0, correct: 0, responseSum: 0 }
      t.total++
      if (e.correct) t.correct++
      t.responseSum += e.responseMs ?? 0
      byTagMap[tag] = t
    }

    const lv = byLevelMap[e.level] ?? { level: e.level, total: 0, correct: 0 }
    lv.total++
    if (e.correct) lv.correct++
    byLevelMap[e.level] = lv
  }

  const total = events.length

  return {
    total,
    correct,
    accuracy: Math.round((correct / total) * 100),
    avgResponseMs: Math.round(responseSum / total),
    byPlayer: Object.values(byPlayerMap).map((p) => ({
      ...p,
      accuracy: Math.round((p.correct / p.total) * 100),
      avgResponseMs: Math.round(p.responseSum / p.total),
    })),
    byTag: Object.values(byTagMap)
      .map((t) => ({
        ...t,
        accuracy: Math.round((t.correct / t.total) * 100),
        avgResponseMs: Math.round(t.responseSum / t.total),
      }))
      .sort((a, b) => a.accuracy - b.accuracy),
    byLevel: Object.values(byLevelMap)
      .map((l) => ({
        ...l,
        accuracy: Math.round((l.correct / l.total) * 100),
      }))
      .sort((a, b) => a.level - b.level),
  }
}

/**
 * @param {unknown} data
 * @returns {import('./learningEvent.js').LearningEvent[] | null}
 */
export function parseSessionExport(data) {
  if (!data || typeof data !== 'object') return null
  const events = /** @type {{ events?: unknown }} */ (data).events
  if (!Array.isArray(events)) return null
  return events
}
