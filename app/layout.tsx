// app/layout.tsx
// Root layout: loads fonts, wraps all pages with Navbar + Footer,
// and applies the global animation context.

import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

/* ─── Google Fonts ──────────────────────────────────────────────────── */
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/* ─── SEO Metadata ──────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: {
    default: "La Tavola — Fine Italian Dining",
    template: "%s | La Tavola",
  },
  description:
    "Experience authentic Italian cuisine crafted with passion. Reserve your table at La Tavola — where every meal is a memory.",
  keywords: ["restaurant", "Italian dining", "fine dining", "reservations", "La Tavola"],
  openGraph: {
    type: "website",
    siteName: "La Tavola",
    title: "La Tavola — Fine Italian Dining",
    description: "Experience authentic Italian cuisine crafted with passion.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="bg-charcoal-900 text-cream-100 font-sans">
        {/* Fixed navigation bar */}
        <Navbar />

        {/* Page-level entry / exit animation wrapper */}
        <PageTransition>
          <main>{children}</main>
        </PageTransition>

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
