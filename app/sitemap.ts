import type { MetadataRoute } from "next";
import { loadProjects } from "@/lib/projects";
import { sitemapEntries } from "@/lib/sitemap";

export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapEntries(loadProjects());
}
