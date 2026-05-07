# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Vite dev server with hot reload
npm run build      # production build → dist/
npm run typecheck  # tsc --noEmit (type check only, Vite handles compilation)
```

There are no tests yet. CI runs `typecheck` then `build` on every push to main.

## Architecture

Vanilla TypeScript + Vite. No framework. `index.html` is the entry point; `index.ts` imports `js/app.ts` which bootstraps everything.

### Module responsibilities

| Module | Role |
|--------|------|
| `js/app.ts` | Boot: calls `initUIEventListeners`, `fetchAndStoreThreads`, binds lifecycle events (visibilitychange, focus, pageshow, online) to throttled refresh |
| `js/state.ts` | Single source of truth for all runtime state (`allComments`, `currentThreadId`, `allThreads`, `favorites`, `applied`, `notes`, `hidden`, `seen`, …). Exports plain `let` bindings + setter functions — importers get live values via ES module live bindings |
| `js/thread-manager.ts` | Async data orchestration: loads threads from cache then fetches updates, manages request tokens to cancel stale requests, calls `renderJobs` / `renderThreadSwitcher` |
| `js/ui-render.ts` | All DOM rendering. `renderJobs` filters comments, then calls `renderNextChunk` (progressive rendering, 50 cards at a time via IntersectionObserver sentinel). `buildJobCard` builds each card's HTML |
| `js/ui-events.ts` | All event wiring: search, filters, job card actions (toggle/star/apply/note/hide/tag-search), keyboard shortcuts, theme, saved searches, notification bell, import/export buttons |
| `js/search-logic.ts` | `parseQuery` tokenises the query string; `evaluateQuery` + `checkTerm` implement boolean AND/OR/NOT with word-boundary regex and Levenshtein fuzzy fallback |
| `js/cache.ts` | Dexie (IndexedDB) wrapper. `getCache`/`setCache` are async. One-time IIFE cleans up old localStorage keys from before the IndexedDB migration |
| `js/api.ts` | HN Algolia API calls. Reads `USE_MOCK_DATA` from config to switch to local mock data for development |
| `js/extract.ts` | Parses pipe-delimited job post headers (`Company \| Role \| Location \| Remote`) into clickable tag pills |
| `js/notifications.ts` | Browser Notification API wrapper + page-title unread badge. All functions are no-ops when tab is visible or permission not granted |
| `js/saved-searches.ts` | localStorage CRUD for saved search queries |
| `js/data-export.ts` | JSON export and import of user data (favorites, applied, notes, hidden) |
| `js/seen.ts` | IntersectionObserver that marks job cards as seen when scrolled past |
| `js/config.ts` | All constants: localStorage keys, API map, category config, `USE_MOCK_DATA` flag |

### Data flow

1. `app.ts` → `thread-manager.fetchAndStoreThreads` → checks IndexedDB cache → calls `api.ts` → updates `state.ts` → calls `ui-render` functions
2. User interactions flow through event delegation in `ui-events.ts` → mutate `state.ts` → call `ui-render` functions
3. Background refresh: lifecycle events in `app.ts` → `refreshActiveView` → `fetchLatestCategoryThreadsInBackground` — detects new threads/comments, fires notifications, re-renders silently

### Key patterns

- **State is live bindings**: `state.ts` exports `let` variables. Other modules import them directly and always get the current value — no need to call a getter.
- **Request cancellation**: `loadThread` uses an incrementing `activeThreadRequestToken`. Each async checkpoint calls `isCurrentThreadRequest()` and bails if a newer request has started.
- **Progressive rendering**: `renderJobs` renders 50 cards immediately, then places an IntersectionObserver sentinel at the bottom; each time it enters the viewport the next 50 cards are appended.
- **Cache shape**: IndexedDB entries for comments are `{ comments: minimizedComment[], cachedAt: timestampMs }`. Thread lists are stored under `CATEGORY_CACHE_KEY`.
- **Mock data**: Set `USE_MOCK_DATA = true` in `js/config.ts` to develop without network calls. Mock data lives in the same file.
- **Imports use `.js` extensions** even for `.ts` source files — required for ESM compatibility with Vite's bundler module resolution.
