import { describe, expect, it } from "vitest";
import { Claim } from "./schema";

describe("Claim schema", () => {
  it("accepts a claim with no number and no evidence", () => {
    expect(Claim.safeParse({ text: "Built the ingress layer." }).success).toBe(true);
  });

  it("rejects a claim with a number but no evidence or internal flag", () => {
    expect(Claim.safeParse({ text: "453 passing tests" }).success).toBe(false);
  });

  it("accepts a claim with a number when internal is true", () => {
    expect(
      Claim.safeParse({ text: "9 of 12 tests passing", internal: true }).success,
    ).toBe(true);
  });

  it("accepts a claim with a number when evidence is given", () => {
    expect(
      Claim.safeParse({
        text: "453 passing tests",
        evidence: { label: "Medium", url: "https://medium.com/p/x" },
      }).success,
    ).toBe(true);
  });
});
