# BakuHitung — Engineering Roadmap

Incremental delivery only. **One milestone (or sub-milestone) per branch → commit → push → verify deploy.** Do not batch multiple milestones in one PR.

---

## How to work (required)

1. Pick **exactly one** unchecked item below (start at the top of your chosen phase).
2. Create a branch: `feat/<short-name>` or `chore/<short-name>`.
3. Implement **only** that item. Keep the diff small enough to review in ~10 minutes.
4. Run locally:
   ```bash
   npm install
   npm run build
   npm test          # after M0.2 exists; skip only before tests are added
   ```
5. Commit with [Conventional Commits](https://www.conventionalcommits.org/):  
   `feat: …` · `fix: …` · `chore: …` · `test: …` · `docs: …`
6. Push and open a PR (or push to `main` if solo — still **one milestone per push**).
7. Confirm Netlify preview/production build is green.
8. Check the box in this file in a **follow-up** `docs: mark Mx.x done` commit, or include `docs(roadmap): complete Mx.x` in the same PR if your team prefers.

**Rule:** If the item feels too big, split it — do not merge a “Phase 1” megacommit.

---

## Phase 0 — Foundation

| ID | Task | Done |
|----|------|:----:|
| **M0.1** | Extract `generateQuestion` (+ helpers) to `src/domain/questionEngine.js`; `useGameState` imports it. No behavior change. | [x] |
| **M0.2** | Add Vitest + `npm test`; tests for level bands 1–3, 4–7, 8–12, 13+ (smoke: valid `{ text, answer }`, answer is numeric string). | [x] |
| **M0.3** | Extract `MOMENTUM_WIN`, freeze duration (1500ms) to `src/config/gameDefaults.js`. | [x] |
| **M0.4** | Extract winner/loser quotes to `src/config/quotes.id.js`. | [x] |
| **M0.5** | Add GitHub Action: `npm ci` → `npm run build` → `npm test` on push/PR. | [x] |
| **M0.6** | Add `vue-i18n` (or minimal `messages/id.json` loader); move overlay strings (`Round Won!`, etc.) to Indonesian. | [x] |

---

## Phase 1 — Learning intelligence (offline-first)

| ID | Task | Done |
|----|------|:----:|
| **M1.1** | Define `LearningEvent` shape in `src/domain/learningEvent.js` (JSDoc or `.ts` if you add TS later). | [x] |
| **M1.2** | Emit event on correct answer (sessionId, player, level, question, responseMs, `correct: true`). | [x] |
| **M1.3** | Emit event on wrong same-length answer (`correct: false`). | [x] |
| **M1.4** | Persist events to `sessionStorage`; cap list (e.g. last 500) to avoid quota issues. | [x] |
| **M1.5** | Add `skillTags` to generated questions (e.g. `add`, `subtract`, `multiply`, `divide`, `multi-step`). | [x] |
| **M1.6** | “Export session” button in UI → download `baku-hitung-session-<date>.json`. | [x] |
| **M1.7** | Weighted question pick: 70% from configurable weak tags, 30% random (config in `gameDefaults.js`). | [x] |

---

## Phase 2 — Pedagogy & game modes

| ID | Task | Done |
|----|------|:----:|
| **M2.1** | `LobbyView`: player names (optional), language toggle, “Start duel”. | [x] |
| **M2.2** | Curriculum preset: “Kelas 3 — perkalian 1–9” maps to level band + tag filter (one preset only). | [x] |
| **M2.3** | Practice mode: single player, no momentum UI; same question engine. | [x] |
| **M2.4** | Per-question `responseMs` + optional subtle timer display (config flag, default off). | [x] |
| **M2.5** | Game mode toggle: `gentle` (current) vs `competitive` (wrong answer −1 momentum). | [x] |
| **M2.6** | Second curriculum preset (e.g. “Kelas 4 — penjumlahan 2 digit”). | [x] |

---

## Phase 3 — Classroom & scale

| ID | Task | Done |
|----|------|:----:|
| **M3.1** | PWA: `vite-plugin-pwa`, offline shell, icons. | [x] |
| **M3.2** | Optional Supabase/Firebase: anonymous `sessions` + `events` insert (env-gated). | [x] |
| **M3.3** | `/teacher` route: read-only aggregates from exported JSON (no backend) OR from API if M3.2 done. | [x] |
| **M3.4** | Async challenge link: URL seed → same question sequence for two devices (compare times locally). | [x] |

---

## Phase 4 — Inclusion & polish

| ID | Task | Done |
|----|------|:----:|
| **M4.1** | `prefers-reduced-motion`: disable shake + quote pulse. | [x] |
| **M4.2** | `aria-live` on question/answer; keypad `aria-label`s audit. | [x] |
| **M4.3** | High-contrast theme toggle. | [x] |
| **M4.4** | Optional dyslexia-friendly font toggle. | [x] |

---

## Suggested order

```
M0.1 → M0.2 → M0.3 → M0.4 → M0.5 → M0.6
  → M1.1 → … → M1.7
  → M2.1 → …
```

Skip ahead only if a dependency is already done (e.g. don’t do M1.7 before M1.5).

---

## PR checklist (copy into description)

- [ ] Single roadmap ID (e.g. **M0.2**)
- [ ] `npm run build` passes
- [ ] `npm test` passes (when applicable)
- [ ] No unrelated refactors
- [ ] README updated only if behavior/user-facing flow changed

---

## Context

BakuHitung is a split-screen, local two-player mental math duel (tug-of-war momentum). Core logic lives in `src/composables/useGameState.js` and `src/components/PlayerPanel.vue`. See [README.md](./README.md) for product overview.

**Ed-tech goal:** measurable practice (events + skill tags) and teacher-friendly sessions, without losing the face-to-face, one-device experience.
