import { location, roleLine } from "@/content/home";
import { profiles } from "@/content/profiles";
import { loadProjects, servableInProduction } from "@/lib/projects";
import { absolute, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";
import { staticRoutes } from "@/lib/sitemap";

export const dynamic = "force-static";

const pageNames: Record<string, string> = {
  "/": "Home",
  "/experience": "Experience",
  "/projects": "Projects",
  "/writing": "Writing",
  "/mentoring": "Mentoring",
  "/beyond": "Beyond code",
  "/cv": "CV",
};

// A plain-text map of the site for language models (llmstxt.org). Only text already on the site,
// and only projects that are public (same rule as the sitemap).
export function GET() {
  const projects = servableInProduction(loadProjects());
  const lines = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    `${roleLine}. ${location}.`,
    "",
    "## Pages",
    ...staticRoutes.map((path) => `- [${pageNames[path]}](${absolute(path)})`),
    "",
    "## Case studies",
    ...projects.map((p) => `- [${p.title}](${absolute(`/projects/${p.slug}`)}): ${p.outcome}`),
    "",
    "## Profiles",
    ...profiles.map((p) => `- [${p.label}](${p.url})`),
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
