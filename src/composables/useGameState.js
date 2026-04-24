import { ref } from 'vue'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// ---------------------------------------------------------------------------
// Indonesian motivational quotes
// ---------------------------------------------------------------------------

const winnerQuotes = [
  'Kecepatan luar biasa!',
  'Insting yang tajam!',
  'Pertahankan momentummu!',
  'Kerja bagus, tetap fokus!',
  'Luar biasa! Kamu memimpin!',
  'Otakmu bekerja seperti kalkulator!',
  'Terus gas, jangan beri celah!',
]

const loserQuotes = [
  'Hampir saja! Tarik napas, coba lagi.',
  'Fokus ke soal berikutnya, kamu pasti bisa!',
  'Setiap putaran membuatmu lebih cepat.',
  'Jangan menyerah, balas di ronde ini!',
  'Kamu lebih kuat dari yang kamu pikir!',
  'Satu putaran ini bukan akhir segalanya!',
  'Ayo bangkit, kamu pasti bisa membalas!',
]

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

/**
 * Generate a question for the given level (1-based).
 *
 * Level  1-3  (Kindergarten/Early Elementary):
 *   Single-digit + and − only. Answers always ≥ 1.
 * Level  4-7  (Upper Elementary):
 *   2-digit + / −, single-digit ×
 * Level  8-12 (Middle/High School):
 *   2-digit ×, ÷ (whole quotients), (A + B) × C
 * Level 13+   (College/Extreme):
 *   3-digit ops, squares (n²), (A ÷ B) × C, large ×
 *   Complexity scales infinitely with level.
 */
function generateQuestion(level) {
  let text, answer

  if (level <= 3) {
    if (randInt(0, 1) === 0) {
      const a = randInt(1, 9); const b = randInt(1, 9)
      text = `${a} + ${b}`; answer = a + b
    } else {
      const a = randInt(2, 9); const b = randInt(1, a - 1)
      text = `${a} − ${b}`; answer = a - b
    }
  } else if (level <= 7) {
    const r = randInt(0, 2)
    if (r === 0) {
      const a = randInt(10, 60); const b = randInt(10, 40)
      text = `${a} + ${b}`; answer = a + b
    } else if (r === 1) {
      const a = randInt(20, 90); const b = randInt(10, a - 1)
      text = `${a} − ${b}`; answer = a - b
    } else {
      const a = randInt(2, 9); const b = randInt(2, 9)
      text = `${a} × ${b}`; answer = a * b
    }
  } else if (level <= 12) {
    const r = randInt(0, 2)
    if (r === 0) {
      const a = randInt(3, 15); const b = randInt(3, 15)
      text = `${a} × ${b}`; answer = a * b
    } else if (r === 1) {
      const d = randInt(2, 12); const q = randInt(2, 12)
      text = `${d * q} ÷ ${d}`; answer = q
    } else {
      const c = randInt(2, 9); const a = randInt(2, 9); const b = randInt(2, 9)
      text = `(${a} + ${b}) × ${c}`; answer = (a + b) * c
    }
  } else {
    // Level 13+ – scale with level
    const extra = level - 12
    const r = randInt(0, 3)
    if (r === 0) {
      const cap = Math.min(900, 100 + extra * 30)
      const a = randInt(100, cap)
      if (randInt(0, 1) === 0) {
        const b = randInt(10, Math.min(200, Math.floor(cap / 2)))
        text = `${a} + ${b}`; answer = a + b
      } else {
        const b = randInt(10, a - 1)
        text = `${a} − ${b}`; answer = a - b
      }
    } else if (r === 1) {
      const maxBase = Math.min(25, 5 + extra)
      const a = randInt(5, maxBase)
      text = `${a}²`; answer = a * a
    } else if (r === 2) {
      const d = randInt(2, 12)
      const q = randInt(2, Math.min(20, 3 + extra))
      const c = randInt(2, Math.min(12, 3 + extra))
      text = `(${d * q} ÷ ${d}) × ${c}`; answer = q * c
    } else {
      const cap = Math.min(50, 12 + extra * 2)
      const a = randInt(10, cap); const b = randInt(10, Math.min(30, cap))
      text = `${a} × ${b}`; answer = a * b
    }
  }

  return { text, answer: String(answer) }
}

// ---------------------------------------------------------------------------
// Composable
// ---------------------------------------------------------------------------

const MOMENTUM_WIN = 5

export function useGameState() {
  const level = ref(1)
  // +5 = Player 1 wins round, -5 = Player 2 wins round
  const momentum = ref(0)

  const input1 = ref('')
  const input2 = ref('')

  // Freeze all keypad input during the 1.5 s transition window
  const frozen = ref(false)

  // Which player just answered correctly (null | 1 | 2)
  const scoredPlayer = ref(null)

  // Which player just won the round (null | 1 | 2) – set simultaneously with frozen
  const roundWinner = ref(null)

  // Motivational quote displayed on round end (null | string)
  const currentQuote = ref(null)

  // Shake animation triggers for each player's answer box
  const shake1 = ref(false)
  const shake2 = ref(false)

  const currentQuestion = ref(generateQuestion(1))

  function newQuestion() {
    currentQuestion.value = generateQuestion(level.value)
    input1.value = ''
    input2.value = ''
    frozen.value = false
    scoredPlayer.value = null
    currentQuote.value = null
  }

  function triggerShake(player) {
    if (player === 1) {
      shake1.value = false
      // Force DOM to re-register the class on next tick
      setTimeout(() => { shake1.value = true }, 0)
      setTimeout(() => { shake1.value = false }, 600) // slightly longer than 0.5s CSS animation
    } else {
      shake2.value = false
      setTimeout(() => { shake2.value = true }, 0)
      setTimeout(() => { shake2.value = false }, 600) // slightly longer than 0.5s CSS animation
    }
  }

  function appendDigit(player, digit) {
    if (frozen.value) return
    // +1 extra char beyond the correct answer so a same-length wrong entry triggers the shake
    const maxLen = currentQuestion.value.answer.length + 1
    if (player === 1) {
      if (digit === '0' && input1.value === '') return
      if (input1.value.length >= maxLen) return
      input1.value += digit
      checkAnswer(1)
    } else {
      if (digit === '0' && input2.value === '') return
      if (input2.value.length >= maxLen) return
      input2.value += digit
      checkAnswer(2)
    }
  }

  function backspace(player) {
    if (frozen.value) return
    if (player === 1) {
      input1.value = input1.value.slice(0, -1)
    } else {
      input2.value = input2.value.slice(0, -1)
    }
  }

  function checkAnswer(player) {
    const input = player === 1 ? input1.value : input2.value
    const correct = currentQuestion.value.answer

    if (input === correct) {
      // --- Correct! ---
      frozen.value = true
      scoredPlayer.value = player

      if (player === 1) {
        momentum.value = Math.min(MOMENTUM_WIN, momentum.value + 1)
      } else {
        momentum.value = Math.max(-MOMENTUM_WIN, momentum.value - 1)
      }

      if (Math.abs(momentum.value) >= MOMENTUM_WIN) {
        const winner = momentum.value > 0 ? 1 : 2
        roundWinner.value = winner
        // Assign a quote to each player's perspective (winner / loser)
        currentQuote.value = {
          winner: pickRandom(winnerQuotes),
          loser:  pickRandom(loserQuotes),
        }
        setTimeout(() => {
          level.value++
          momentum.value = 0
          roundWinner.value = null
          newQuestion()
        }, 1500)
      } else {
        setTimeout(newQuestion, 1500)
      }
    } else if (input.length >= correct.length) {
      // Same length (or longer by 1 due to maxLen+1 guard) but wrong → shake
      triggerShake(player)
    }
  }

  return {
    level,
    momentum,
    input1,
    input2,
    frozen,
    scoredPlayer,
    roundWinner,
    currentQuote,
    shake1,
    shake2,
    currentQuestion,
    appendDigit,
    backspace,
  }
}
