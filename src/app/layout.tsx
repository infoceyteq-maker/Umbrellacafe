import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/poppins/800.css";
import "./globals.css";
import "./admin.css";

export const metadata: Metadata = {
  title: "Cafe Umbrella — Ella",
  description:
    "Cafe Umbrella, Ella. Soups, Stews, Kottu, Signature Roti & more — served with a touch of magic.",
};

export const viewport: Viewport = {
  themeColor: "#070304",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-[#070304] text-[#f7efe9] antialiased">
        {children}
      </body>
    </html>
  );
}
