import { seenKey } from "./config.js";
import { seen, setSeen, currentThreadId } from "./state.js";

let seenObserver: IntersectionObserver | null = null;

export function isJobSeen(jobId: string): boolean {
  return !!seen[currentThreadId]?.[jobId];
}

export function markJobAsSeen(jobId: string) {
  if (!currentThreadId || seen[currentThreadId]?.[jobId]) return;

  const nextSeen = { ...seen };
  if (!nextSeen[currentThreadId]) nextSeen[currentThreadId] = {};
  nextSeen[currentThreadId][jobId] = true;
  setSeen(nextSeen);
  localStorage.setItem(seenKey, JSON.stringify(nextSeen));

  document
    .querySelector(`.job-card[data-job-id="${jobId}"]`)
    ?.classList.add("seen");
}

// Sets up an IntersectionObserver on all rendered job cards.
// When a card exits the viewport from the top (scrolled past), it is marked seen.
export function setupSeenObserver() {
  if (seenObserver) seenObserver.disconnect();

  seenObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const scrolledPast =
          !entry.isIntersecting && entry.boundingClientRect.top < 0;
        if (scrolledPast) {
          const jobId = (entry.target as HTMLElement).dataset.jobId;
          if (jobId) markJobAsSeen(jobId);
        }
      });
    },
    { threshold: 0 }
  );

  document.querySelectorAll<HTMLElement>(".job-card").forEach((card) => {
    seenObserver!.observe(card);
  });
}
