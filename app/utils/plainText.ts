const pad = (n: number) => String(n).padStart(2, "0");

// "2026-11-06 19:17" in the reader's time zone, the way IRC and logs print it
export const formatTimestamp = (iso: string | Date): string => {
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

// "[#####...............]" filled in proportion to length / max
export const counterBar = (length: number, max: number, width = 20): string => {
  const filled = Math.min(width, Math.max(0, Math.round((length / max) * width)));
  return `[${"#".repeat(filled)}${".".repeat(width - filled)}]`;
};

// The first `limit` characters of a post, cut at a word boundary, with "..."
// Returns the text unchanged if it already fits.
export const previewText = (text: string, limit: number): string => {
  if (text.length <= limit) return text;
  const cut = text.slice(0, limit);
  const lastSpace = cut.search(/\s\S*$/);
  return `${(lastSpace > limit / 2 ? cut.slice(0, lastSpace) : cut).trimEnd()}...`;
};
