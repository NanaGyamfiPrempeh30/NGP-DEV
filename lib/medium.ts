import { type ArticleFallback, mediumPostId } from "../content/articles";

export const FEED_URL = "https://medium.com/feed/@yawgyamfiprempeh27";

// Medium's RSS feed holds only the latest 10 posts (checked 29 Oct 2026: 10 items, the oldest of
// the 11 known posts missing). So the site never shows a total count from it. The feed only adds
// posts newer than content/articles.ts; the static list keeps the older ones.

const decode = (text: string) =>
  text
    .replace(/^<!\[CDATA\[([\s\S]*)\]\]>$/, "$1")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .trim();

const field = (item: string, tag: string) => item.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`))?.[1];

export function parseFeed(xml: string): ArticleFallback[] {
  const items = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];
  return items.flatMap((item) => {
    const title = field(item, "title");
    const link = field(item, "link");
    const pubDate = field(item, "pubDate");
    if (!title || !link || !pubDate) return [];
    const date = new Date(decode(pubDate));
    if (Number.isNaN(date.getTime())) return [];
    const url = new URL(decode(link));
    url.search = ""; // drop Medium's ?source=rss tracking
    const tags = [...item.matchAll(/<category>([\s\S]*?)<\/category>/g)].map((m) => decode(m[1]!));
    return [{ title: decode(title), url: url.toString(), date: date.toISOString().slice(0, 10), tags }];
  });
}

// The static list wins for any post it already has (its titles and links were checked by hand).
export function mergeArticles(feed: ArticleFallback[], fallback: ArticleFallback[]): ArticleFallback[] {
  const known = new Set(fallback.map((a) => mediumPostId(a.url)));
  const added = feed.filter((a) => {
    const id = mediumPostId(a.url);
    return id !== null && !known.has(id);
  });
  return [...fallback, ...added].sort((a, b) => b.date.localeCompare(a.date));
}

// Never throws: a slow, blocked or broken feed gives an empty list, and the static list stands.
export async function fetchFeed(fetcher: typeof fetch = fetch): Promise<ArticleFallback[]> {
  try {
    const res = await fetcher(FEED_URL, {
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(5000),
    } as RequestInit);
    if (!res.ok) return [];
    return parseFeed(await res.text());
  } catch {
    return [];
  }
}
