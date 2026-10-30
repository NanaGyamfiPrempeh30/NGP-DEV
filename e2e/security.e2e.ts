import { expect, test } from "@playwright/test";
import { loadProjects, servableInProduction } from "../lib/projects";

// Every page the production build serves: the fixed routes plus each servable case study.
const routes = [
  "/",
  "/experience",
  "/projects",
  "/writing",
  "/mentoring",
  "/beyond",
  "/cv",
  ...servableInProduction(loadProjects()).map((project) => `/projects/${project.slug}`),
];

test("security headers are sent on /", async ({ request }) => {
  const res = await request.get("/");
  const headers = res.headers();
  const csp = headers["content-security-policy"] ?? "";
  for (const directive of [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "form-action 'self'",
  ]) {
    expect(csp).toContain(directive);
  }
  expect(headers["strict-transport-security"]).toBe("max-age=63072000");
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["x-frame-options"]).toBe("DENY");
  for (const feature of ["camera", "microphone", "geolocation", "payment", "usb"]) {
    expect(headers["permissions-policy"]).toContain(`${feature}=()`);
  }
});

for (const path of routes) {
  test(`${path}: no console errors and no CSP violations`, async ({ page }) => {
    const problems: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") problems.push(`console: ${msg.text()}`);
    });
    page.on("pageerror", (error) => problems.push(`page error: ${error.message}`));
    await page.addInitScript(() => {
      document.addEventListener("securitypolicyviolation", (event) => {
        console.error(`CSP violation: ${event.violatedDirective} blocked ${event.blockedURI}`);
      });
    });

    const res = await page.goto(path, { waitUntil: "networkidle" });
    expect(res?.status()).toBe(200);
    // Scroll to the end so lazy images and scroll reveals load too.
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(300);

    expect(problems).toEqual([]);
  });
}

// Google Search Console ownership file (CLAUDE.md: keep it forever).
test("Google verification file is served as is", async ({ request }) => {
  const res = await request.get("/googlec9589d4fbea855f7.html");
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("text/html");
  expect(await res.text()).toBe("google-site-verification: googlec9589d4fbea855f7.html");
});

test("robots.txt and sitemap.xml are served", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain("Sitemap:");
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  expect(await sitemap.text()).toContain("<urlset");
});
