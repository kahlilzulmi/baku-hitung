import { generateQuestion } from './questionEngine.js'
import { rngForChallengeIndex } from './seededRandom.js'

export const CHALLENGE_QUESTION_COUNT = 10
export const CHALLENGE_DEFAULT_LEVEL = 5

/**
 * @param {string} seed
 * @param {number} index
 * @param {number} [level]
 */
export function getChallengeQuestion(seed, index, level = CHALLENGE_DEFAULT_LEVEL) {
  return generateQuestion(level, rngForChallengeIndex(seed, index))
}

/**
 * @param {string} seed
 * @param {number} [count]
 * @param {number} [level]
 */
export function buildChallengeSequence(seed, count = CHALLENGE_QUESTION_COUNT, level = CHALLENGE_DEFAULT_LEVEL) {
  return Array.from({ length: count }, (_, i) => getChallengeQuestion(seed, i, level))
}

/**
 * @returns {string}
 */
export function createChallengeSeed() {
  const part = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`
  return part.replace(/-/g, '').slice(0, 12)
}
