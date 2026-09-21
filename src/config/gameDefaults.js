export const MOMENTUM_WIN = 5
export const ROUND_FREEZE_MS = 1500

/** Direct-retrieval vs calculation cutoff (ms). Critical if response ≤ this. */
export const MEMORY_WINDOW_MS = 3000
export const CRITICAL_MOMENTUM = 2
export const NORMAL_MOMENTUM = 1

/** Fraction of questions biased toward weak skill tags (M1.7) */
export const WEAK_TAG_PICK_RATIO = 0.7
export const MAX_WEAK_TAG_PICK_ATTEMPTS = 24

/** Show elapsed ms under the question (M2.4); default off */
export const SHOW_QUESTION_TIMER = false

/** Hold duration before duel chrome actions fire (ms) */
export const HOLD_ACTIVATE_MS = 700
