import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { pdfPageCount, pdfText } from "../lib/pdf-text";
import { jobs } from "./experience";
import { skills } from "./skills";

// The public CV PDF is printed from /cv (pnpm cv:pdf). These checks fail if it drifts from the site
// or brings back claims METRICS.md dropped.
const pdf = fs.readFileSync(path.join(process.cwd(), "public", "cv", "YNGP_CV_public.pdf"));
const text = pdfText(pdf)
  .replace(/\s+/g, " ")
  .replace(/\s+([.,);:])/g, "$1")
  .replace(/\(\s+/g, "(");

const dropped = [
  "minimising manual deployment errors",
  "80% threshold",
  "cut hosting costs",
  "optimising usage and monthly costs",
  "reducing vulnerabilities",
  "improving system reliability",
  "Jenkins for CI/CD",
  "Hypothesis",
  "UID 10001",
];

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    return e.isDirectory() ? walk(full) : /\.(ts|tsx|mdx)$/.test(e.name) && !e.name.includes(".test.") ? [full] : [];
  });
}

const siteSource = ["content", "app"]
  .flatMap((dir) => walk(dir))
  .map((file) => fs.readFileSync(file, "utf8"))
  .join("\n");

describe("public CV PDF", () => {
  it("can be read (so the checks below are not empty passes)", () => {
    expect(text).toContain("Yaw Nana Gyamfi Prempeh");
    expect(text).toContain("ngp-dev.vercel.app");
    expect(text).toMatch(/Last updated \d{1,2} [A-Z][a-z]{2} \d{4}/);
  });

  it.each(dropped)("does not contain %s", (phrase) => {
    expect(text.toLowerCase()).not.toContain(phrase.toLowerCase());
  });

  it("has no percentage that the site does not also show", () => {
    for (const figure of text.match(/\d+(?:\.\d+)?\s?%/g) ?? []) {
      expect(siteSource).toContain(figure);
    }
  });

  it("fits on 3 A4 pages at most", () => {
    expect(pdfPageCount(pdf)).toBeGreaterThan(0);
    expect(pdfPageCount(pdf)).toBeLessThanOrEqual(3);
  });

  it("marks private work with one dagger and a single footnote", () => {
    expect(text).not.toContain("Private work, no public link Private");
    expect(text.match(/Private work, no public link/g)?.length).toBe(1);
    expect(text).toContain("† Private work, no public link.");
  });

  it("matches the site: every job claim and skill line is in it", () => {
    for (const job of jobs) for (const claim of job.claims) expect(text).toContain(claim.text);
    for (const skill of skills) expect(text).toContain(`${skill.group}: ${skill.items}`);
  });
});
