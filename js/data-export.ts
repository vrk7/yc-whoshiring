import { appliedKey, favoriteKey, notesKey, hiddenKey } from "./config.js";

type NestedRecord = Record<string, Record<string, unknown>>;

const FIELD_MAP = [
  { storageKey: appliedKey,   dataField: "applied"   },
  { storageKey: favoriteKey,  dataField: "favorites" },
  { storageKey: notesKey,     dataField: "notes"     },
  { storageKey: hiddenKey,    dataField: "hidden"    },
] as const;

export async function importUserData(file: File): Promise<number> {
  const text = await file.text();
  const data = JSON.parse(text);

  if (!data || typeof data !== "object") {
    throw new Error("Invalid file: not a JSON object");
  }

  let totalMerged = 0;

  for (const { storageKey, dataField } of FIELD_MAP) {
    const incoming = (data as Record<string, unknown>)[dataField];
    if (!incoming || typeof incoming !== "object") continue;

    let existing: NestedRecord = {};
    try {
      existing = JSON.parse(localStorage.getItem(storageKey) || "{}");
    } catch {
      existing = {};
    }

    for (const threadId of Object.keys(incoming as object)) {
      const threadData = (incoming as NestedRecord)[threadId];
      if (!threadData || typeof threadData !== "object") continue;
      if (!existing[threadId]) existing[threadId] = {};
      for (const jobId of Object.keys(threadData)) {
        existing[threadId][jobId] = threadData[jobId];
        totalMerged++;
      }
    }

    localStorage.setItem(storageKey, JSON.stringify(existing));
  }

  return totalMerged;
}

function readJson(key: string): unknown {
  try {
    return JSON.parse(localStorage.getItem(key) || "{}");
  } catch {
    return {};
  }
}

export function exportUserData(): void {
  const payload = {
    exportedAt: new Date().toISOString(),
    applied: readJson(appliedKey),
    favorites: readJson(favoriteKey),
    notes: readJson(notesKey),
    hidden: readJson(hiddenKey),
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `hn-whoshiring-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
