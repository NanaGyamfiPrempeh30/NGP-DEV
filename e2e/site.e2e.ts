import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { loadProjects, servableInProduction } from "../lib/projects";

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

test("with scripts off, the first project cards are visible at once", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await page.goto("/projects");
  const first = page.locator(".card-slot").first();
  await expect(first).toBeVisible();
  await expect(first).toBeInViewport();
  const style = await first.evaluate((el) => {
    const s = getComputedStyle(el);
    return { opacity: s.opacity, visibility: s.visibility };
  });
  expect(style).toEqual({ opacity: "1", visibility: "visible" });
  await context.close();
});

test("first-row cards and tiles are never transparent, with scripts on", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  for (const path of ["/", "/projects"]) {
    await page.goto(path);
    for (const el of await page.locator("[data-reveal]").all()) {
      if (!(await el.isVisible())) continue;
      expect(await el.evaluate((node) => getComputedStyle(node).opacity)).toBe("1");
    }
  }
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

for (const width of [320, 375, 412]) {
  test(`proof tiles at ${width}px: figures and labels on one line, nothing overlaps`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    for (const tile of await page.locator(".tile a").all()) {
      const report = await tile.evaluate((a) => {
        const parts = [...a.children] as HTMLElement[];
        const boxes = parts.map((el) => el.getBoundingClientRect());
        const lineHeight = (el: HTMLElement) => parseFloat(getComputedStyle(el).lineHeight);
        const oneLine = (el: HTMLElement) => el.getBoundingClientRect().height < lineHeight(el) * 1.5;
        const fits = (el: HTMLElement) => el.scrollWidth <= el.clientWidth + 1;
        const outer = a.getBoundingClientRect();
        let overlap = false;
        for (let i = 1; i < boxes.length; i++) if (boxes[i]!.top < boxes[i - 1]!.bottom - 0.5) overlap = true;
        const inside = boxes.every((b) => b.left >= outer.left - 0.5 && b.right <= outer.right + 0.5);
        const figure = a.querySelector<HTMLElement>(".figure")!;
        const label = a.querySelector<HTMLElement>(".label")!;
        return { figure: oneLine(figure) && fits(figure), label: oneLine(label) && fits(label), overlap, inside };
      });
      expect(report).toEqual({ figure: true, label: true, overlap: false, inside: true });
    }
  });
}

test("header buttons keep their text on one line at every width", async ({ page }) => {
  for (const width of [320, 375, 412, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/");
    for (const button of await page.locator(".site-header .btn, .site-header button").all()) {
      if (!(await button.isVisible())) continue;
      const wraps = await button.evaluate((el) => el.scrollHeight > el.clientHeight + 1 || getComputedStyle(el).whiteSpace !== "nowrap");
      expect(wraps).toBe(false);
    }
  }
});

test("hero case-study card: tilted from 1024px, straightens on hover, hidden below 1024px", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const card = page.locator(".hero-card");
  await expect(card).toBeVisible();
  await expect(card).toContainText("Case study");
  await expect(card).toHaveAttribute(
    "href",
    bankPublic ? "/projects/rural-bank-staff-portal" : "/projects/ecdc-kubernetes-ionos",
  );
  await expect(card.locator("svg")).toHaveAttribute("aria-hidden", "true");
  const angle = () => card.evaluate((el) => getComputedStyle(el).transform);
  expect(await angle()).not.toBe("none");
  await card.hover();
  await page.waitForTimeout(400);
  expect(await angle()).toMatch(/^matrix\(1, 0, 0, 1, 0, 0\)$|^none$/);
  await page.setViewportSize({ width: 1000, height: 900 });
  await expect(card).toBeHidden();
});

test("TikTok card: only with a real screenshot, with its caption and no link", async ({ page }) => {
  await page.goto("/beyond");
  const card = page.locator(".drone-card");
  if ((await card.count()) === 0) return; // no screenshot yet: the section is simply absent
  await expect(card.locator("img")).toBeVisible();
  await expect(card.locator("figcaption")).toHaveText("TikTok profile screenshot, 14 Oct 2026.");
  expect(await card.locator("a").count()).toBe(0);
  expect(await card.locator("iframe, script").count()).toBe(0);
});

// The only TikTok URL the owner approved is his own profile.
test("every TikTok link on the site goes to the approved profile", async ({ page }) => {
  for (const route of routes) {
    await page.goto(route.path);
    const hrefs = await page.locator('a[href*="tiktok.com"]').evaluateAll((links) => links.map((a) => a.getAttribute("href")));
    for (const href of hrefs) expect(href, route.path).toBe("https://www.tiktok.com/@ngp_dronelens");
  }
});

test("every social link has an accessible name and a drawn icon", async ({ page }) => {
  await page.goto("/");
  const links = page.locator("ul.social a");
  expect(await links.count()).toBeGreaterThanOrEqual(5);
  for (const link of await links.all()) {
    const name = (await link.innerText()).trim();
    expect(name.length).toBeGreaterThan(0);
    await expect(link).toHaveAccessibleName(name);
    const d = await link.locator("svg path").first().getAttribute("d");
    expect((d ?? "").trim().length).toBeGreaterThan(10);
  }
});

test("lower Home sections: anchors land below the header, find-in-page works, no shift while scrolling", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.addInitScript(() => {
    const w = window as unknown as { __cls: number };
    w.__cls = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as unknown as { value: number; hadRecentInput: boolean }[]) {
        if (!entry.hadRecentInput) w.__cls += entry.value;
      }
    }).observe({ type: "layout-shift", buffered: true });
  });
  await page.goto("/");
  await page.waitForTimeout(800);
  const before = await page.evaluate(() => (window as unknown as { __cls: number }).__cls);
  await settle(page);
  const after = await page.evaluate(() => (window as unknown as { __cls: number }).__cls);
  expect(after - before).toBeLessThan(0.01);

  const headerBottom = async () => (await page.locator(".site-header").boundingBox())!.height;
  for (const id of ["featured-title", "jobs-title", "writing-title", "contact"]) {
    await page.goto(`/#${id}`);
    await page.waitForTimeout(600);
    const top = (await page.locator(`#${id}`).boundingBox())!.y;
    expect(top).toBeGreaterThanOrEqual((await headerBottom()) - 1);
    // Near the end of the page the browser cannot scroll further, so the target may sit lower.
    const atEnd = await page.evaluate(() => Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight - 1);
    if (!atEnd) expect(top).toBeLessThan(260);
  }

  // The header Contact button jumps to the contact band.
  await page.goto("/");
  await page.locator(".site-header a.btn", { hasText: "Contact" }).click();
  await page.waitForTimeout(600);
  const contactTop = (await page.locator("#contact").boundingBox())!.y;
  expect(contactTop).toBeGreaterThanOrEqual((await headerBottom()) - 1);

  // Text in a section that has not been scrolled to is still found by the browser's find.
  await page.goto("/");
  const found = await page.evaluate(() => (window as unknown as { find: (s: string) => boolean }).find("See all articles"));
  expect(found).toBe(true);
});

test("case-study contents links land below the header", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/projects/ecdc-kubernetes-ionos");
  const header = (await page.locator(".site-header").boundingBox())!.height;
  for (const link of await page.locator(".toc a").all()) {
    const id = (await link.getAttribute("href"))!.slice(1);
    await link.click();
    await page.waitForTimeout(400);
    const top = (await page.locator(`[id="${id}"]`).boundingBox())!.y;
    expect(top).toBeGreaterThanOrEqual(header - 1);
  }
});

test("ECDC diagram: complete with no hover, flows on touch and on keyboard focus", async ({ browser }) => {
  const context = await browser.newContext({ hasTouch: true, isMobile: true, viewport: { width: 412, height: 860 } });
  const page = await context.newPage();
  await page.goto("/projects/ecdc-kubernetes-ionos");
  const diagram = page.locator("figure.diagram");
  await diagram.scrollIntoViewIfNeeded();
  // Everything is drawn without any interaction: 5 boxes, the private network outline, 2 dashed links, all labels.
  expect(await diagram.locator("rect.box").count()).toBe(5);
  expect(await diagram.locator("rect.private").count()).toBe(1);
  expect(await diagram.locator("line.flow").count()).toBe(2);
  // A horizontal SVG line has no height, so check that it is drawn rather than Playwright's box visibility.
  for (const line of await diagram.locator("line.flow").all()) {
    const drawn = await line.evaluate((el) => {
      const style = getComputedStyle(el);
      return (el as SVGLineElement).getBBox().width > 0 && style.stroke !== "none" && style.visibility === "visible" && style.opacity === "1";
    });
    expect(drawn).toBe(true);
  }
  await expect(diagram.locator("text", { hasText: "OpenVPN: the only way in" })).toBeVisible();
  const state = () => diagram.locator("line.flow").first().evaluate((el) => getComputedStyle(el).animationPlayState);
  expect(await state()).toBe("paused");
  await diagram.locator(".scroll").tap();
  expect(await state()).toBe("running");
  await context.close();

  const desktop = await browser.newPage();
  await desktop.goto("/projects/ecdc-kubernetes-ionos");
  const scroller = desktop.locator("figure.diagram .scroll");
  await scroller.focus();
  expect(await desktop.locator("figure.diagram line.flow").first().evaluate((el) => getComputedStyle(el).animationPlayState)).toBe("running");
  await desktop.close();
});

test("reduced motion switches off every animation, including the glow and the diagram flow", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const names = await page.evaluate(() => {
    const all = [...document.querySelectorAll("*")];
    const running = all.flatMap((el) =>
      [null, "::before", "::after"].map((pseudo) => getComputedStyle(el, pseudo).animationName).filter((n) => n && n !== "none"),
    );
    return [...new Set(running)];
  });
  expect(names).toEqual([]);
  await page.goto("/projects/ecdc-kubernetes-ionos");
  await page.locator("figure.diagram .scroll").focus();
  expect(await page.locator("figure.diagram line.flow").first().evaluate((el) => getComputedStyle(el).animationName)).toBe("none");
});

// The bank page ships only while its file says verified: true and hidden: false (production rules).
const bankPublic =
  servableInProduction(loadProjects().filter((project) => project.slug === "rural-bank-staff-portal")).length === 1;

test("the bank page is served only while it is verified and not hidden", async ({ page, request }) => {
  const response = await request.get("/projects/rural-bank-staff-portal");
  expect(response.status()).toBe(bankPublic ? 200 : 404);
  if (bankPublic) {
    await page.goto("/projects");
    await expect(page.locator('a[href="/projects/rural-bank-staff-portal"]').first()).toBeVisible();
    return;
  }
  for (const path of ["/", "/projects", "/experience", "/cv"]) {
    await page.goto(path);
    const html = await page.content();
    expect(html).not.toContain("rural-bank-staff-portal");
    expect(html).not.toContain("Abokobi");
  }
  // These do not exist until M5. When they do, a hidden bank page must not be in them.
  for (const path of ["/sitemap.xml", "/feed.xml", "/rss.xml"]) {
    const file = await request.get(path);
    if (file.ok()) expect(await file.text()).not.toContain("rural-bank-staff-portal");
  }
});

// Screenshots of the bank page for the PR, saved with the CI artefacts.
for (const width of [390, 1280]) {
  test(`bank page at ${width}px: screenshot, no sideways scroll`, async ({ page }) => {
    test.skip(!bankPublic, "the bank page is not public");
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/projects/rural-bank-staff-portal");
    await settle(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
    await page.screenshot({ path: `test-results/screens/bank-dark-${width}.png`, fullPage: true });
    await page.emulateMedia({ colorScheme: "light" });
    await page.screenshot({ path: `test-results/screens/bank-light-${width}.png`, fullPage: true });
  });
}

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

// Crops for PR review, saved with the CI artefacts: the social row and the TikTok block.
for (const width of [390, 1280]) {
  test(`review crops at ${width}px: social row and TikTok block`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const scheme of ["dark", "light"] as const) {
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto("/");
      await page.locator("ul.social").first().screenshot({ path: `test-results/screens/social-row-${scheme}-${width}.png` });
      await page.goto("/beyond");
      const card = page.locator(".drone-card");
      if ((await card.count()) > 0) await card.screenshot({ path: `test-results/screens/tiktok-${scheme}-${width}.png` });
    }
  });
}
