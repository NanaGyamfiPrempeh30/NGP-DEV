// One base URL for canonical links, the sitemap, robots.txt, llms.txt and JSON-LD.
// SITE_URL overrides it (no trailing slash needed); the default is the public production alias.
export const SITE_URL = (process.env.SITE_URL ?? "https://ngp-dev.vercel.app").replace(/\/+$/, "");

export const SITE_NAME = "Yaw Nana Gyamfi Prempeh";
export const SITE_DESCRIPTION =
  "Portfolio of Yaw Nana Gyamfi Prempeh (NGP-Dev), DevSecOps engineer in Accra, Ghana. Every claim links to proof.";

export const absolute = (path: string) => `${SITE_URL}${path === "/" ? "" : path}`;
