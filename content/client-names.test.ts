import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The IONOS client is not named on the site (canNameClient: false, owner 30 Oct 2026).
// Its short name must not come back in any page source, content file or component.
const NAME = /\becdc\b/i;
const roots = ["app", "components", "content", "lib", "public/cv"];

function files(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? files(full) : [full];
  });
}

describe("anonymous clients", () => {
  it("never names the IONOS client", () => {
    const hits = roots
      .flatMap((root) => files(path.join(process.cwd(), root)))
      .filter((file) => /\.(tsx?|mdx|css|txt)$/.test(file) && !file.endsWith("client-names.test.ts"))
      .filter((file) => NAME.test(fs.readFileSync(file, "utf8")));
    expect(hits).toEqual([]);
  });
});
