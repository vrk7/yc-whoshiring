const REMOTE_RE = /\bremote\b/i;
const ONSITE_RE = /\b(onsite|on-site|in-office)\b/i;
const HYBRID_RE = /\bhybrid\b/i;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function tagClass(tag: string): string {
  if (REMOTE_RE.test(tag)) return "tag-remote";
  if (HYBRID_RE.test(tag)) return "tag-hybrid";
  if (ONSITE_RE.test(tag)) return "tag-onsite";
  return "";
}

// Extracts pipe-separated fields from the first line of a raw HN HTML comment.
// HN posts follow the convention: Company | Role | Location | Remote | Salary | Stack
export function extractPipeTags(rawHtml: string): string[] {
  // Take everything before the first <p> tag or newline — that's the header line
  const firstSegment = rawHtml.split(/<p[\s>]/i)[0].split("\n")[0];
  const firstLine = firstSegment.replace(/<[^>]+>/g, "").trim();
  if (!firstLine.includes("|")) return [];
  return firstLine
    .split("|")
    .slice(1) // skip the company/title field (already shown as job title)
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && s.length <= 60);
}

export function renderTagsHtml(tags: string[]): string {
  if (tags.length === 0) return "";
  const buttons = tags
    .map((tag) => {
      const safe = escapeHtml(tag);
      const cls = tagClass(tag);
      return `<button class="job-tag${cls ? ` ${cls}` : ""}" data-action="tag-search" data-tag="${safe}" title="Search for ${safe}">${safe}</button>`;
    })
    .join("");
  return `<div class="job-tags">${buttons}</div>`;
}
