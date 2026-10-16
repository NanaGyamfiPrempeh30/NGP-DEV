// Local helper: full-page screenshots after scrolling through the page so scroll reveals have run.
// Usage: node e2e/tools/shoot.mjs <outDir> <scheme> <width,width> <path=name> ...
import { chromium } from "@playwright/test";

const [outDir, scheme, widths, ...routes] = process.argv.slice(2);
const browser = await chromium.launch();
for (const width of widths.split(",").map(Number)) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: scheme });
  const page = await context.newPage();
  for (const route of routes) {
    const [path, name] = route.split("=");
    await page.goto(`http://localhost:${process.env.PORT ?? 3000}${path}`);
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < height; y += 600) {
      await page.evaluate((top) => window.scrollTo(0, top), y);
      await page.waitForTimeout(120);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${outDir}/${name}-${scheme}-${width}.png`, fullPage: true });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    console.log(`${name} ${scheme} ${width}: overflow ${overflow}`);
  }
  await context.close();
}
await browser.close();
