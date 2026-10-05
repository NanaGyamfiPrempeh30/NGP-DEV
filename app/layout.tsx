import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yaw Nana Gyamfi Prempeh — DevSecOps Engineer",
  description:
    "Portfolio of Yaw Nana Gyamfi Prempeh (NGP-Dev), DevSecOps engineer in Accra, Ghana.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB">
      <body>{children}</body>
    </html>
  );
}
