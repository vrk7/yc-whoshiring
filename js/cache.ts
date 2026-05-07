import Dexie, { type Table } from "dexie";
import { CATEGORY_CACHE_KEY } from "./config.js";

interface CacheEntry {
  key: string;
  data: any;
}

class HNDatabase extends Dexie {
  cache!: Table<CacheEntry, string>;

  constructor() {
    super("HNWhosHiring");
    this.version(1).stores({
      cache: "key",
    });
  }
}

const db = new HNDatabase();

// One-time cleanup: remove old localStorage cache keys left over from before IndexedDB migration
(function cleanupOldLocalStorageCache() {
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (
      key &&
      (key.startsWith("hn_thread_comments_") || key === CATEGORY_CACHE_KEY)
    ) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((key) => localStorage.removeItem(key));
})();

export async function setCache(key: string, data: any): Promise<void> {
  await db.cache.put({ key, data });
}

export async function getCache<T = any>(key: string): Promise<T | null> {
  const entry = await db.cache.get(key);
  return entry ? (entry.data as T) : null;
}

export async function removeCacheKeysWithPrefix(
  prefixOrPrefixes: string | string[]
): Promise<number> {
  const prefixes = Array.isArray(prefixOrPrefixes)
    ? prefixOrPrefixes
    : [prefixOrPrefixes];
  const allKeys = (await db.cache.toCollection().primaryKeys()) as string[];
  const keysToRemove = allKeys.filter((key) =>
    prefixes.some((prefix) => key.startsWith(prefix))
  );
  await db.cache.bulkDelete(keysToRemove);
  return keysToRemove.length;
}

export function minimizeCommentObject(comment: any) {
  return {
    id: comment.id,
    text: comment.text,
    author: comment.author,
    created_at: comment.created_at,
    created_at_i: comment.created_at_i,
    parent_id: comment.parent_id,
  };
}
