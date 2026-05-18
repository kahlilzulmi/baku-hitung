/** @typedef {{ id: string, labelKey: string, levelMin: number, levelMax: number, tagFilter: string[] }} CurriculumPreset */

/** @type {CurriculumPreset[]} */
export const CURRICULUM_PRESETS = [
  {
    id: 'kelas3-multiply',
    labelKey: 'curriculum.kelas3Multiply',
    levelMin: 4,
    levelMax: 7,
    tagFilter: ['multiply'],
  },
  {
    id: 'kelas4-add',
    labelKey: 'curriculum.kelas4Add',
    levelMin: 4,
    levelMax: 7,
    tagFilter: ['add'],
  },
]

/**
 * @param {string | null | undefined} id
 * @returns {CurriculumPreset | null}
 */
export function getCurriculumPreset(id) {
  if (!id) return null
  return CURRICULUM_PRESETS.find((p) => p.id === id) ?? null
}
