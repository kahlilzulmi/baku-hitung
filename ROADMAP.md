# BakuHitung — Engineering Roadmap

**Status (May 2026):** Phases 0–4 are **implemented**. Treat this file as the **completed baseline**. New work → [POST-ROADMAP.md](./POST-ROADMAP.md) (one item per commit).

---

## Delivery rules (still required)

1. Pick **exactly one** unchecked item in [POST-ROADMAP.md](./POST-ROADMAP.md).
2. Branch: `feat/<short-name>` or `fix/<short-name>`.
3. Implement only that item; keep the PR reviewable in ~10 minutes.
4. Run:
   ```bash
   npm install
   npm run build
   npm test
   ```
5. Commit with [Conventional Commits](https://www.conventionalcommits.org/) and reference the ID (e.g. `fix: filter export by sessionId (F1.1)`).
6. Push → verify Netlify build → check the box in POST-ROADMAP.

**Do not** batch phases or multiple IDs in one merge (see [Audit notes](#audit-notes-may-2026)).

---

## Completed — Phase 0 (Foundation)

| ID | Task | Done |
|----|------|:----:|
| **M0.1** | Extract `generateQuestion` to `src/domain/questionEngine.js` | [x] |
| **M0.2** | Vitest + `npm test`; level-band smoke tests | [x] |
| **M0.3** | `MOMENTUM_WIN`, freeze ms → `src/config/gameDefaults.js` | [x] |
| **M0.4** | Quotes → `src/config/quotes.id.js` | [x] |
| **M0.5** | GitHub Action: `npm ci` → build → test | [x] |
| **M0.6** | `vue-i18n`; overlay strings localized | [x] |

---

## Completed — Phase 1 (Learning intelligence)

| ID | Task | Done | Audit |
|----|------|:----:|-------|
| **M1.1** | `LearningEvent` in `src/domain/learningEvent.js` | [x] | OK |
| **M1.2** | Emit on correct answer | [x] | OK |
| **M1.3** | Emit on wrong same-length answer | [x] | OK |
| **M1.4** | `sessionStorage`, cap 500 | [x] | OK |
| **M1.5** | `skillTags` on questions | [x] | OK |
| **M1.6** | Export session JSON from UI | [x] | **Partial** — see F1.1 |
| **M1.7** | 70% weak-tag bias in `pickQuestion` | [x] | **Partial** — see F1.1 |

---

## Completed — Phase 2 (Pedagogy & game modes)

| ID | Task | Done |
|----|------|:----:|
| **M2.1** | `LobbyView` — names, locale, start duel/practice | [x] |
| **M2.2** | Preset: Kelas 3 perkalian 1–9 | [x] |
| **M2.3** | Practice mode (solo, no momentum UI) | [x] |
| **M2.4** | `responseMs` + optional timer UI | [x] |
| **M2.5** | Gentle vs competitive scoring | [x] |
| **M2.6** | Preset: Kelas 4 penjumlahan 2 digit | [x] |

---

## Completed — Phase 3 (Classroom & scale)

| ID | Task | Done | Audit |
|----|------|:----:|-------|
| **M3.1** | PWA (`vite-plugin-pwa`) | [x] | OK |
| **M3.2** | Optional Supabase sync (env-gated) | [x] | **Partial** — see F3.1 |
| **M3.3** | `/teacher` dashboard | [x] | OK |
| **M3.4** | Async challenge link + seeded questions | [x] | **Partial** — manual rival import |

---

## Completed — Phase 4 (Inclusion)

| ID | Task | Done |
|----|------|:----:|
| **M4.1** | `prefers-reduced-motion` — no shake / quote pulse | [x] |
| **M4.2** | `aria-live` + keypad labels | [x] |
| **M4.3** | High-contrast theme | [x] |
| **M4.4** | Dyslexia-friendly font toggle | [x] |

---

## Audit notes (May 2026)

| Check | Result |
|-------|--------|
| `npm test` / `npm run build` | Pass |
| Features vs checklist | ~24/25 full; 3 partial (export scope, Supabase ops, challenge compare) |
| Git history vs “one ID per PR” | **Not followed** — phases landed as bulk commits; use POST-ROADMAP for granular fixes |
| README | Out of date — see **F4.1** |

Full findings and file map: [POST-ROADMAP.md](./POST-ROADMAP.md).

---

## Architecture (current)

```
src/
  config/           gameDefaults, curriculumPresets, quotes.id
  domain/           questionEngine, learningEvent, learningStore,
                    teacherAggregates, challengeEngine, challengeStore
  composables/      useGameState, useA11yPrefs, useChallengeState, …
  views/            GameView, LobbyView, DuelView, PracticeView,
                    TeacherView, ChallengeView, …
  components/       PlayerPanel, DuelCenterBar, GameFeedbackOverlay, …
  services/         cloudSync.js (optional Supabase)
  router/           /, /teacher, /challenge/:seed
```

**Ed-tech goal:** face-to-face duel + measurable practice (events, skill tags, teacher export) without losing single-device play.

---

## PR checklist

- [ ] Single POST-ROADMAP ID (e.g. **F1.1**)
- [ ] `npm run build` passes
- [ ] `npm test` passes
- [ ] No unrelated refactors
- [ ] README / schema docs updated if user-facing or ops changed
