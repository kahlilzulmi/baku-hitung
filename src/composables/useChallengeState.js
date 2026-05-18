import { ref, computed, onUnmounted } from 'vue'
import {
  CHALLENGE_QUESTION_COUNT,
  buildChallengeSequence,
} from '../domain/challengeEngine.js'
import { saveChallengeResult } from '../domain/challengeStore.js'
import { ROUND_FREEZE_MS } from '../config/gameDefaults.js'

/**
 * @param {string} seed
 * @param {string} playerName
 */
export function useChallengeState(seed, playerName) {
  const questions = buildChallengeSequence(seed)
  const index = ref(0)
  const input = ref('')
  const frozen = ref(false)
  const shake = ref(false)
  const finished = ref(false)
  const runs = ref([])

  let questionShownAt = Date.now()
  const questionElapsedMs = ref(0)
  let timerHandle = null

  function startTimer() {
    if (timerHandle) clearInterval(timerHandle)
    questionElapsedMs.value = 0
    timerHandle = setInterval(() => {
      if (!finished.value && !frozen.value) {
        questionElapsedMs.value = Math.max(0, Date.now() - questionShownAt)
      }
    }, 100)
  }

  startTimer()

  const currentQuestion = computed(() => questions[index.value])
  const progress = computed(() => `${index.value + 1} / ${CHALLENGE_QUESTION_COUNT}`)

  function triggerShake() {
    shake.value = false
    setTimeout(() => { shake.value = true }, 0)
    setTimeout(() => { shake.value = false }, 600)
  }

  function advance(correct, responseMs) {
    runs.value.push({
      index: index.value,
      questionText: currentQuestion.value.text,
      responseMs,
      correct,
    })

    frozen.value = true
    const isLast = index.value >= questions.length - 1

    setTimeout(() => {
      frozen.value = false
      input.value = ''
      if (isLast) {
        finishRun()
      } else {
        index.value++
        questionShownAt = Date.now()
        questionElapsedMs.value = 0
      }
    }, correct ? ROUND_FREEZE_MS : 400)
  }

  function finishRun() {
    finished.value = true
    const totalMs = runs.value.reduce((s, r) => s + r.responseMs, 0)
    const correctCount = runs.value.filter((r) => r.correct).length
    saveChallengeResult({
      seed,
      playerName,
      completedAt: new Date().toISOString(),
      totalMs,
      correctCount,
      runs: runs.value,
    })
  }

  function appendDigit(digit) {
    if (frozen.value || finished.value) return
    const maxLen = currentQuestion.value.answer.length + 1
    if (digit === '0' && input.value === '') return
    if (input.value.length >= maxLen) return
    input.value += digit
    checkAnswer()
  }

  function backspace() {
    if (frozen.value || finished.value) return
    input.value = input.value.slice(0, -1)
  }

  function checkAnswer() {
    const correct = currentQuestion.value.answer
    if (input.value === correct) {
      advance(true, Math.max(0, Date.now() - questionShownAt))
    } else if (input.value.length >= correct.length) {
      triggerShake()
      advance(false, Math.max(0, Date.now() - questionShownAt))
    }
  }

  const summary = computed(() => {
    const totalMs = runs.value.reduce((s, r) => s + r.responseMs, 0)
    const correctCount = runs.value.filter((r) => r.correct).length
    return { totalMs, correctCount, total: runs.value.length }
  })

  onUnmounted(() => {
    if (timerHandle) clearInterval(timerHandle)
  })

  return {
    questions,
    index,
    input,
    frozen,
    shake,
    finished,
    runs,
    currentQuestion,
    progress,
    summary,
    questionElapsedMs,
    appendDigit,
    backspace,
  }
}
