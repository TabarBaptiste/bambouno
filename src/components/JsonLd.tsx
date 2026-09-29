import { menu } from "@/data/menu";
import { site } from "@/data/site";
import { openingHoursSchema } from "@/lib/hours";

/**
 * Balisage schema.org Restaurant + Menu.
 *
 * C'est le levier SEO local principal : il alimente le panneau Google et les
 * résultats enrichis « menu » sur les recherches type « pizza Gros-Morne ».
 */
export function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: site.name,
    url: site.url,
    image: `${site.url}/opengraph-image`,
    description: site.description,
    servesCuisine: ["Pizza", "Crêperie", "Antillaise"],
    priceRange: "€€",
    telephone: site.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      postalCode: site.address.postalCode,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.geo.lat,
      longitude: site.geo.lng,
    },
    hasMap: site.mapsUrl,
    openingHoursSpecification: openingHoursSchema(),
    // Pas de salle : on déclare explicitement l'emporter, et rien d'autre.
    takeaway: true,
    servesFood: true,
    acceptsReservations: false,
    hasMenu: {
      "@type": "Menu",
      name: `Carte ${site.name}`,
      hasMenuSection: menu.map((category) => ({
        "@type": "MenuSection",
        name: `${category.titlePrefix} ${category.titleAccent}`,
        hasMenuItem: category.items.map((item) => ({
          "@type": "MenuItem",
          name: item.name,
          description: item.description,
          offers: {
            "@type": "Offer",
            price: item.price.toFixed(2),
            priceCurrency: "EUR",
          },
        })),
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      // Contenu statique issu de nos propres données, jamais d'entrée utilisateur.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
