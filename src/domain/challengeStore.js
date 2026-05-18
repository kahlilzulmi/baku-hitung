const RESULT_PREFIX = 'baku-challenge-results-'

/**
 * @typedef {Object} ChallengeRunEntry
 * @property {number} index
 * @property {string} questionText
 * @property {number} responseMs
 * @property {boolean} correct
 */

/**
 * @typedef {Object} ChallengeResult
 * @property {string} seed
 * @property {string} playerName
 * @property {string} completedAt
 * @property {number} totalMs
 * @property {number} correctCount
 * @property {ChallengeRunEntry[]} runs
 */

/**
 * @param {string} seed
 * @returns {ChallengeResult[]}
 */
export function loadChallengeResults(seed) {
  try {
    const raw = localStorage.getItem(RESULT_PREFIX + seed)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/**
 * @param {ChallengeResult} result
 */
export function saveChallengeResult(result) {
  const all = loadChallengeResults(result.seed)
  all.push(result)
  localStorage.setItem(RESULT_PREFIX + result.seed, JSON.stringify(all))
}

/**
 * @param {ChallengeResult} result
 */
export function importChallengeResult(result) {
  if (!result?.seed) return
  saveChallengeResult(result)
}
