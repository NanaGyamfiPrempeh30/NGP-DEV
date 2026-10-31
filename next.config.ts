import createMDX from "@next/mdx";
import type { NextConfig } from "next";

// Every page loads only its own files: fonts are self-hosted by next/font and images go through
// /_next/image, so no outside host is allowed anywhere.
//
// 'unsafe-inline' trade-off: script-src needs it for the theme boot script in app/layout.tsx and for
// the inline scripts Next.js writes into static pages; style-src needs it for React style props.
// A nonce would remove it, but a nonce forces every page to render per request instead of being
// static. The site has no user input and no third-party scripts, and 'self' still blocks scripts
// from any other host, so the risk 'unsafe-inline' leaves is small.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "form-action 'self'",
].join("; ");

const permissions = [
  "accelerometer",
  "autoplay",
  "bluetooth",
  "camera",
  "display-capture",
  "geolocation",
  "gyroscope",
  "hid",
  "magnetometer",
  "microphone",
  "midi",
  "payment",
  "publickey-credentials-get",
  "screen-wake-lock",
  "serial",
  "usb",
  "xr-spatial-tracking",
]
  .map((feature) => `${feature}=()`)
  .join(", ");

export const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // No includeSubDomains or preload: the site lives on a vercel.app subdomain it does not own.
  { key: "Strict-Transport-Security", value: "max-age=63072000" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: permissions },
  { key: "X-Frame-Options", value: "DENY" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // The IONOS case study moved when the client stopped being named. Old links keep working.
  async redirects() {
    return [
      {
        source: "/projects/ecdc-kubernetes-ionos",
        destination: "/projects/eu-health-kubernetes-ionos",
        permanent: true,
      },
    ];
  },
};

// No plugins: each project file keeps its YAML inside an MDX comment, which MDX skips.
// gray-matter and Zod read that block (lib/projects.ts).
const withMDX = createMDX();

export default withMDX(nextConfig);
