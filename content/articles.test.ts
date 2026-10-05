import { describe, expect, it } from "vitest";
import { articlesFallback, mediumPostId } from "./articles";

describe("mediumPostId", () => {
  it("gives the same ID for the short and long form of a post URL", () => {
    const long =
      "https://medium.com/@yawgyamfiprempeh27/eks-karpenter-argocd-from-zero-to-production-gitops-with-25-cheaper-ci-cd-pipelines-heres-8bd81d4d657b?source=rss";
    expect(mediumPostId(long)).toBe("8bd81d4d657b");
    expect(mediumPostId("https://medium.com/p/8bd81d4d657b")).toBe("8bd81d4d657b");
  });

  it("finds a unique ID for every fallback article", () => {
    const ids = articlesFallback.map((a) => mediumPostId(a.url));
    expect(ids).not.toContain(null);
    expect(new Set(ids).size).toBe(articlesFallback.length);
  });
});
