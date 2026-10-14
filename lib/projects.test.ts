import { describe, expect, it } from "vitest";
import { getProjects, loadProjects, servable, servableInProduction } from "./projects";

describe("hidden projects", () => {
  // Tests run with drafts shown, so this proves `hidden` does not depend on `verified` or the environment.
  it("never serves a hidden project, verified or not", () => {
    const projects = [
      { slug: "open", hidden: false, verified: true },
      { slug: "hidden-draft", hidden: true, verified: false },
      { slug: "hidden-verified", hidden: true, verified: true },
    ];
    expect(servable(projects).map((p) => p.slug)).toEqual(["open"]);
  });

  it("keeps every hidden project file away from the pages", () => {
    const hidden = loadProjects().filter((p) => p.hidden).map((p) => p.slug);
    const served = getProjects().map((p) => p.slug);
    for (const slug of hidden) expect(served).not.toContain(slug);
  });

  it("keeps the bank page out of production while it is unverified, even if `hidden` is lifted", () => {
    const bank = loadProjects().find((p) => p.slug === "rural-bank-staff-portal");
    expect(bank).toBeDefined();
    expect(bank!.verified).toBe(false);
    expect(servableInProduction([bank!])).toEqual([]);
    expect(servableInProduction([{ ...bank!, hidden: false }])).toEqual([]);
  });

  it("does not serve the bank portal", () => {
    expect(getProjects().map((p) => p.slug)).not.toContain("rural-bank-staff-portal");
  });
});
