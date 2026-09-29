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
  metadataBase: new URL(site.url),
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
  alternates: { canonical: "/" },
  // L'aperçu du lien (image générée dans opengraph-image.tsx) est ce que
  // voient les clients quand le site est partagé sur WhatsApp ou Facebook.
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "/",
    title: `${site.name} — Pizzas & crêpes à emporter`,
    description: site.description,
    siteName: site.name,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  // Le numéro est déjà un lien tel: explicite ; on évite qu'iOS en crée d'autres.
  formatDetection: { telephone: false },
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
      <body>
        {/* Premier arrêt clavier : sauter le header pour aller au contenu (WCAG 2.4.1). */}
        <a
          href="#contenu"
          className="btn-primary sr-only z-50 focus:not-sr-only focus:fixed focus:left-4 focus:top-3"
        >
          Aller au contenu
        </a>
        {children}
      </body>
    </html>
  );
}
