import { describe, it, expect } from 'vitest'
import { buildChallengeSequence, getChallengeQuestion } from './challengeEngine.js'

describe('challengeEngine', () => {
  it('produces identical sequences for the same seed', () => {
    const a = buildChallengeSequence('test-seed-42', 5)
    const b = buildChallengeSequence('test-seed-42', 5)
    expect(a.map((q) => q.text)).toEqual(b.map((q) => q.text))
    expect(a.map((q) => q.answer)).toEqual(b.map((q) => q.answer))
  })

  it('differs across seeds', () => {
    const a = getChallengeQuestion('seed-a', 0)
    const b = getChallengeQuestion('seed-b', 0)
    expect(a.text === b.text && a.answer === b.answer).toBe(false)
  })
})
