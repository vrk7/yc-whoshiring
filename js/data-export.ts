import { appliedKey, favoriteKey, notesKey, hiddenKey } from "./config.js";

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
