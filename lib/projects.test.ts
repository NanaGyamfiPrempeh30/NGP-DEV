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

  it("ships the bank page in production only while it is verified and not hidden", () => {
    const bank = loadProjects().find((p) => p.slug === "rural-bank-staff-portal");
    expect(bank).toBeDefined();
    expect(servableInProduction([{ ...bank!, hidden: false, verified: false }])).toEqual([]);
    expect(servableInProduction([{ ...bank!, hidden: true, verified: true }])).toEqual([]);
    expect(servableInProduction([{ ...bank!, hidden: false, verified: true }])).toHaveLength(1);
  });

  // Tests show drafts, so here only `hidden` decides. The production rule is the test above.
  it("serves the bank portal exactly when it is not hidden", () => {
    const bank = loadProjects().find((p) => p.slug === "rural-bank-staff-portal")!;
    const served = getProjects().map((p) => p.slug).includes(bank.slug);
    expect(served).toBe(!bank.hidden);
  });
});
