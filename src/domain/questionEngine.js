import {
  WEAK_TAG_PICK_RATIO,
  MAX_WEAK_TAG_PICK_ATTEMPTS,
} from '../config/gameDefaults.js'

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * @param {string} text
 * @param {number} answer
 * @param {string[]} skillTags
 */
function makeQuestion(text, answer, skillTags) {
  return { text, answer: String(answer), skillTags }
}

/**
 * @param {string[]} skillTags
 * @param {string[]} weakTags
 */
function matchesWeakTags(skillTags, weakTags) {
  if (!weakTags.length) return false
  return skillTags.some((t) => weakTags.includes(t))
}

/**
 * @param {string[]} skillTags
 * @param {string[]} tagFilter
 */
function matchesTagFilter(skillTags, tagFilter) {
  if (!tagFilter?.length) return true
  return tagFilter.some((t) => skillTags.includes(t))
}

/**
 * @param {number} level
 * @param {number} [min]
 * @param {number} [max]
 */
export function clampLevel(level, min, max) {
  let v = level
  if (min != null) v = Math.max(min, v)
  if (max != null) v = Math.min(max, v)
  return v
}

/**
 * Generate a question for the given level (1-based).
 * @param {number} level
 * @returns {{ text: string, answer: string, skillTags: string[] }}
 */
export function generateQuestion(level) {
  if (level <= 3) {
    if (randInt(0, 1) === 0) {
      const a = randInt(1, 9); const b = randInt(1, 9)
      return makeQuestion(`${a} + ${b}`, a + b, ['add'])
    }
    const a = randInt(2, 9); const b = randInt(1, a - 1)
    return makeQuestion(`${a} − ${b}`, a - b, ['subtract'])
  }

  if (level <= 7) {
    const r = randInt(0, 2)
    if (r === 0) {
      const a = randInt(10, 60); const b = randInt(10, 40)
      return makeQuestion(`${a} + ${b}`, a + b, ['add'])
    }
    if (r === 1) {
      const a = randInt(20, 90); const b = randInt(10, a - 1)
      return makeQuestion(`${a} − ${b}`, a - b, ['subtract'])
    }
    const a = randInt(2, 9); const b = randInt(2, 9)
    return makeQuestion(`${a} × ${b}`, a * b, ['multiply'])
  }

  if (level <= 12) {
    const r = randInt(0, 2)
    if (r === 0) {
      const a = randInt(3, 15); const b = randInt(3, 15)
      return makeQuestion(`${a} × ${b}`, a * b, ['multiply'])
    }
    if (r === 1) {
      const d = randInt(2, 12); const q = randInt(2, 12)
      return makeQuestion(`${d * q} ÷ ${d}`, q, ['divide'])
    }
    const c = randInt(2, 9); const a = randInt(2, 9); const b = randInt(2, 9)
    return makeQuestion(`(${a} + ${b}) × ${c}`, (a + b) * c, ['multi-step', 'add', 'multiply'])
  }

  const extra = level - 12
  const r = randInt(0, 3)
  if (r === 0) {
    const cap = Math.min(900, 100 + extra * 30)
    const a = randInt(100, cap)
    if (randInt(0, 1) === 0) {
      const b = randInt(10, Math.min(200, Math.floor(cap / 2)))
      return makeQuestion(`${a} + ${b}`, a + b, ['add'])
    }
    const b = randInt(10, a - 1)
    return makeQuestion(`${a} − ${b}`, a - b, ['subtract'])
  }
  if (r === 1) {
    const maxBase = Math.min(25, 5 + extra)
    const a = randInt(5, maxBase)
    return makeQuestion(`${a}²`, a * a, ['multiply'])
  }
  if (r === 2) {
    const d = randInt(2, 12)
    const q = randInt(2, Math.min(20, 3 + extra))
    const c = randInt(2, Math.min(12, 3 + extra))
    return makeQuestion(`(${d * q} ÷ ${d}) × ${c}`, q * c, ['multi-step', 'divide', 'multiply'])
  }
  const cap = Math.min(50, 12 + extra * 2)
  const a = randInt(10, cap); const b = randInt(10, Math.min(30, cap))
  return makeQuestion(`${a} × ${b}`, a * b, ['multiply'])
}

/**
 * @typedef {Object} PickQuestionOptions
 * @property {number} [levelMin]
 * @property {number} [levelMax]
 * @property {string[]} [tagFilter]
 */

const MAX_TAG_FILTER_ATTEMPTS = 32

/**
 * @param {number} level
 * @param {string[]} [weakTags]
 * @param {PickQuestionOptions} [options]
 */
export function pickQuestion(level, weakTags = [], options = {}) {
  const { levelMin, levelMax, tagFilter } = options
  const effectiveLevel = clampLevel(level, levelMin, levelMax)

  const useWeakBias =
    weakTags.length > 0 && Math.random() < WEAK_TAG_PICK_RATIO

  const maxAttempts = tagFilter?.length
    ? MAX_TAG_FILTER_ATTEMPTS
    : useWeakBias
      ? MAX_WEAK_TAG_PICK_ATTEMPTS
      : 1

  for (let i = 0; i < maxAttempts; i++) {
    const q = generateQuestion(effectiveLevel)
    if (tagFilter?.length && !matchesTagFilter(q.skillTags, tagFilter)) continue
    if (useWeakBias && !matchesWeakTags(q.skillTags, weakTags)) continue
    return q
  }

  return generateQuestion(effectiveLevel)
}
