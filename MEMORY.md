# MEMORY

## 2026-09-09 — 3-second memory window scoring

**What was decided:** Duel and practice score a correct answer as critical (+2 momentum / +2 practice streak) when response time is ≤ 3000ms; otherwise +1. A memory-window bar is always visible (not gated by lobby `showTimer`). Duel pause freezes the window clock. Elapsed time uses `performance.now()` + rAF.

**Why:** Maps the retrieval-vs-calculation design heuristic onto the existing tug-of-war (win at 5) with a small delta instead of replacing momentum with HP.

**Rejected:**
- Approach A (setInterval 100ms, no pause freeze) — less precise, unfair if pause menu is open.
- Approach C (HP/damage rewrite) — larger UX change than requested.
- Gating the bar behind `showTimer` — that checkbox remains for numeric ms only.
