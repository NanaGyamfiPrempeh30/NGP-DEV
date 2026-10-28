import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The bank portal page is public, but the bank's private details never are (CLAUDE.md rule 11).
// Words that must never appear are stored as SHA-256 hashes, so this test never names them:
// the bank repo's owner handle, the repo name, the full slug, and the private VPN product and network words.
const FORBIDDEN_TOKEN_HASHES = new Set([
  "dd88acc0a2b148f16b6c66bbbe12e1d4774af772c1d7594bc124484422c63715",
  "bea84ad5ff9dd41f88d906ca7be8192e43fd6c77e078eb2abd0f375282aa24ac",
  "1168c4f0b3305ad54b48c74bd589b7fd56c3813f1eae353d61647fae1dafe8af",
  "795b104abe3e4134960ca245ded0e617f162c751209347b7f003bc35e062f43e",
  "ec6f049478046f72becb006a2339202eae93911281dd610a7c869adec1ba3297",
]);

const IP = /(?<![\d.])(?:\d{1,3}\.){3}\d{1,3}(?![\d.])/;
const PORT = /:\d{2,5}\b|\bport\s+\d{2,5}\b/i;
const DOMAIN = /\b[a-z0-9-]+(?:\.[a-z0-9-]+)*\.(?:com|net|org|io|app|dev|gh|co|uk|local|internal|lan|cloud|xyz|site|online|tech)\b/i;

const PATTERNS: [string, RegExp][] = [
  ["an IP address", IP],
  ["a port", PORT],
  ["a URL", /\bhttps?:\/\//i],
  ["a domain", DOMAIN],
  ["proxy config", /reverse_proxy|auto_https|header_up|Caddyfile|\btls\s+\S/i],
  ["a file path", /(?:^|\s)\/[\w.-]+\/[\w./-]+/m],
];

const file = path.join(process.cwd(), "content", "projects", "rural-bank-staff-portal.mdx");
const text = fs.readFileSync(file, "utf8");
const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");

describe("bank portal page text", () => {
  it("names none of the private repo, its owner or the private network", () => {
    const tokens = text.toLowerCase().split(/[^a-z0-9-]+/).filter(Boolean);
    const slashPairs = (text.toLowerCase().match(/[a-z0-9-]+\/[a-z0-9-]+/g) ?? []);
    const hits = [...tokens, ...slashPairs].filter((token) => FORBIDDEN_TOKEN_HASHES.has(sha256(token)));
    expect(hits.length).toBe(0);
  });

  for (const [label, pattern] of PATTERNS) {
    it(`contains no ${label}`, () => {
      expect(text.match(pattern)?.[0] ?? null).toBeNull();
    });
  }

  it("catches what it should (self-check of the patterns)", () => {
    // Built from parts so the pre-push denylist does not mistake this sample for a real address.
    expect([10, 0, 0, 1].join(".")).toMatch(IP);
    expect("listens on :8443").toMatch(PORT);
    expect("portal.example.com").toMatch(DOMAIN);
    expect("Node.js and Express").not.toMatch(DOMAIN);
    expect("0.85, falling back to 0.6").not.toMatch(IP);
  });
});
