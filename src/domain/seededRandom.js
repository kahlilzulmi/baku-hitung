/**
 * FNV-1a hash for string seeds.
 * @param {string} seed
 */
export function hashSeed(seed) {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/**
 * @param {string} seed
 * @returns {() => number} RNG in [0, 1)
 */
export function createSeededRng(seed) {
  let state = hashSeed(String(seed))
  return function next() {
    state += 0x6D2B79F5
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * @param {string} seed
 * @param {number} index
 */
export function rngForChallengeIndex(seed, index) {
  return createSeededRng(`${seed}#${index}`)
}
