import { describe, expect, it } from "vitest";
import { articlesFallback } from "../content/articles";
import { fetchFeed, mergeArticles, parseFeed } from "./medium";

const item = (id: string, title: string, date: string) => `<item><title><![CDATA[${title}]]></title>
<link>https://medium.com/@yawgyamfiprempeh27/post-${id}?source=rss-8a5d8208cbcb------2</link>
<category><![CDATA[kubernetes]]></category><pubDate>${date}</pubDate></item>`;

const feed = `<rss><channel>${item("e0b17bbc783b", "Old title &amp; more", "Fri, 28 Aug 2026 17:10:03 GMT")}${item(
  "aaaaaaaaaaaa",
  "A newer post",
  "Mon, 26 Oct 2026 09:00:00 GMT",
)}</channel></rss>`;

describe("Medium feed", () => {
  it("parses title, clean link, date and tags", () => {
    const [first] = parseFeed(feed);
    expect(first).toEqual({
      title: "Old title & more",
      url: "https://medium.com/@yawgyamfiprempeh27/post-e0b17bbc783b",
      date: "2026-08-28",
      tags: ["kubernetes"],
    });
  });

  it("adds only posts the static list lacks, newest first, and keeps the static copy", () => {
    const merged = mergeArticles(parseFeed(feed), articlesFallback);
    expect(merged).toHaveLength(articlesFallback.length + 1);
    expect(merged[0]?.title).toBe("A newer post");
    expect(merged.find((a) => a.url.endsWith("e0b17bbc783b"))?.title).not.toBe("Old title & more");
  });

  it("falls back to an empty list on a network error, a bad status or junk", async () => {
    const failing = (async () => {
      throw new Error("offline");
    }) as unknown as typeof fetch;
    const status = (async () => new Response("no", { status: 403 })) as unknown as typeof fetch;
    const junk = (async () => new Response("<html>not a feed</html>")) as unknown as typeof fetch;
    expect(await fetchFeed(failing)).toEqual([]);
    expect(await fetchFeed(status)).toEqual([]);
    expect(await fetchFeed(junk)).toEqual([]);
    expect(mergeArticles([], articlesFallback)).toHaveLength(articlesFallback.length);
  });
});
