import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { publicEnv } from "@/lib/env";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f1729",
};

export const metadata: Metadata = {
  metadataBase: new URL(publicEnv.siteUrl),
  title: "VeraEstates | Verified Premium Real Estate in India",
  description:
    "Discover AI-verified apartments, villas, and land across India. Every listing backed by title checks, RERA validation, and on-ground site visits.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${cormorant.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full font-sans">
        <a
          href="#main-content"
          className="sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:block focus:rounded-lg focus:bg-gold focus:px-4 focus:py-2 focus:text-navy"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
