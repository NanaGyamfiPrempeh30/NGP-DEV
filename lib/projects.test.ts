import { describe, expect, it } from "vitest";
import { getProjects, loadProjects } from "./projects";

describe("hidden projects", () => {
  it("keeps the bank portal hidden", () => {
    const bank = loadProjects().find((p) => p.slug === "rural-bank-staff-portal");
    expect(bank?.hidden).toBe(true);
  });

  // Tests run with drafts shown, so this proves `hidden` does not depend on `verified` or the environment.
  it("never returns a hidden project to the pages", () => {
    const hidden = loadProjects().filter((p) => p.hidden).map((p) => p.slug);
    const served = getProjects().map((p) => p.slug);
    expect(hidden.length).toBeGreaterThan(0);
    for (const slug of hidden) expect(served).not.toContain(slug);
  });
});
