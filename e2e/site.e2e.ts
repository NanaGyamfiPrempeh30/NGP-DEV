import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const routes = [
  { name: "home", path: "/" },
  { name: "experience", path: "/experience" },
  { name: "projects", path: "/projects" },
  { name: "project-detail", path: "/projects/ecdc-kubernetes-ionos" },
  { name: "writing", path: "/writing" },
  { name: "mentoring", path: "/mentoring" },
  { name: "beyond", path: "/beyond" },
  { name: "cv", path: "/cv" },
];

const viewports = [320, 375, 412, 768, 820, 1024, 1366, 1440, 1920, 2560];
const shots = new Set([320, 768, 1440]);
const schemes = ["dark", "light"] as const;
const motions = ["no-preference", "reduce"] as const;

// Scroll reveals only run when content enters the viewport, so walk the page before judging it.
async function settle(page: Page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 600) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(80);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(900);
}

for (const route of routes) {
  for (const width of viewports) {
    test(`${route.name} at ${width}px: no sideways scroll`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: "dark" });
      await page.goto(route.path);
      await settle(page);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
      if (shots.has(width)) {
        await page.screenshot({ path: `test-results/screens/${route.name}-dark-${width}.png`, fullPage: true });
        await page.emulateMedia({ colorScheme: "light" });
        await page.screenshot({ path: `test-results/screens/${route.name}-light-${width}.png`, fullPage: true });
      }
    });
  }

  for (const scheme of schemes) {
    for (const motion of motions) {
      test(`${route.name}, ${scheme}, motion ${motion}: no WCAG 2.2 AA violations`, async ({ page }) => {
        await page.emulateMedia({ colorScheme: scheme, reducedMotion: motion });
        await page.goto(route.path);
        await settle(page);
        const results = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
          .analyze();
        expect(results.violations.map((v) => `${v.id}: ${v.nodes.length} node(s)`)).toEqual([]);
      });
    }
  }

  // The header and layout change on small screens, so check there too.
  test(`${route.name} at 375px: no WCAG 2.2 AA violations`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto(route.path);
    await settle(page);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.nodes.length} node(s)`)).toEqual([]);
  });

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
    const contact = await page.locator(".site-header .btn").boundingBox();
    const comfort = await page.locator(".prefs-wide").getByRole("button", { name: "Comfort mode" }).boundingBox();
    const centre = (box: { y: number; height: number } | null) => (box ? box.y + box.height / 2 : -1);
    for (const box of [lastLink, contact, comfort]) expect(Math.abs(centre(brand) - centre(box))).toBeLessThan(8);
    expect(contact!.x + contact!.width).toBeLessThanOrEqual(width);
  });
}

test("small-screen menu: opens as a dialog, traps focus, closes on Esc", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/experience");
  await page.getByRole("button", { name: "Menu" }).click();
  const dialog = page.locator("dialog.menu-dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('a[aria-current="page"]')).toHaveText("Experience");
  for (let i = 0; i < 14; i++) await page.keyboard.press("Tab");
  expect(await page.evaluate(() => !!document.activeElement?.closest("dialog"))).toBe(true);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("without scripts, every figure and card is still visible", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator(".tile").first()).toContainText("453");
  for (const selector of [".tile", ".card-slot", ".timeline"]) {
    const opacity = await page.locator(selector).last().evaluate((el) => getComputedStyle(el).opacity);
    expect(opacity).toBe("1");
  }
  await context.close();
});

test("with reduced motion, nothing waits for a scroll or an animation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".tile").first()).toContainText("453");
  const last = page.locator(".card-slot").last();
  expect(await last.evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
  expect(await page.locator(".hero h1").evaluate((el) => getComputedStyle(el).animationName)).toBe("none");
});

test("tap targets in the header and hero are at least 44px", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/");
  for (const target of await page.locator(".site-header .btn, .site-header button, .actions .btn, .social a").all()) {
    if (!(await target.isVisible())) continue;
    const box = await target.boundingBox();
    expect(Math.min(box!.width, box!.height)).toBeGreaterThanOrEqual(44);
  }
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

// A short film of Home loading and scrolling, with motion on. Saved with the CI artefacts.
test("record the Home load and scroll", async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    colorScheme: "dark",
    recordVideo: { dir: "test-results/video", size: { width: 1280, height: 720 } },
  });
  const page = await context.newPage();
  await page.goto("/");
  await page.waitForTimeout(1200);
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 40) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(30);
  }
  await page.waitForTimeout(800);
  await context.close();
});
