import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = [
  { name: "home", path: "/" },
  { name: "experience", path: "/experience" },
  { name: "projects", path: "/projects" },
  { name: "project-detail", path: "/projects/k8s-troubleshoot-mcp" },
  { name: "writing", path: "/writing" },
  { name: "mentoring", path: "/mentoring" },
  { name: "beyond", path: "/beyond" },
  { name: "cv", path: "/cv" },
];

const widths = [360, 1024, 1440];
const schemes = ["light", "dark"] as const;

for (const route of routes) {
  for (const width of widths) {
    test(`${route.name} at ${width}px: screenshot, no sideways scroll`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(route.path);
      await page.screenshot({ path: `test-results/screens/${route.name}-${width}.png`, fullPage: true });
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }

  for (const scheme of schemes) {
    test(`${route.name} in ${scheme}: no WCAG 2.2 AA violations`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto(route.path);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(results.violations.map((v) => `${v.id}: ${v.nodes.length} node(s)`)).toEqual([]);
    });
  }

  test(`${route.name}: skip link is first and focus is visible`, async ({ page }) => {
    await page.goto(route.path);
    await page.keyboard.press("Tab");
    const first = page.locator(":focus");
    await expect(first).toHaveText("Skip to content");
    const outline = await first.evaluate((el) => getComputedStyle(el).outlineStyle);
    expect(outline).not.toBe("none");
  });
}

for (const width of [1024, 1440]) {
  test(`header stays on one row at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const brand = await page.locator(".site-header .brand").boundingBox();
    const lastLink = await page.locator(".nav-wide a").last().boundingBox();
    const comfort = await page.getByRole("button", { name: "Comfort mode" }).boundingBox();
    const centre = (box: { y: number; height: number } | null) => (box ? box.y + box.height / 2 : -1);
    expect(Math.abs(centre(brand) - centre(lastLink))).toBeLessThan(8);
    expect(Math.abs(centre(brand) - centre(comfort))).toBeLessThan(8);
    expect(comfort!.x + comfort!.width).toBeLessThanOrEqual(width);
  });
}

test("small-screen menu opens without a script and marks the current page", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 360, height: 800 } });
  const page = await context.newPage();
  await page.goto("/experience");
  await page.locator("summary", { hasText: "Menu" }).click();
  const current = page.locator('details nav a[aria-current="page"]');
  await expect(current).toBeVisible();
  await expect(current).toHaveText("Experience");
  await context.close();
});

test("the hidden bank page is not served or linked", async ({ page, request }) => {
  const response = await request.get("/projects/rural-bank-staff-portal");
  expect(response.status()).toBe(404);
  for (const path of ["/", "/projects", "/experience", "/cv"]) {
    await page.goto(path);
    const html = await page.content();
    expect(html).not.toContain("rural-bank-staff-portal");
    expect(html).not.toContain("Abokobi");
  }
  // These do not exist until M5. When they do, the bank page must not be in them.
  for (const path of ["/sitemap.xml", "/feed.xml", "/rss.xml"]) {
    const file = await request.get(path);
    if (file.ok()) expect(await file.text()).not.toContain("rural-bank-staff-portal");
  }
});
