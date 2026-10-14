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

test("hover: cards lift, glow and slide their arrow; reduced motion keeps them still", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await settle(page);
  const card = page.locator(".cards.featured .card").first();
  await card.scrollIntoViewIfNeeded();
  const read = () =>
    card.evaluate((el) => ({
      lift: getComputedStyle(el).transform,
      glow: getComputedStyle(el, "::after").opacity,
      arrow: getComputedStyle(el.querySelector(".go")!, "::after").transform,
    }));
  expect(await read()).toEqual({ lift: "none", glow: "0", arrow: "none" });
  await card.hover();
  await page.waitForTimeout(400);
  const hovered = await read();
  expect(hovered.lift).toBe("matrix(1, 0, 0, 1, 0, -4)");
  expect(hovered.glow).toBe("1");
  expect(hovered.arrow).toBe("matrix(1, 0, 0, 1, 5, 0)");

  const tile = page.locator(".tile a").first();
  await tile.scrollIntoViewIfNeeded();
  await tile.hover();
  await page.waitForTimeout(400);
  expect(await tile.evaluate((el) => getComputedStyle(el).transform)).toBe("matrix(1, 0, 0, 1, 0, -4)");

  await page.emulateMedia({ reducedMotion: "reduce" });
  await card.hover();
  await page.waitForTimeout(100);
  expect(await card.evaluate((el) => getComputedStyle(el).transform)).toBe("none");
});

test("moving between pages starts a view transition", async ({ page }) => {
  // Count calls to the browser's View Transitions API.
  await page.addInitScript(() => {
    const w = window as unknown as { __transitions: number };
    w.__transitions = 0;
    const original = document.startViewTransition?.bind(document);
    if (!original) return;
    document.startViewTransition = ((...args: Parameters<typeof original>) => {
      w.__transitions += 1;
      return original(...args);
    }) as typeof document.startViewTransition;
  });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.locator(".nav-wide a", { hasText: "Experience" }).click();
  await expect(page).toHaveURL(/\/experience$/);
  await expect(page.locator("h1")).toHaveText("Experience");
  expect(await page.evaluate(() => (window as unknown as { __transitions: number }).__transitions)).toBeGreaterThan(0);
});

test("the hero glow pauses while the tab is hidden", async ({ page }) => {
  await page.goto("/");
  // Wait until the site script is running: it sets --progress on its first pass.
  await page.waitForFunction(() => document.documentElement.style.getPropertyValue("--progress") !== "");
  const state = () =>
    page.evaluate(() => getComputedStyle(document.querySelector(".hero-bg")!, "::before").animationPlayState);
  expect(await state()).toBe("running");
  // A test cannot really hide the tab, so report it as hidden and fire the browser's own event.
  const setHidden = (hidden: boolean) =>
    page.evaluate((value) => {
      Object.defineProperty(document, "hidden", { configurable: true, get: () => value });
      document.dispatchEvent(new Event("visibilitychange"));
    }, hidden);
  await setHidden(true);
  expect(await state()).toBe("paused");
  await setHidden(false);
  expect(await state()).toBe("running");
});

test("hero photo: served through the image optimiser with its alt text", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const photo = page.getByAltText("Portrait of Yaw Nana Gyamfi Prempeh");
  await expect(photo).toBeVisible();
  const box = await photo.boundingBox();
  expect(box!.width).toBeLessThanOrEqual(400);
  expect(Math.abs(box!.width / box!.height - 4 / 5)).toBeLessThan(0.01);
  expect(await photo.evaluate((img: HTMLImageElement) => img.currentSrc)).toContain("/_next/image");
  await page.setViewportSize({ width: 375, height: 800 });
  // The framed slot is 260px wide on small screens; the photo fills it inside a 1px border.
  expect(Math.round((await page.locator(".portrait.photo").boundingBox())!.width)).toBe(260);
});

test("proof tiles announce the final figure, not the count-up", async ({ page }) => {
  await page.goto("/");
  const tile = page.locator(".tile a").first();
  await expect(tile).toHaveAttribute("aria-label", /^453 /);
  await expect(tile.locator(".figure")).toHaveAttribute("aria-hidden", "true");
});

test("gallery: a picture opens in a dialog with its alt text, and Esc closes it", async ({ page }) => {
  await page.goto("/beyond");
  await settle(page);
  const first = page.locator(".gallery button").first();
  const alt = await first.locator("img").getAttribute("alt");
  await first.focus();
  await page.keyboard.press("Enter");
  const dialog = page.locator("dialog.lightbox");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText(alt!)).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(first).toBeFocused();
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
