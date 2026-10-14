import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { DesignWork, designWorks } from "../content/design";
import { publishable } from "../lib/design";
import { screenshots } from "../content/screenshots";

// Run by hand after adding or changing a design entry: `pnpm design:images`.
// Converts /design-src originals to WebP in public/design and records their sizes.
// Only verified, publishable entries get a file, so nothing else is reachable by URL.
const srcDir = "design-src";
const outDir = "public/design";
const sizesFile = "content/design-sizes.json";
const maxWidth = 1600;
const quality = 82;

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const sizes: Record<string, { width: number; height: number }> = {};
  const keep = new Set<string>();

  for (const input of designWorks) {
    const work = DesignWork.parse(input);
    if (!work.verified || !publishable(work)) {
      console.log(`design: skip ${work.id} (not verified or no consent)`);
      continue;
    }
    const source = path.join(srcDir, work.src);
    if (!fs.existsSync(source)) {
      console.warn(`design: TODO(owner): ${work.id} has no file at ${source}. Skipped.`);
      continue;
    }
    const name = `${work.id}.webp`;
    // sharp drops EXIF and other metadata unless asked to keep it. rotate() applies the orientation first.
    const info = await sharp(source)
      .rotate()
      .resize({ width: maxWidth, withoutEnlargement: true })
      .webp({ quality })
      .toFile(path.join(outDir, name));
    sizes[work.id] = { width: info.width, height: info.height };
    keep.add(name);
    console.log(`design: ${name} ${info.width}x${info.height} ${Math.round(info.size / 1024)} KB`);
  }

  for (const file of fs.readdirSync(outDir)) {
    if (!keep.has(file)) {
      fs.rmSync(path.join(outDir, file));
      console.log(`design: removed ${file}`);
    }
  }
  fs.writeFileSync(sizesFile, `${JSON.stringify(sizes, null, 2)}\n`);

  // Screenshots (content/screenshots.ts): same rules, own folder. A missing original is skipped.
  const shotDir = "public/shots";
  fs.mkdirSync(shotDir, { recursive: true });
  const shotSizes: Record<string, { width: number; height: number }> = {};
  for (const shot of screenshots) {
    const source = path.join(srcDir, shot.src);
    if (!fs.existsSync(source)) {
      console.warn(`shots: ${shot.id} has no file at ${source}. Skipped; the section stays hidden.`);
      continue;
    }
    const info = await sharp(source)
      .rotate()
      .resize({ width: maxWidth, withoutEnlargement: true })
      .webp({ quality })
      .toFile(path.join(shotDir, `${shot.id}.webp`));
    shotSizes[shot.id] = { width: info.width, height: info.height };
    console.log(`shots: ${shot.id}.webp ${info.width}x${info.height} ${Math.round(info.size / 1024)} KB`);
  }
  fs.writeFileSync("content/shot-sizes.json", `${JSON.stringify(shotSizes, null, 2)}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
