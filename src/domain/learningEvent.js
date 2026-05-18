/**
 * @typedef {Object} LearningEvent
 * @property {string} sessionId - UUID for this app session
 * @property {1|2} player
 * @property {number} level - 1-based difficulty level when the question was shown
 * @property {string} questionText - Display text of the question (without "=")
 * @property {string} expectedAnswer - Correct answer as numeric string
 * @property {string[]} skillTags - e.g. add, subtract, multiply, divide, multi-step
 * @property {number} responseMs - Time from question shown to answer submitted
 * @property {boolean} correct
 * @property {string} [attempt] - Player input when correct is false
 * @property {number} timestamp - `Date.now()` when the event was recorded
 */

/**
 * @param {Partial<LearningEvent> & Pick<LearningEvent, 'sessionId' | 'player' | 'level' | 'questionText' | 'expectedAnswer' | 'skillTags' | 'responseMs' | 'correct'>} fields
 * @returns {LearningEvent}
 */
export function createLearningEvent(fields) {
  return {
    timestamp: Date.now(),
    ...fields,
  }
}
