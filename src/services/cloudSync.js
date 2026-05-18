const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export function isCloudSyncEnabled() {
  return Boolean(url && anonKey)
}

function headers() {
  return {
    apikey: anonKey,
    Authorization: `Bearer ${anonKey}`,
    'Content-Type': 'application/json',
  }
}

/**
 * @param {string} sessionId
 * @param {Record<string, unknown>} meta
 */
export async function syncSessionStart(sessionId, meta = {}) {
  if (!isCloudSyncEnabled()) return
  await fetch(`${url}/rest/v1/sessions`, {
    method: 'POST',
    headers: { ...headers(), Prefer: 'return=minimal' },
    body: JSON.stringify({
      id: sessionId,
      started_at: new Date().toISOString(),
      ...meta,
    }),
  })
}

/**
 * @param {import('../domain/learningEvent.js').LearningEvent} event
 */
export async function syncLearningEvent(event) {
  if (!isCloudSyncEnabled()) return
  await fetch(`${url}/rest/v1/events`, {
    method: 'POST',
    headers: { ...headers(), Prefer: 'return=minimal' },
    body: JSON.stringify({
      session_id: event.sessionId,
      player: event.player,
      level: event.level,
      question_text: event.questionText,
      expected_answer: event.expectedAnswer,
      skill_tags: event.skillTags,
      response_ms: event.responseMs,
      correct: event.correct,
      attempt: event.attempt ?? null,
      created_at: new Date(event.timestamp).toISOString(),
    }),
  })
}

/**
 * @param {string} sessionId
 * @returns {Promise<import('../domain/learningEvent.js').LearningEvent[]>}
 */
export async function fetchSessionEvents(sessionId) {
  if (!isCloudSyncEnabled()) return []
  const params = new URLSearchParams({
    session_id: `eq.${sessionId}`,
    select: '*',
    order: 'created_at.asc',
  })
  const res = await fetch(`${url}/rest/v1/events?${params}`, { headers: headers() })
  if (!res.ok) throw new Error(`Cloud fetch failed (${res.status})`)
  const rows = await res.json()
  return rows.map((row) => ({
    sessionId: row.session_id,
    player: row.player,
    level: row.level,
    questionText: row.question_text,
    expectedAnswer: row.expected_answer,
    skillTags: row.skill_tags ?? [],
    responseMs: row.response_ms,
    correct: row.correct,
    attempt: row.attempt ?? undefined,
    timestamp: new Date(row.created_at).getTime(),
  }))
}
