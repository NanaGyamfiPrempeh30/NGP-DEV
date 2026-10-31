import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { pdfText } from "../lib/pdf-text";
import { profiles } from "./profiles";

// The LinkedIn profile moved (owner, 31 Oct 2026). The old slug must not appear anywhere.
// e2e/site.e2e.ts runs the same check on every built page.
const OLD = "yaw-gyamfi-prempeh";
const NEW = "https://www.linkedin.com/in/yaw-nana-gyamfi-prempeh-4042a0129/";

function files(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    return e.isDirectory() ? files(full) : [full];
  });
}

describe("LinkedIn link", () => {
  it("is the current profile", () => {
    expect(profiles.find((p) => p.label === "LinkedIn")?.url).toBe(NEW);
  });

  it("old slug is in no source file", () => {
    const hits = ["app", "components", "content", "lib", "public"]
      .flatMap((root) => files(path.join(process.cwd(), root)))
      .filter((f) => /\.(tsx?|mdx|css|txt|html|json)$/.test(f) && !f.endsWith("profile-links.test.ts"))
      .filter((f) => fs.readFileSync(f, "utf8").includes(OLD));
    expect(hits).toEqual([]);
  });

  it("old slug is not in the CV PDF", () => {
    const pdf = fs.readFileSync(path.join(process.cwd(), "public", "cv", "YNGP_CV_public.pdf"));
    expect(pdfText(pdf)).not.toContain(OLD);
    expect(pdf.toString("latin1")).not.toContain(OLD); // link annotations too
  });
});
