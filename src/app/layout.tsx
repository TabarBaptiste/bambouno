import type { Metadata, Viewport } from "next";
import { Anton, Barlow_Condensed, Inter } from "next/font/google";
import { site } from "@/data/site";
import "./globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-anton",
});

const barlowCondensed = Barlow_Condensed({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-barlow-condensed",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} — Pizzas & crêpes à emporter à ${site.address.city}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "pizza Gros-Morne",
    "pizzeria Martinique",
    "crêperie Gros-Morne",
    "pizza à emporter Martinique",
    "Bambouno Pizza",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    title: `${site.name} — Pizzas & crêpes à emporter`,
    description: site.description,
    siteName: site.name,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  // Mobile-first strict : on ne bride pas le zoom, question d'accessibilité.
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      className={`${anton.variable} ${barlowCondensed.variable} ${inter.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
