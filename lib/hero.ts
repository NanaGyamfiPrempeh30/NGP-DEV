import fs from "node:fs";
import path from "node:path";

// The hero shows this photo when the file exists. Without it, the page falls back to the NGP monogram.
// The file is the owner's own 4:5 crop (520x650). It is served as is: never recropped or enlarged.
const file = "/images/headshot-hero.jpg";

export const heroPhoto = fs.existsSync(path.join(process.cwd(), "public", file))
  ? { src: file, width: 520, height: 650, alt: "Portrait of Yaw Nana Gyamfi Prempeh" }
  : null;
