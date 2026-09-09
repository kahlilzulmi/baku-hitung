import { ref, onUnmounted } from 'vue'
import { pickQuestion, clampLevel } from '../domain/questionEngine.js'
import { MOMENTUM_WIN, ROUND_FREEZE_MS } from '../config/gameDefaults.js'
import { isCriticalHit, momentumDelta } from '../domain/memoryWindow.js'
import { winnerQuotes, loserQuotes, pickRandom } from '../config/quotes.id.js'
import { appendLearningEvent, deriveWeakSkillTags, loadLearningEvents } from '../domain/learningStore.js'
import { getCurriculumPreset } from '../config/curriculumPresets.js'
import { isCloudSyncEnabled, syncSessionStart } from '../services/cloudSync.js'

function createSessionId() {
  return crypto.randomUUID?.() ?? `session-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

/**
 * @typedef {Object} GameSession
 * @property {'duel' | 'practice'} playMode
 * @property {'gentle' | 'competitive'} [scoringMode]
 * @property {string | null} [curriculumId]
 * @property {boolean} [showTimer]
 */

/**
 * @param {GameSession} session
 */
export function useGameState(session) {
  const playMode = session.playMode ?? 'duel'
  const scoringMode = session.scoringMode ?? 'gentle'
  const showTimer = session.showTimer ?? false
  const curriculum = getCurriculumPreset(session.curriculumId)

  const pickOptions = curriculum
    ? { levelMin: curriculum.levelMin, levelMax: curriculum.levelMax, tagFilter: curriculum.tagFilter }
    : {}

  const sessionId = createSessionId()

  if (isCloudSyncEnabled()) {
    syncSessionStart(sessionId, {
      play_mode: session.playMode ?? 'duel',
      curriculum_id: session.curriculumId ?? null,
      scoring_mode: session.scoringMode ?? 'gentle',
    }).catch(() => {})
  }

  const level = ref(curriculum?.levelMin ?? 1)
  const momentum = ref(0)
  const practiceStreak = ref(0)

  const input1 = ref('')
  const input2 = ref('')

  const frozen = ref(false)
  const scoredPlayer = ref(null)
  const roundWinner = ref(null)
  const currentQuote = ref(null)

  const shake1 = ref(false)
  const shake2 = ref(false)

  const lastResponseMs = ref(null)
  const lastWasCritical = ref(false)
  const questionElapsedMs = ref(0)

  let questionShownAt = performance.now()
  let pausedElapsedMs = 0
  let clockPaused = false
  let pendingNewQuestion = false
  let rafId = null

  function effectiveLevel() {
    return clampLevel(level.value, curriculum?.levelMin, curriculum?.levelMax)
  }

  function bumpLevel() {
    const next = level.value + 1
    level.value = curriculum?.levelMax != null
      ? Math.min(curriculum.levelMax, next)
      : next
  }

  const currentQuestion = ref(
    pickQuestion(effectiveLevel(), [], pickOptions),
  )

  function elapsedNow() {
    if (clockPaused) return pausedElapsedMs
    return Math.max(0, performance.now() - questionShownAt)
  }

  function markQuestionShown() {
    pausedElapsedMs = 0
    questionShownAt = performance.now()
    questionElapsedMs.value = 0
  }

  function startClockLoop() {
    stopClockLoop()
    const tick = () => {
      if (!clockPaused && !frozen.value) {
        questionElapsedMs.value = Math.round(elapsedNow())
      }
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
  }

  function stopClockLoop() {
    if (rafId != null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
  }

  /**
   * Freeze/unfreeze the memory-window clock (duel pause menu).
   * @param {boolean} value
   */
  function setPaused(value) {
    if (value === clockPaused) return
    if (value) {
      pausedElapsedMs = elapsedNow()
      clockPaused = true
      questionElapsedMs.value = Math.round(pausedElapsedMs)
    } else {
      questionShownAt = performance.now() - pausedElapsedMs
      clockPaused = false
      if (pendingNewQuestion) newQuestion()
    }
  }

  function nextQuestion() {
    const weakTags = deriveWeakSkillTags(loadLearningEvents())
    currentQuestion.value = pickQuestion(effectiveLevel(), weakTags, pickOptions)
    markQuestionShown()
  }

  function newQuestion() {
    if (clockPaused) {
      pendingNewQuestion = true
      return
    }
    pendingNewQuestion = false
    nextQuestion()
    input1.value = ''
    input2.value = ''
    frozen.value = false
    scoredPlayer.value = null
    currentQuote.value = null
    roundWinner.value = null
    lastWasCritical.value = false
  }

  startClockLoop()

  function recordEvent(player, input, correct, responseMs) {
    const q = currentQuestion.value
    appendLearningEvent({
      sessionId,
      player,
      level: level.value,
      questionText: q.text,
      expectedAnswer: q.answer,
      skillTags: q.skillTags,
      responseMs,
      correct,
      ...(correct ? {} : { attempt: input }),
    })
  }

  function applyCompetitivePenalty(player) {
    if (scoringMode !== 'competitive' || playMode !== 'duel') return
    if (player === 1) {
      momentum.value = Math.max(-MOMENTUM_WIN, momentum.value - 1)
    } else {
      momentum.value = Math.min(MOMENTUM_WIN, momentum.value + 1)
    }
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

  function handleCorrect(player) {
    if (frozen.value) return

    const input = player === 1 ? input1.value : input2.value
    const responseMs = Math.round(elapsedNow())
    lastResponseMs.value = responseMs
    lastWasCritical.value = isCriticalHit(responseMs)
    questionElapsedMs.value = responseMs
    recordEvent(player, input, true, responseMs)

    frozen.value = true
    scoredPlayer.value = player

    const delta = momentumDelta(responseMs)

    if (playMode === 'practice') {
      practiceStreak.value += delta
      if (practiceStreak.value >= MOMENTUM_WIN) {
        roundWinner.value = 1
        practiceStreak.value = 0
        setTimeout(() => {
          bumpLevel()
          roundWinner.value = null
          newQuestion()
        }, ROUND_FREEZE_MS)
      } else {
        setTimeout(newQuestion, ROUND_FREEZE_MS)
      }
      return
    }

    if (player === 1) {
      momentum.value = Math.min(MOMENTUM_WIN, momentum.value + delta)
    } else {
      momentum.value = Math.max(-MOMENTUM_WIN, momentum.value - delta)
    }

    if (Math.abs(momentum.value) >= MOMENTUM_WIN) {
      roundWinner.value = momentum.value > 0 ? 1 : 2
      currentQuote.value = {
        winner: pickRandom(winnerQuotes),
        loser: pickRandom(loserQuotes),
      }
      setTimeout(() => {
        bumpLevel()
        momentum.value = 0
        roundWinner.value = null
        newQuestion()
      }, ROUND_FREEZE_MS)
    } else {
      setTimeout(newQuestion, ROUND_FREEZE_MS)
    }
  }

  function handleWrong(player) {
    const input = player === 1 ? input1.value : input2.value
    const responseMs = Math.round(elapsedNow())
    lastResponseMs.value = responseMs
    recordEvent(player, input, false, responseMs)
    applyCompetitivePenalty(player)
    triggerShake(player)
  }

  function appendDigit(player, digit) {
    if (frozen.value || clockPaused) return
    if (playMode === 'practice' && player !== 1) return

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
    if (frozen.value || clockPaused) return
    if (playMode === 'practice' && player !== 1) return
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
      handleCorrect(player)
    } else if (input.length >= correct.length) {
      handleWrong(player)
    }
  }

  onUnmounted(stopClockLoop)

  return {
    sessionId,
    playMode,
    level,
    momentum,
    practiceStreak,
    input1,
    input2,
    frozen,
    scoredPlayer,
    roundWinner,
    currentQuote,
    shake1,
    shake2,
    currentQuestion,
    lastResponseMs,
    lastWasCritical,
    questionElapsedMs,
    showTimer,
    setPaused,
    appendDigit,
    backspace,
  }
}
