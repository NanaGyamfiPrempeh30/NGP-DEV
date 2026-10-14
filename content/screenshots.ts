// Real screenshots only, never made up. A framed screenshot shows only when its converted file
// and its alt text are both in place. Originals stay in /design-src, out of git.
export type Screenshot = {
  id: string;
  src: string; // file name in /design-src
  caption: string; // owner's exact caption
  host: string; // shown in the frame's address bar
  url: string;
  alt: string | null; // describes only what is visible in the image
};

export const screenshots: Screenshot[] = [
  {
    id: "tiktok-profile",
    src: "tiktok-profile.png",
    caption: "TikTok profile screenshot, 14 Oct 2026.",
    host: "tiktok.com/@ngp_dronelens",
    url: "https://www.tiktok.com/@ngp_dronelens",
    // Owner, 14 Oct 2026. The numbers are only in the alt text, which describes the picture.
    alt: "TikTok profile NGP DRONELENS: 3,772 followers, 27K likes, and a grid of aerial videos of fireworks, roads and city scenes.",
  },
];
