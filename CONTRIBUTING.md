# Contributing

Thanks for your interest in contributing to HN Who's Hiring!

## Setup

```bash
git clone https://github.com/vrk7/yc-whoshiring.git
cd yc-whoshiring
npm install
npm run dev
```

To develop without hitting the HN API, set `USE_MOCK_DATA = true` in `js/config.ts`.

## Project structure

The app is vanilla TypeScript + Vite — no framework. See [CLAUDE.md](CLAUDE.md) for a full breakdown of module responsibilities and data flow.

Key files:
- `js/app.ts` — entry point, lifecycle wiring
- `js/state.ts` — all runtime state
- `js/ui-render.ts` — DOM rendering
- `js/ui-events.ts` — event handlers
- `js/search-logic.ts` — boolean + fuzzy search

## Code conventions

- **TypeScript** — avoid `any`; prefer explicit types at module boundaries
- **No framework** — keep it vanilla; don't add React/Vue/etc.
- **ESM imports use `.js` extensions** — even for `.ts` source files (Vite requirement)
- **State mutations go through `state.ts`** — don't store UI state in the DOM
- **No comments that restate the code** — only comment non-obvious *why*, not *what*
- Run `npm run typecheck` before pushing; CI will fail if it doesn't pass

## Making changes

1. Fork the repo and create a branch off `main`
2. Make your change — keep PRs focused and small
3. Run `npm run typecheck && npm run build` locally to verify nothing breaks
4. Open a PR with a clear description of what and why

## Reporting bugs

Open a GitHub issue with:
- What you did
- What you expected
- What actually happened
- Browser + OS

## Maintainer

[Vysakh Ramkrishnan](https://github.com/vrk7) — feel free to tag in issues or PRs.
