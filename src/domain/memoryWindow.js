import {
  CRITICAL_MOMENTUM,
  MEMORY_WINDOW_MS,
  NORMAL_MOMENTUM,
} from '../config/gameDefaults.js'

/**
 * Direct-retrieval window: ≤ 3000ms counts as memory; slower implies calculation.
 * @param {number} responseMs
 * @param {number} [windowMs]
 */
export function isCriticalHit(responseMs, windowMs = MEMORY_WINDOW_MS) {
  return responseMs <= windowMs
}

/**
 * @param {number} responseMs
 * @param {number} [windowMs]
 * @returns {number}
 */
export function momentumDelta(responseMs, windowMs = MEMORY_WINDOW_MS) {
  return isCriticalHit(responseMs, windowMs) ? CRITICAL_MOMENTUM : NORMAL_MOMENTUM
}

/**
 * @param {number} elapsedMs
 * @param {number} [windowMs]
 * @returns {number} 0–100
 */
export function memoryWindowFillPercent(elapsedMs, windowMs = MEMORY_WINDOW_MS) {
  if (windowMs <= 0) return 100
  return Math.min(100, Math.max(0, (elapsedMs / windowMs) * 100))
}
