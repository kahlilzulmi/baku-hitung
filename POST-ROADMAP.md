# BakuHitung — Post-roadmap backlog

Work **after** Phases 0–4 ([ROADMAP.md](./ROADMAP.md)). Same rule: **one ID → one branch → one commit → push → green build.**

Audit date: **May 2026**

---

## How to pick work

| Priority | IDs | Why |
|----------|-----|-----|
| **P0** | F1.1, F1.2 | Wrong teacher data / weak-tag bias across sessions |
| **P1** | F4.1, F3.1, F2.1 | Docs + deployability + test safety net |
| **P2** | F3.2, F4.2, F5.x | UX polish and optional product bets |

Start at **F1.1** unless you have a reason to skip.

---

## F1 — Learning data correctness

| ID | Task | Done |
|----|------|:----:|
| **F1.1** | Filter `loadLearningEvents()` by `sessionId` in export (`buildSessionExportJson`), weak-tag derivation (`deriveWeakSkillTags` call site), and document behavior. | [ ] |
| **F1.2** | On new game session in `useGameState`, only use events for current `sessionId` (do not delete other sessions’ data unless product asks for “clear all”). | [ ] |
| **F1.3** | Vitest: export JSON `events` array contains only matching `sessionId`; two sessions in storage do not mix. | [ ] |

**Acceptance (F1.1–F1.3):** Play two duels in one browser tab → export second session → JSON contains only second session’s events.

---

## F2 — Tests

| ID | Task | Done |
|----|------|:----:|
| **F2.1** | Tests for `deriveWeakSkillTags` edge cases (empty, all correct). | [ ] |
| **F2.2** | Tests for `aggregateSession` / `parseSessionExport` in `teacherAggregates.js`. | [ ] |
| **F2.3** | Unit test: competitive mode applies momentum penalty on wrong answer (extract pure helper if needed). | [ ] |

---

## F3 — Ops & classroom

| ID | Task | Done |
|----|------|:----:|
| **F3.1** | Add `supabase/schema.sql` (or `docs/supabase.md`) matching `.env.example` tables: `sessions`, `events`. | [ ] |
| **F3.2** | Surface cloud sync failures in dev (console) and optional teacher UI toast when fetch fails. | [ ] |
| **F3.3** | Challenge mode: document “same device vs export/import rival JSON” in README. | [ ] |

---

## F4 — Documentation

| ID | Task | Done |
|----|------|:----:|
| **F4.1** | Update [README.md](./README.md): lobby, duel/practice, curriculum presets, export, `/teacher`, `/challenge/:seed`, PWA, optional Supabase env vars. | [ ] |
| **F4.2** | Move motivational quotes into i18n (`quotes` in `id.json` / `en.json`) or note ID-only by design. | [ ] |

---

## F5 — Product (optional, not required for “roadmap done”)

| ID | Task | Done |
|----|------|:----:|
| **F5.1** | Per-player level in duel (asymmetric difficulty, shared momentum). | [ ] |
| **F5.2** | Challenge: shareable results URL or QR (still no WebSocket). | [ ] |
| **F5.3** | Extract `gameRules.js` from `useGameState` (momentum win/loss, freeze timing). | [ ] |

---

## Audit reference — what shipped

### Pass (no follow-up required)

- Question engine + level bands + curriculum tag filter  
- CI, i18n overlays, lobby, practice, competitive mode, timer option  
- PWA, teacher dashboard (JSON + optional cloud), a11y toggles  
- Duel center bar, hold-to-exit/export, fullscreen  

### Partial (address in F1 / F3)

| Original ID | Gap |
|-------------|-----|
| M1.6 / M1.7 | Export and weak tags read **all** `sessionStorage` events, not current `sessionId` |
| M3.2 | Client sync only; no schema in repo |
| M3.4 | Cross-device compare via **manual** JSON import, not live sync |

### Process

Original roadmap asked for **one milestone per PR**. History used phase-sized commits (`Phase 0–1`, `Phase 2`, …). Use **F*** IDs one at a time going forward.

---

## PR checklist

```markdown
- [ ] Single POST-ROADMAP ID (e.g. F1.1)
- [ ] npm run build
- [ ] npm test
- [ ] Box checked in this file
```

---

## Commands

```bash
npm install
npm run dev      # local play
npm test
npm run build
```

Optional Supabase (see `.env.example`):

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```
