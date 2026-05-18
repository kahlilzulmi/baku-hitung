import { describe, it, expect } from 'vitest'
import { generateQuestion, pickQuestion } from './questionEngine.js'
import { deriveWeakSkillTags } from './learningStore.js'

const NUMERIC_ANSWER = /^\d+$/
const SAMPLES = 40

function smokeBand(levels, assertShape) {
  for (const level of levels) {
    for (let i = 0; i < SAMPLES; i++) {
      const q = generateQuestion(level)
      expect(q).toHaveProperty('text')
      expect(q).toHaveProperty('answer')
      expect(typeof q.text).toBe('string')
      expect(q.text.length).toBeGreaterThan(0)
      expect(typeof q.answer).toBe('string')
      expect(q.answer).toMatch(NUMERIC_ANSWER)
      expect(Array.isArray(q.skillTags)).toBe(true)
      expect(q.skillTags.length).toBeGreaterThan(0)
      assertShape?.(q, level)
    }
  }
}

describe('generateQuestion', () => {
  it('levels 1–3: single-digit +/− only, answer ≥ 1', () => {
    smokeBand([1, 2, 3], (q) => {
      expect(q.text).toMatch(/^\d [+−] \d$/)
      expect(Number(q.answer)).toBeGreaterThanOrEqual(1)
    })
  })

  it('levels 4–7: 2-digit +/− or single-digit ×', () => {
    smokeBand([4, 5, 6, 7], (q) => {
      const ok =
        /^\d{2} [+−] \d{2}$/.test(q.text) ||
        /^\d [+−] \d{2}$/.test(q.text) ||
        /^\d{2} [+−] \d$/.test(q.text) ||
        /^\d × \d$/.test(q.text)
      expect(ok).toBe(true)
    })
  })

  it('levels 8–12: ×, ÷, or (A + B) × C', () => {
    smokeBand([8, 9, 10, 11, 12], (q) => {
      const ok =
        /^\d+ × \d+$/.test(q.text) ||
        /^\d+ ÷ \d+$/.test(q.text) ||
        /^\(\d+ \+ \d+\) × \d+$/.test(q.text)
      expect(ok).toBe(true)
    })
  })

  it('level 13+: extended ops (smoke)', () => {
    smokeBand([13, 15, 20], (q) => {
      expect(q.text.length).toBeGreaterThan(0)
      expect(Number(q.answer)).toBeGreaterThan(0)
    })
  })

  it('pickQuestion returns valid questions with or without weak tags', () => {
    for (let i = 0; i < 20; i++) {
      const q = pickQuestion(8, ['divide'])
      expect(q.answer).toMatch(NUMERIC_ANSWER)
      expect(q.skillTags.length).toBeGreaterThan(0)
    }
  })
})

describe('pickQuestion curriculum filter', () => {
  it('only returns multiply-tagged questions for kelas3 preset options', () => {
    const opts = { levelMin: 4, levelMax: 7, tagFilter: ['multiply'] }
    for (let i = 0; i < 30; i++) {
      const q = pickQuestion(5, [], opts)
      expect(q.skillTags).toContain('multiply')
    }
  })
})

describe('deriveWeakSkillTags', () => {
  it('ranks tags from incorrect events', () => {
    const weak = deriveWeakSkillTags([
      { correct: false, skillTags: ['multiply'] },
      { correct: false, skillTags: ['multiply', 'add'] },
      { correct: true, skillTags: ['add'] },
    ])
    expect(weak[0]).toBe('multiply')
  })
})
