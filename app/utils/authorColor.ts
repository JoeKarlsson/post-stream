// PostStream's post colors. Each author always gets the same one, so you can
// tell who wrote a post or comment at a glance, on any page.
export const AUTHOR_COLORS = [
  "teal",
  "red",
  "purple",
  "orange",
  "pink",
  "lightGreen",
  "forrestGreen",
] as const;

export type AuthorColor = (typeof AUTHOR_COLORS)[number];

// djb2 string hash: stable across visits, no lookup table to store
export const authorColor = (username: string): AuthorColor => {
  let hash = 5381;
  for (const char of username) {
    hash = ((hash * 33) ^ char.charCodeAt(0)) >>> 0;
  }
  return AUTHOR_COLORS[hash % AUTHOR_COLORS.length];
};
