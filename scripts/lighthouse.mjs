// Mobile Lighthouse, several runs per URL, medians plus each run's benchmarkIndex and long tasks.
// Usage: pnpm lighthouse <url> [url ...]     (RUNS=5 by default)
//
// Chrome's profile folders go to a fresh OS temp directory, never the project root. (On WSL, Chrome
// launcher writes Windows-style folder names relative to the current directory, so we run from temp.)
// If VERCEL_AUTOMATION_BYPASS_SECRET is set it is sent only as the x-vercel-protection-bypass header,
// through a temp file that is deleted at the end. Nothing printed here ever contains it.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const urls = process.argv.slice(2);
const runs = Number(process.env.RUNS ?? 5);
if (urls.length === 0) {
  console.error("usage: pnpm lighthouse <url> [url ...]");
  process.exit(1);
}

const work = fs.mkdtempSync(path.join(os.tmpdir(), "lighthouse-"));
const args = ["--yes", "lighthouse@12", "--only-categories=performance", "--output=json", "--output-path=stdout", "--quiet"];
args.push("--chrome-flags=--headless=new --no-sandbox --disable-gpu");
if (process.env.VERCEL_AUTOMATION_BYPASS_SECRET) {
  const file = path.join(work, "headers.json");
  fs.writeFileSync(file, JSON.stringify({ "x-vercel-protection-bypass": process.env.VERCEL_AUTOMATION_BYPASS_SECRET }), {
    mode: 0o600,
  });
  args.push(`--extra-headers=${file}`);
}

// A run only counts if it measured the portfolio, not Vercel's login page.
const NAME = "Yaw Nana Gyamfi Prempeh";
const headers = process.env.VERCEL_AUTOMATION_BYPASS_SECRET
  ? { "x-vercel-protection-bypass": process.env.VERCEL_AUTOMATION_BYPASS_SECRET }
  : {};
async function isRealSite(url, attempt = 1) {
  try {
    const res = await fetch(url, { headers, redirect: "manual" });
    const html = await res.text();
    const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
    const ok = res.status === 200 && title.includes(NAME) && /<h1[\s>]/.test(html) && html.includes(NAME);
    console.log(`${url} preflight: status ${res.status}, title "${title}", ${ok ? "real site" : "NOT the site"}`);
    return ok;
  } catch {
    if (attempt < 3) return isRealSite(url, attempt + 1); // a closed keep-alive socket after Chrome exits
    console.log(`${url} preflight: fetch failed`);
    return false;
  }
}
const sameHost = (a, b) => new URL(a).host === new URL(b).host;

const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
};

try {
  for (const url of urls) {
    const rows = [];
    if (!(await isRealSite(url))) continue;
    for (let i = 0; i < runs; i++) {
      let report;
      try {
        report = JSON.parse(
          execFileSync("npx", [...args, url], { cwd: work, maxBuffer: 512 * 1024 * 1024, stdio: ["ignore", "pipe", "ignore"] }),
        );
      } catch {
        console.log(`${url} run ${i + 1}: Lighthouse failed`); // the error itself is not printed: it holds the arguments
        continue;
      }
      const final = report.finalDisplayedUrl ?? report.finalUrl ?? "";
      if (report.runtimeError || report.categories.performance.score == null) {
        console.log(`${url} run ${i + 1}: discarded, ${report.runtimeError?.code ?? "no score"}`);
        continue;
      }
      if (!final || !sameHost(final, url) || /vercel\.com\/(login|sso)/.test(final)) {
        console.log(`${url} run ${i + 1}: discarded, ended on another host`);
        continue;
      }
      const a = report.audits;
      const lcpNode = a["largest-contentful-paint-element"]?.details?.items?.[0]?.items?.[0]?.node?.snippet ?? "?";
      const longTasks = (a["long-tasks"]?.details?.items ?? []).map((t) => ({
        url: String(t.url).replace(/^https?:\/\/[^/]+/, "") || "(document)",
        ms: Math.round(t.duration),
      }));
      rows.push({
        perf: Math.round(report.categories.performance.score * 100),
        lcp: a["largest-contentful-paint"].numericValue / 1000,
        cls: a["cumulative-layout-shift"].numericValue,
        tbt: a["total-blocking-time"].numericValue,
        benchmark: Math.round(report.environment.benchmarkIndex),
        lcpNode: lcpNode.slice(0, 70),
        longTasks,
      });
    }
    console.log(`\n${url}`);
    for (const [i, r] of rows.entries()) {
      const tasks = r.longTasks.map((t) => `${t.url} ${t.ms}ms`).join(", ");
      console.log(
        `  run ${i + 1}: perf ${r.perf}, LCP ${r.lcp.toFixed(2)}s, CLS ${r.cls.toFixed(3)}, TBT ${Math.round(r.tbt)}ms, benchmarkIndex ${r.benchmark}, LCP element ${r.lcpNode}`,
      );
      console.log(`         long tasks: ${tasks || "none"}`);
    }
    if (rows.length > 0) {
      console.log(
        `  median: perf ${median(rows.map((r) => r.perf))}, LCP ${median(rows.map((r) => r.lcp)).toFixed(2)}s, CLS ${median(rows.map((r) => r.cls)).toFixed(3)}, TBT ${Math.round(median(rows.map((r) => r.tbt)))}ms`,
      );
    }
  }
} finally {
  fs.rmSync(work, { recursive: true, force: true });
}
