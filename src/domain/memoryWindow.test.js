import { describe, it, expect } from 'vitest'
import {
  isCriticalHit,
  memoryWindowFillPercent,
  momentumDelta,
} from './memoryWindow.js'

describe('isCriticalHit', () => {
  it('is true at 0ms and exactly 3000ms', () => {
    expect(isCriticalHit(0)).toBe(true)
    expect(isCriticalHit(3000)).toBe(true)
  })

  it('is false above 3000ms', () => {
    expect(isCriticalHit(3001)).toBe(false)
  })
})

describe('momentumDelta', () => {
  it('returns 2 inside the memory window and 1 after', () => {
    expect(momentumDelta(1200)).toBe(2)
    expect(momentumDelta(3000)).toBe(2)
    expect(momentumDelta(3001)).toBe(1)
  })
})

describe('memoryWindowFillPercent', () => {
  it('fills 0–100% over the window then caps', () => {
    expect(memoryWindowFillPercent(0)).toBe(0)
    expect(memoryWindowFillPercent(1500)).toBe(50)
    expect(memoryWindowFillPercent(3000)).toBe(100)
    expect(memoryWindowFillPercent(8000)).toBe(100)
  })
})
