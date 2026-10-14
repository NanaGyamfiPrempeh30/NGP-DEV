import { screenshots } from "@/content/screenshots";
import sizes from "@/content/shot-sizes.json";

const shotSizes: Record<string, { width: number; height: number }> = sizes;

// Returns the screenshot only when the file and alt text both exist. Otherwise null, and the
// section that uses it is not rendered at all.
export function getScreenshot(id: string) {
  const shot = screenshots.find((s) => s.id === id);
  const size = shotSizes[id];
  if (!shot || !size || !shot.alt) return null;
  return { ...shot, alt: shot.alt, ...size, file: `/shots/${id}.webp` };
}
