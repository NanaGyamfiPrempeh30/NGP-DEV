import type { MetadataRoute } from "next";
import { servableInProduction, type LoadedProject } from "./projects";
import { absolute } from "./site";

export const staticRoutes = ["/", "/experience", "/projects", "/writing", "/mentoring", "/beyond", "/cv"];

// Uses the production rule in every environment: a hidden or unverified project is never listed,
// even on a preview that shows drafts.
export function sitemapEntries(projects: Pick<LoadedProject, "slug" | "hidden" | "verified">[]): MetadataRoute.Sitemap {
  const pages = [...staticRoutes, ...servableInProduction(projects).map((p) => `/projects/${p.slug}`)];
  return pages.map((path) => ({ url: absolute(path) }));
}
