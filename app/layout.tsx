import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible_Mono, Atkinson_Hyperlegible_Next } from "next/font/google";
import { ViewTransition } from "react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteMotion } from "@/components/SiteMotion";
import "./globals.css";

// Two families, both variable, latin only. next/font downloads them at build time and serves them from this site.
// Atkinson Hyperlegible is drawn for readers who mix letters up, which suits this site's readability rules.
const sans = Atkinson_Hyperlegible_Next({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = Atkinson_Hyperlegible_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: "Yaw Nana Gyamfi Prempeh, DevSecOps Engineer",
    template: "%s | Yaw Nana Gyamfi Prempeh",
  },
  description:
    "Portfolio of Yaw Nana Gyamfi Prempeh (NGP-Dev), DevSecOps engineer in Accra, Ghana. Every claim links to proof.",
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
