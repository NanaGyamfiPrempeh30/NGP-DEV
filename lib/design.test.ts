import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { DesignWork, designWorks } from "@/content/design";
import { clientLine, designSizes, publishable, visibleDesign } from "./design";

const sample = [
  { id: "own-verified", kind: "own", verified: true },
  { id: "own-draft", kind: "own", verified: false },
  { id: "client-ok", kind: "client", consent: true, verified: true },
  { id: "client-draft", kind: "client", consent: true, verified: false },
  { id: "client-no-consent", kind: "client", consent: false, verified: true },
  { id: "client-nothing", kind: "client", consent: false, verified: false },
] as const;

describe("design gallery visibility", () => {
  it("production excludes anything with consent false or verified false", () => {
    expect(visibleDesign([...sample], false).map((w) => w.id)).toEqual(["own-verified", "client-ok"]);
  });

  it("previews add drafts but never client work without consent", () => {
    expect(visibleDesign([...sample], true).map((w) => w.id)).toEqual([
      "own-verified",
      "own-draft",
      "client-ok",
      "client-draft",
    ]);
  });

  it("ships an image file only for verified, publishable entries", () => {
    const allowed = designWorks.filter((w) => w.verified && publishable(w)).map((w) => w.id);
    const files = fs.readdirSync("public/design").map((f) => f.replace(/\.webp$/, ""));
    for (const id of files) expect(allowed).toContain(id);
    for (const id of Object.keys(designSizes)) expect(allowed).toContain(id);
  });

  it("keeps converted images within 1600px wide", () => {
    for (const size of Object.values(designSizes)) expect(size.width).toBeLessThanOrEqual(1600);
  });
});

describe("design entries", () => {
  it("all pass the schema", () => {
    for (const work of designWorks) expect(DesignWork.safeParse(work).success, work.id).toBe(true);
  });

  it("rejects alt text outside 20 to 140 characters", () => {
    const base = { id: "x", title: "X", kind: "own", verified: true, order: 1, src: "x.jpg" };
    expect(DesignWork.safeParse({ ...base, alt: "Too short" }).success).toBe(false);
    expect(DesignWork.safeParse({ ...base, alt: "a".repeat(141) }).success).toBe(false);
  });

  it("names a client only when canNameClient is true", () => {
    expect(clientLine({ kind: "client", clientName: "Acme" })).toBe("Client work");
    expect(clientLine({ kind: "client", clientName: "Acme", canNameClient: true })).toBe("Logo for Acme");
    expect(
      clientLine({ kind: "client", title: "Save-the-date card", clientName: "Acme", canNameClient: true }),
    ).toBe("Save-the-date card for Acme");
    expect(clientLine({ kind: "own" })).toBe("Own work");
  });

  it("puts no unnamed client's name in a title or file name", () => {
    for (const work of designWorks) {
      if (work.kind !== "client" || work.canNameClient || !work.clientName) continue;
      const name = work.clientName.toLowerCase();
      expect(work.title.toLowerCase()).not.toContain(name);
      expect(work.id.replace(/-/g, " ")).not.toContain(name);
    }
  });
});
