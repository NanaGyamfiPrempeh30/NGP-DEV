import fs from "node:fs";
import path from "node:path";
import { loadProjects, servableInProduction } from "../lib/projects";

// Run after `next build`. Fails if anything a visitor or crawler can fetch mentions a hidden project:
// prerendered pages, RSC payloads, sitemap, feeds, OG metadata, client scripts and public files.
// In .next/server/app only the prerendered outputs are served. The .js and .nft.json files there are
// server code and file-trace lists, which no visitor can fetch.
const roots: [string, RegExp][] = [
  [".next/server/app", /\.(html|rsc|body|meta)$/],
  [".next/static", /\.(js|css|json|txt|xml)$/],
  ["public", /\.(html|xml|txt|json|js|css|webmanifest)$/],
];

function walk(dir: string, textFile: RegExp): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full, textFile) : textFile.test(entry.name) ? [full] : [];
  });
}

// The bank portal ships only when its file exists, is not hidden and is verified. Until then its slug
// and name must not appear anywhere a visitor can fetch, whether or not its file is in the repo.
const projects = loadProjects();
const bankSlug = "rural-bank-staff-portal";
const bankPublic = servableInProduction(projects.filter((project) => project.slug === bankSlug)).length === 1;
const alwaysHidden = bankPublic ? [] : [bankSlug, "Abokobi"];

const hidden = projects.filter((project) => project.hidden);
const needles = [...alwaysHidden, ...hidden.flatMap((project) => [project.slug, project.title])];
const files = roots.flatMap(([dir, textFile]) => walk(dir, textFile));

if (files.length === 0) {
  console.error("check-hidden: no build output found. Run `pnpm build` first.");
  process.exit(1);
}

const leaks: string[] = [];
for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  for (const needle of needles) {
    if (text.includes(needle)) leaks.push(`${file}: contains "${needle}"`);
  }
}
for (const slug of [...(bankPublic ? [] : [bankSlug]), ...hidden.map((project) => project.slug)]) {
  for (const ext of ["html", "rsc", "meta"]) {
    const page = path.join(".next/server/app/projects", `${slug}.${ext}`);
    if (fs.existsSync(page)) leaks.push(`${page}: page was built`);
  }
}

if (leaks.length > 0) {
  console.error(`check-hidden: ${leaks.length} leak(s)`);
  for (const leak of leaks) console.error(`  ${leak}`);
  process.exit(1);
}

console.log(`check-hidden: ${needles.length} term(s), ${files.length} file(s) scanned, no leaks`);
