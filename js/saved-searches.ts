import { savedSearchesKey } from "./config.js";

export interface SavedSearch {
  id: string;
  query: string;
}

function getAll(): SavedSearch[] {
  try {
    return JSON.parse(localStorage.getItem(savedSearchesKey) || "[]");
  } catch {
    return [];
  }
}

function persist(searches: SavedSearch[]): void {
  localStorage.setItem(savedSearchesKey, JSON.stringify(searches));
}

export function getSavedSearches(): SavedSearch[] {
  return getAll();
}

export function saveSearch(query: string): boolean {
  const q = query.trim();
  if (!q) return false;
  const searches = getAll();
  if (searches.some((s) => s.query === q)) return false;
  searches.unshift({ id: String(Date.now()), query: q });
  persist(searches);
  return true;
}

export function deleteSavedSearch(id: string): void {
  persist(getAll().filter((s) => s.id !== id));
}
