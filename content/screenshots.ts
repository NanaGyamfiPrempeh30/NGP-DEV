// Real screenshots only, never made up. A framed screenshot shows only when its converted file,
// its date and its alt text are all in place. Originals stay in /design-src, out of git.
export type Screenshot = {
  id: string;
  src: string; // file name in /design-src
  source: string; // what the screenshot shows, for the caption
  host: string; // shown in the frame's address bar
  url: string;
  date: string | null; // "as of" date: from the file name or the owner's caption, never guessed
  alt: string | null; // describes only what is visible in the image
};

export const screenshots: Screenshot[] = [
  {
    id: "tiktok-profile",
    src: "tiktok-profile.png",
    source: "TikTok profile, @ngp_dronelens",
    host: "tiktok.com/@ngp_dronelens",
    url: "https://www.tiktok.com/@ngp_dronelens",
    date: null, // TODO(owner): the date the screenshot was taken
    alt: null, // TODO: write from the image once the file is in /design-src
  },
];
