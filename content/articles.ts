export type ArticleFallback = {
  title: string;
  url: string;
  date: string; // ISO date
  tags: string[];
};

// Static fallback for Medium posts older than the RSS feed's ~10 latest.
// Filled in M2/M4 per PRD §7.4 and §10.3.
export const articlesFallback: ArticleFallback[] = [];
