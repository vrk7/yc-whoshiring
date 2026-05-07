import { notificationsKey } from "./config.js";

const BASE_TITLE = document.title;

export function isNotificationsEnabled(): boolean {
  return (
    "Notification" in window &&
    Notification.permission === "granted" &&
    localStorage.getItem(notificationsKey) === "1"
  );
}

export async function enableNotifications(): Promise<boolean> {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "denied") return false;
  if (Notification.permission !== "granted") {
    const result = await Notification.requestPermission();
    if (result !== "granted") return false;
  }
  localStorage.setItem(notificationsKey, "1");
  return true;
}

export function disableNotifications(): void {
  localStorage.removeItem(notificationsKey);
}

function fire(title: string, body: string): void {
  if (Notification.permission !== "granted") return;
  try {
    new Notification(title, {
      body,
      icon: "/icon-192x192.png",
      tag: "hn-whoshiring",
    });
  } catch {
    // silently fail in restricted contexts (e.g. file:// or sandboxed iframes)
  }
}

export function notifyNewThread(threadTitle: string): void {
  if (!document.hidden || !isNotificationsEnabled()) return;
  fire("New HN thread posted", threadTitle);
}

export function notifyNewJobs(count: number): void {
  if (!document.hidden || !isNotificationsEnabled()) return;
  fire(
    `${count} new job${count === 1 ? "" : "s"} added`,
    "New job postings are available on HN Who's Hiring."
  );
}

export function setUnreadBadge(count: number): void {
  if (!document.hidden) return;
  document.title = count > 0 ? `(${count} new) ${BASE_TITLE}` : BASE_TITLE;
}

export function clearUnreadBadge(): void {
  document.title = BASE_TITLE;
}
