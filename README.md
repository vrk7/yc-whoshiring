# HN Who's Hiring

[![CI](https://github.com/vrk7/yc-whoshiring/actions/workflows/ci.yml/badge.svg)](https://github.com/vrk7/yc-whoshiring/actions/workflows/ci.yml)

**Live: [vrk7.github.io/yc-whoshiring](https://vrk7.github.io/yc-whoshiring/)**

A fast, fully local frontend for Hacker News "Who is Hiring?" threads. Everything runs in your browser — no account, no server, no data sent anywhere.

## Features

- **Boolean search** — `&`, `|`, `~` operators with fuzzy fallback for typos
- **Clickable pipe tags** — job posts parsed into tappable `Company | Role | Remote | Stack` tags
- **Saved searches** — bookmark queries and re-apply them in one click
- **Favorites, notes, applied tracking** — all stored locally
- **Export / Import** — move your data between devices via JSON
- **Browser notifications** — get notified when new jobs or a new monthly thread arrives
- **Progressive rendering** — first 50 cards appear immediately, rest load as you scroll
- **PWA** — installable on desktop and mobile
- **Dark / light theme**

## Run locally

```bash
npm install
npm run dev        # start Vite dev server with hot reload
npm run build      # production build → dist/
npm run typecheck  # TypeScript check only (no emit)
```

To develop without network calls, set `USE_MOCK_DATA = true` in `js/config.ts`.

## Search syntax

Expressions are evaluated left-to-right. Parentheses are not supported.

| Query | Matches |
|-------|---------|
| `remote` | word "remote" |
| `"@gmail.com"` | exact phrase |
| `rust & backend` | both words |
| `react \| flutter` | either word |
| `~us-based` | NOT the word |
| `python \| javascript & remote & ~us-based` | combined |

Single-word terms also do fuzzy matching — words of 5–7 chars tolerate 1 typo, 8+ chars tolerate 2.

## Keyboard shortcuts

| Key | Action |
|-----|--------|
| `j` / `k` | Next / previous job |
| `/` | Focus search |
| `Esc` | Blur search |
| `a` | Toggle favourite on focused card |
| `e` | Toggle exclude on focused card |
| `g` | Scroll to top |

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for setup steps, code conventions, and PR guidelines.

## Notes

- Completely local — except GoatCounter for simple, privacy-friendly analytics.
- Supports PWA install on desktop and mobile.
- Maintained by [Vysakh Ramkrishnan](https://github.com/vrk7).
