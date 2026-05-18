import { ref } from 'vue'
import { pickQuestion } from '../domain/questionEngine.js'
import { MOMENTUM_WIN, ROUND_FREEZE_MS } from '../config/gameDefaults.js'
import { winnerQuotes, loserQuotes, pickRandom } from '../config/quotes.id.js'
import { appendLearningEvent, deriveWeakSkillTags, loadLearningEvents } from '../domain/learningStore.js'

function createSessionId() {
  return crypto.randomUUID?.() ?? `session-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function useGameState() {
  const sessionId = createSessionId()
  const level = ref(1)
  const momentum = ref(0)

  const input1 = ref('')
  const input2 = ref('')

  const frozen = ref(false)
  const scoredPlayer = ref(null)
  const roundWinner = ref(null)
  const currentQuote = ref(null)

  const shake1 = ref(false)
  const shake2 = ref(false)

  let questionShownAt = Date.now()
  const currentQuestion = ref(pickQuestion(1))

  function nextQuestion() {
    const weakTags = deriveWeakSkillTags(loadLearningEvents())
    currentQuestion.value = pickQuestion(level.value, weakTags)
    questionShownAt = Date.now()
  }

  function newQuestion() {
    nextQuestion()
    input1.value = ''
    input2.value = ''
    frozen.value = false
    scoredPlayer.value = null
    currentQuote.value = null
  }

  function recordEvent(player, input, correct) {
    const q = currentQuestion.value
    appendLearningEvent({
      sessionId,
      player,
      level: level.value,
      questionText: q.text,
      expectedAnswer: q.answer,
      skillTags: q.skillTags,
      responseMs: Math.max(0, Date.now() - questionShownAt),
      correct,
      ...(correct ? {} : { attempt: input }),
    })
  }

  function triggerShake(player) {
    if (player === 1) {
      shake1.value = false
      setTimeout(() => { shake1.value = true }, 0)
      setTimeout(() => { shake1.value = false }, 600)
    } else {
      shake2.value = false
      setTimeout(() => { shake2.value = true }, 0)
      setTimeout(() => { shake2.value = false }, 600)
    }
  }

  function appendDigit(player, digit) {
    if (frozen.value) return
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
      recordEvent(player, input, true)
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
        currentQuote.value = {
          winner: pickRandom(winnerQuotes),
          loser:  pickRandom(loserQuotes),
        }
        setTimeout(() => {
          level.value++
          momentum.value = 0
          roundWinner.value = null
          newQuestion()
        }, ROUND_FREEZE_MS)
      } else {
        setTimeout(newQuestion, ROUND_FREEZE_MS)
      }
    } else if (input.length >= correct.length) {
      recordEvent(player, input, false)
      triggerShake(player)
    }
  }

  return {
    sessionId,
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
