// Prints the /cv page to public/cv/YNGP_CV_public.pdf (A4), so the PDF says exactly what the site says.
// Usage: pnpm build && pnpm start, then in another shell: pnpm cv:pdf [base-url]
// Commit the new PDF with the content change that caused it.
import { chromium } from "@playwright/test";
import path from "node:path";

const base = process.argv[2] ?? "http://localhost:3000";
const out = path.join(process.cwd(), "public", "cv", "YNGP_CV_public.pdf");

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  const res = await page.goto(`${base}/cv`, { waitUntil: "networkidle" });
  if (res?.status() !== 200) throw new Error(`/cv returned ${res?.status()}`);
  await page.emulateMedia({ media: "print" });
  await page.pdf({ path: out, format: "A4", preferCSSPageSize: true, printBackground: false });
  console.log(`cv-pdf: wrote ${path.relative(process.cwd(), out)} from ${base}/cv`);
} finally {
  await browser.close();
}
