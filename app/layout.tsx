import type { Metadata } from "next";
import { Atkinson_Hyperlegible, Public_Sans } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

// next/font downloads these at build time and serves them from this site.
const body = Public_Sans({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const comfort = Atkinson_Hyperlegible({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-comfort",
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

// Applies the stored theme and comfort mode before first paint, so the page does not flash.
const prefsScript = `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t;if(localStorage.getItem("comfort")==="on")document.documentElement.dataset.comfort="on"}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" className={`${body.variable} ${comfort.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: prefsScript }} />
      </head>
      <body>
        <SiteHeader />
        <main id="main" className="wrap">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
