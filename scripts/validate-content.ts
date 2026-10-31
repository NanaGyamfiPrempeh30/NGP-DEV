import fs from "node:fs";
import { Cert, Job, Lab, OtherWork } from "../content/schema";
import { jobs } from "../content/experience";
import { certs } from "../content/certs";
import { labs } from "../content/labs";
import { otherWork } from "../content/other-work";
import { DesignWork, designWorks } from "../content/design";
import { designSizes, publishable } from "../lib/design";
import { screenshots } from "../content/screenshots";
import { loadProjects, type LoadedProject } from "../lib/projects";
import { articlesFallback, mediumPostId } from "../content/articles";
import { sitemapEntries } from "../lib/sitemap";

function fail(message: string): never {
  console.error(`validate: ${message}`);
  process.exit(1);
}

function warn(message: string) {
  console.warn(`validate: warning: ${message}`);
}

for (const [i, job] of jobs.entries()) {
  const result = Job.safeParse(job);
  if (!result.success) {
    fail(`jobs[${i}] (${job.company}): ${result.error.message}`);
  }
  // PRD §7.2: a bullet with a number needs evidence or internal: true, and at most one per job may
  // lean on internal. Bullets with no number may be internal too: that only labels them as private work.
  if (job.claims.filter((c) => c.internal && !c.evidence && /\d/.test(c.text)).length > 1) {
    fail(`jobs[${i}] (${job.company}): more than 1 internal claim with a number`);
  }
  if (!job.verified) {
    warn(`${job.company} is verified: false and will be hidden in production`);
  }
}

// PRD §7.2: overlapping jobs need a "Part-time" or "Contract" label. Dates are "YYYY-MM".
for (const [i, a] of jobs.entries()) {
  for (const b of jobs.slice(i + 1)) {
    const overlaps = a.start <= (b.end ?? "9999-12") && b.start <= (a.end ?? "9999-12");
    if (overlaps && a.type === "full-time" && b.type === "full-time") {
      warn(`${a.company} and ${b.company} overlap with no part-time or contract label`);
    }
  }
}

for (const [i, cert] of certs.entries()) {
  const result = Cert.safeParse(cert);
  if (!result.success) {
    fail(`certs[${i}] (${cert.name}): ${result.error.message}`);
  }
}

let projects: LoadedProject[] = [];
try {
  projects = loadProjects();
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}

const hidden: string[] = [];
for (const project of projects) {
  if (!project.verified) {
    hidden.push(project.slug);
    continue;
  }
  // A verified project ships, so its facts and page must be complete.
  if (!/^\d{4}-\d{2}$/.test(project.start)) {
    fail(`${project.slug}: verified but start "${project.start}" is not YYYY-MM`);
  }
  if (project.role.includes("TODO")) {
    fail(`${project.slug}: verified but role is still a TODO`);
  }
  // PRD §7.3: "What broke" is required.
  if (!project.body.includes("## What broke and how I fixed it")) {
    fail(`${project.slug}: verified but has no "What broke and how I fixed it" section`);
  }
}
if (hidden.length > 0) {
  warn(`${hidden.length} project(s) are verified: false and will be hidden in production: ${hidden.join(", ")}`);
}

for (const [i, lab] of labs.entries()) {
  const result = Lab.safeParse(lab);
  if (!result.success) {
    fail(`labs[${i}] (${lab.slug}): ${result.error.message}`);
  }
  // A lab ships only with a named author to credit.
  if (lab.verified && lab.credit.author.includes("TODO")) {
    fail(`${lab.slug}: verified but the original author is still a TODO`);
  }
}

for (const [i, work] of otherWork.entries()) {
  const result = OtherWork.safeParse(work);
  if (!result.success) {
    fail(`otherWork[${i}] (${work.slug}): ${result.error.message}`);
  }
}

const designIds = new Set<string>();
for (const [i, work] of designWorks.entries()) {
  const result = DesignWork.safeParse(work);
  if (!result.success) {
    fail(`designWorks[${i}] (${work.id}): ${result.error.message}`);
  }
  if (designIds.has(work.id)) {
    fail(`designWorks[${i}] (${work.id}): duplicate id`);
  }
  designIds.add(work.id);
  const ships = work.verified && publishable(work);
  if (ships && !designSizes[work.id]) {
    warn(`${work.id} has no converted image and is skipped. Run \`pnpm design:images\``);
  }
  // No file may exist for a piece that is unverified or lacks consent.
  if (!ships && designSizes[work.id]) {
    fail(`${work.id}: must not ship but has a converted image. Run \`pnpm design:images\``);
  }
  if (!ships) {
    warn(`design work ${work.id} is hidden (verified: ${work.verified}, consent: ${work.consent ?? false})`);
  }
}

// Only listed works and screenshots may sit in the public image folders. Anything else in
// design-src (for example a flyer with phone numbers) must never be converted or published.
{
  const allowed = new Set([...designWorks.map((w) => `${w.id}.webp`), ...screenshots.map((s) => `${s.id}.webp`)]);
  for (const dir of ["public/design", "public/shots"]) {
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir)) {
      if (!allowed.has(file)) fail(`${dir}/${file} has no entry in content/design.ts or content/screenshots.ts`);
    }
  }
}

// The static article list is what the feed merges into (lib/medium.ts), so every entry needs a
// Medium post ID, unique, and an ISO date.
const articleIds = new Set<string>();
for (const [i, article] of articlesFallback.entries()) {
  const id = mediumPostId(article.url);
  if (!id) fail(`articles[${i}] (${article.title}): no Medium post ID in ${article.url}`);
  if (articleIds.has(id)) fail(`articles[${i}] (${article.title}): post ID ${id} is listed twice`);
  articleIds.add(id);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(article.date)) fail(`articles[${i}] (${article.title}): date must be YYYY-MM-DD`);
}

// The sitemap must never point at a hidden or unverified project.
const listed = new Set(sitemapEntries(projects).map((entry) => entry.url));
for (const project of projects) {
  if ((project.hidden || !project.verified) && [...listed].some((url) => url.endsWith(`/projects/${project.slug}`))) {
    fail(`${project.slug}: hidden or unverified, but listed in the sitemap`);
  }
}

console.log(
  `validate: ${jobs.length} job(s), ${certs.length} cert(s), ${projects.length} project(s), ${labs.length} lab(s), ${otherWork.length} other, ${designWorks.length} design work(s), ${articlesFallback.length} article(s) OK`,
);
