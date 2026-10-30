import { describe, expect, it } from "vitest";
import { loadProjects } from "./projects";
import { SITE_URL } from "./site";
import { sitemapEntries, staticRoutes } from "./sitemap";

describe("sitemap", () => {
  it("never lists a hidden or unverified project", () => {
    const urls = sitemapEntries([
      { slug: "public", hidden: false, verified: true },
      { slug: "hidden-verified", hidden: true, verified: true },
      { slug: "draft", hidden: false, verified: false },
      { slug: "hidden-draft", hidden: true, verified: false },
    ]).map((entry) => entry.url);
    expect(urls).toContain(`${SITE_URL}/projects/public`);
    for (const slug of ["hidden-verified", "draft", "hidden-draft"]) {
      expect(urls).not.toContain(`${SITE_URL}/projects/${slug}`);
    }
  });

  it("lists every static page and only public project files", () => {
    const projects = loadProjects();
    const urls = sitemapEntries(projects).map((entry) => entry.url);
    for (const path of staticRoutes) expect(urls).toContain(`${SITE_URL}${path === "/" ? "" : path}`);
    for (const p of projects) {
      const url = `${SITE_URL}/projects/${p.slug}`;
      if (p.hidden || !p.verified) expect(urls).not.toContain(url);
      else expect(urls).toContain(url);
    }
    expect(urls).toContain(`${SITE_URL}/projects/rural-bank-staff-portal`);
    expect(urls.every((url) => url.startsWith("https://"))).toBe(true);
  });
});
