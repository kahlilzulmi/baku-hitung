# Contributing to BakuHitung

Thank you for helping improve **BakuHitung** — a real-time, split-screen mental math duel built for classrooms and families. Contributions that make the game **fairer, more accessible, easier to teach with, or easier to maintain** are especially welcome.

This project is [MIT licensed](./LICENSE). By contributing, you agree that your work may be distributed under the same license.

---

## Table of contents

- [Before you start](#before-you-start)
- [Development setup](#development-setup)
- [How we work on features](#how-we-work-on-features)
- [Project layout](#project-layout)
- [Coding guidelines](#coding-guidelines)
- [Testing](#testing)
- [Internationalization](#internationalization)
- [Pedagogy & UX](#pedagogy--ux)
- [Pull requests](#pull-requests)
- [Reporting bugs & ideas](#reporting-bugs--ideas)
- [Optional: cloud sync](#optional-cloud-sync)
- [Human–AI collaboration](#humanai-collaboration)

---

## Before you start

1. Read [README.md](./README.md) for product context.
2. Skim [ROADMAP.md](./ROADMAP.md) (completed baseline) and pick **one** item from [POST-ROADMAP.md](./POST-ROADMAP.md) if you want a scoped task.
3. Open an issue for large or ambiguous changes before investing heavily — we can align on pedagogy and scope early.

**Good first contributions:** tests (F2.x), documentation (F4.x), learning-data correctness (F1.x), accessibility tweaks, i18n copy, and small UI fixes that do not change core scoring rules without discussion.

---

## Development setup

**Requirements:** Node.js **20** (matches CI), npm.

```bash
git clone https://github.com/<your-fork>/baku-hitung.git
cd baku-hitung
npm install
npm run dev
```

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local dev server (Vite). `host: true` helps test on tablets/phones on your LAN. |
| `npm run build` | Production build (must pass before merge). |
| `npm run preview` | Serve the production build locally. |
| `npm test` | Run Vitest unit tests. |

Copy [`.env.example`](./.env.example) to `.env` only if you work on optional Supabase sync; the app runs fully offline without it.

---

## How we work on features

We keep changes **reviewable** and safe for a live classroom tool:

1. **One backlog ID → one branch → one focused PR** (see [POST-ROADMAP.md](./POST-ROADMAP.md)).
2. Branch names: `feat/<short-name>` or `fix/<short-name>`.
3. Implement only that item; avoid drive-by refactors in the same PR.
4. Before opening a PR, run:

   ```bash
   npm install
   npm run build
   npm test
   ```

5. Use [Conventional Commits](https://www.conventionalcommits.org/) and reference the backlog ID when applicable, e.g. `fix: filter export by sessionId (F1.1)`.

Do **not** batch multiple POST-ROADMAP IDs or unrelated features in a single merge unless maintainers agree beforehand.

---

## Project layout

Keep **game rules and math logic** out of Vue components when possible.

```
src/
  config/          # Tunables, curriculum presets, quotes (ID)
  domain/          # Pure logic: questionEngine, challengeEngine, learningEvent, aggregates
  composables/   # Vue state: useGameState, useChallengeState, a11y prefs
  components/    # Presentational / interaction UI
  views/         # Route-level screens (lobby, duel, practice, teacher, challenge)
  services/      # Side effects (e.g. cloudSync)
  i18n/          # vue-i18n messages (en, id)
```

| Layer | Responsibility |
|-------|----------------|
| `domain/` | Deterministic, testable functions; no DOM or `sessionStorage` unless isolated and documented. |
| `composables/` | Session state, timers, wiring domain → UI. |
| `views/` | Layout, routing concerns, composing components. |
| `config/` | Constants (`gameDefaults.js`), presets (`curriculumPresets.js`) — not business algorithms. |

**Routes** (see `src/router/index.js`): `/` (game/lobby flow), `/teacher`, `/challenge/:seed`.

---

## Coding guidelines

- **Vue 3 Composition API** with `<script setup>` where the file already uses it; match surrounding style.
- **Tailwind CSS** for styling; prefer existing utility patterns over one-off CSS unless motion/a11y needs a dedicated class.
- **Minimal scope:** the smallest change that solves the issue. Reuse `domain/` helpers instead of duplicating math or tagging logic.
- **JSDoc** on exported domain functions when types are non-obvious (see `questionEngine.js`).
- **No secrets** in commits — use `.env` (gitignored), never commit keys or tokens.
- **Dependencies:** avoid new packages unless they clearly reduce complexity; discuss in the issue/PR first.

### File naming

- Components: `PascalCase.vue`
- Composables: `useSomething.js`
- Domain modules: `camelCase.js` with colocated `*.test.js`

---

## Testing

Tests run in Vitest with `environment: 'node'` (see `vite.config.js`).

- Add or update tests in `src/domain/*.test.js` when changing:
  - Question generation or difficulty bands
  - Challenge seeding
  - Learning events, export JSON, or teacher aggregates
  - Scoring / momentum rules (extract pure helpers if needed)
- Prefer **table-driven** cases for edge conditions (empty events, single session, wrong answers).
- Run `npm test` locally; CI runs the same on every PR to `main`.

Example:

```bash
npm test
# watch mode during development:
npx vitest
```

---

## Internationalization

User-visible strings should go through **vue-i18n** when they are part of the shared UI (`src/i18n/messages/en.json`, `id.json`).

- Default product language is **Indonesian** (`lang: 'id'` in PWA manifest).
- Add keys to **both** `en` and `id` when introducing new UI copy unless the task explicitly documents ID-only content (e.g. some motivational quotes today live in `src/config/quotes.id.js`).
- Do not hardcode classroom-facing labels in components if a nearby string already uses `$t()`.

---

## Pedagogy & UX

BakuHitung is used with children; treat these as product constraints:

- **Growth mindset:** feedback should encourage persistence, not shame.
- **Fair play:** dual-player layout is symmetric; avoid changes that advantage one orientation without clear pedagogy.
- **Anti-cheat / anti-spam:** respect existing keypad guards and freeze windows in `gameDefaults.js`.
- **Accessibility:** honor `prefers-reduced-motion` patterns in `useA11yPrefs` — do not add mandatory shaking or flashing for core flows.
- **Difficulty:** curriculum presets and level clamps exist for real classrooms; changing bands affects many ages — note it in the PR description.

If your change alters scoring, momentum, or what teachers see in exports, describe the **classroom impact** in the PR.

---

## Pull requests

1. Fork and branch from `main`.
2. Keep PRs small (~10 minute review target when possible).
3. Fill in the PR template (if present) or include:
   - **What** changed
   - **Why** (link issue or POST-ROADMAP ID)
   - **How to test** (steps on desktop + tablet if UI)
   - Screenshots or short screen recording for visual changes
4. Ensure CI is green (`build` + `test`).
5. Netlify deploys previews from PRs — verify touch targets and split-screen layout on a real device when UI changes.

Maintainers may request changes or suggest splitting oversized PRs. Be patient — we optimize for safe releases in school settings.

---

## Reporting bugs & ideas

**Bugs:** include browser/device, steps to reproduce, expected vs actual behavior, and whether learning export / teacher dashboard was involved.

**Ideas:** explain the **learner or teacher** outcome, not only the technical solution. Edutech features should justify their place in a live duel or debrief flow.

Use GitHub Issues when available; otherwise describe the context clearly in your PR.

---

## Optional: cloud sync

Supabase sync is **optional** and env-gated (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`). Schema expectations are documented in `.env.example`. Contributions that add tables or change event shape must update that documentation and remain backward compatible for offline-only users.

---

## Human–AI collaboration

This codebase was bootstrapped with human design and AI-assisted implementation (see [README.md](./README.md)). If you use AI tools:

- **You** are responsible for reviewing correctness, pedagogy, and tests.
- Do not paste large generated refactors without understanding domain impact.
- Disclose significant AI assistance in the PR if it helped produce the diff — transparency helps reviewers.

---

## Questions?

Open an issue or tag `@kahlil` (repository owner) in a PR. Terima kasih — happy to make mental math more fun together.
