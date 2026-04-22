import { ref, computed } from 'vue'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Determine difficulty tier based on total combined score.
 * Tier 0 – score  0-4  : single-digit + / -
 * Tier 1 – score  5-9  : single-digit + / - / ×  (small multipliers)
 * Tier 2 – score 10-19 : two-digit  + / -  and small ×
 * Tier 3 – score 20-34 : two-digit  + / - / ×  and easy ÷
 * Tier 4 – score 35+   : two-digit  all-ops with larger numbers
 */
function getTier(totalScore) {
  if (totalScore < 5)  return 0
  if (totalScore < 10) return 1
  if (totalScore < 20) return 2
  if (totalScore < 35) return 3
  return 4
}

/**
 * Generate a question object { text, answer } appropriate for the tier.
 */
function generateQuestion(tier) {
  let a, b, op, answer, text

  const ops = (() => {
    if (tier === 0) return ['+', '-']
    if (tier === 1) return ['+', '-', '×']
    if (tier === 2) return ['+', '-', '×']
    return ['+', '-', '×', '÷']
  })()

  op = ops[randInt(0, ops.length - 1)]

  if (op === '+') {
    if (tier <= 1) {
      a = randInt(1, 9); b = randInt(1, 9)
    } else if (tier === 2) {
      a = randInt(10, 49); b = randInt(1, 20)
    } else {
      a = randInt(10, 99); b = randInt(10, 50)
    }
    answer = a + b
  } else if (op === '-') {
    if (tier <= 1) {
      a = randInt(2, 18); b = randInt(1, a - 1) // ensure answer >= 1
    } else if (tier === 2) {
      a = randInt(21, 60); b = randInt(1, Math.min(20, a - 1))
    } else {
      a = randInt(21, 99); b = randInt(10, a - 1)
    }
    answer = a - b
  } else if (op === '×') {
    if (tier === 1) {
      a = randInt(2, 5); b = randInt(2, 5)
    } else if (tier === 2) {
      a = randInt(2, 9); b = randInt(2, 9)
    } else {
      a = randInt(2, 12); b = randInt(2, 12)
    }
    answer = a * b
  } else {
    // division – always whole numbers
    if (tier === 3) {
      b = randInt(2, 9); answer = randInt(2, 9); a = b * answer
    } else {
      b = randInt(2, 12); answer = randInt(2, 12); a = b * answer
    }
  }

  text = `${a} ${op} ${b}`
  return { text, answer: String(answer) }
}

// ---------------------------------------------------------------------------
// Composable
// ---------------------------------------------------------------------------

export function useGameState() {
  const score1 = ref(0)
  const score2 = ref(0)
  const input1 = ref('')
  const input2 = ref('')

  const totalScore = computed(() => score1.value + score2.value)
  const tier = computed(() => getTier(totalScore.value))

  const currentQuestion = ref(generateQuestion(tier.value))

  // Flash feedback state (brief correct-answer highlight)
  const flash1 = ref(false)
  const flash2 = ref(false)

  function newQuestion() {
    currentQuestion.value = generateQuestion(tier.value)
    input1.value = ''
    input2.value = ''
  }

  function appendDigit(player, digit) {
    if (player === 1) {
      // Prevent leading zeros and overly long inputs
      if (digit === '0' && input1.value === '') return
      if (input1.value.length >= 6) return
      input1.value += digit
      checkAnswer(1)
    } else {
      if (digit === '0' && input2.value === '') return
      if (input2.value.length >= 6) return
      input2.value += digit
      checkAnswer(2)
    }
  }

  function backspace(player) {
    if (player === 1) {
      input1.value = input1.value.slice(0, -1)
    } else {
      input2.value = input2.value.slice(0, -1)
    }
  }

  function checkAnswer(player) {
    const input = player === 1 ? input1.value : input2.value
    if (input === currentQuestion.value.answer) {
      if (player === 1) {
        score1.value++
        flash1.value = true
        setTimeout(() => { flash1.value = false }, 400)
      } else {
        score2.value++
        flash2.value = true
        setTimeout(() => { flash2.value = false }, 400)
      }
      // Small delay so player sees the correct answer briefly
      setTimeout(newQuestion, 300)
    }
  }

  return {
    score1,
    score2,
    input1,
    input2,
    flash1,
    flash2,
    currentQuestion,
    appendDigit,
    backspace,
  }
}
