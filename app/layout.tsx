import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible_Mono, Atkinson_Hyperlegible_Next } from "next/font/google";
import { ViewTransition } from "react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteMotion } from "@/components/SiteMotion";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

// Two families, both variable, latin only. next/font downloads them at build time and serves them from this site.
// Atkinson Hyperlegible is drawn for readers who mix letters up, which suits this site's readability rules.
// Only the main text face is preloaded. Fallback metrics live in globals.css (next/font has none for these).
const sans = Atkinson_Hyperlegible_Next({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  adjustFontFallback: false,
  fallback: ["Atkinson Next Fallback", "system-ui", "sans-serif"],
});
const mono = Atkinson_Hyperlegible_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  fallback: ["Atkinson Mono Fallback", "ui-monospace", "monospace"],
});

// Each page sets its own canonical path; metadataBase turns it into a full URL.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME}, DevSecOps Engineer`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
};

export const viewport: Viewport = { viewportFit: "cover" };

// Runs before first paint: applies the stored theme and comfort mode, and marks that scripts are on
// so scroll reveals only hide content when a script is there to show it again.
const bootScript = `try{var d=document.documentElement;d.classList.add("js");var t=localStorage.getItem("theme");if(t==="light"||t==="dark")d.dataset.theme=t;if(localStorage.getItem("comfort")==="on")d.dataset.comfort="on"}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <SiteHeader />
        <main id="main" className="wrap">
          <ViewTransition>{children}</ViewTransition>
        </main>
        <SiteFooter />
        <SiteMotion />
      </body>
    </html>
  );
}
