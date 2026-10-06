/**
 * Coordonnées et informations pratiques, relevées sur la fiche Google
 * Business de l'établissement.
 */

/**
 * URL publique du site, pour les URL absolues (canonical, Open Graph,
 * sitemap). À définir en production via NEXT_PUBLIC_SITE_URL ; sur Vercel, on
 * retombe sur le domaine de production du projet.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  // Variable exposée automatiquement par Vercel aux projets Next.js.
  const vercel = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const site = {
  name: "Bambouno Pizza",
  url: resolveSiteUrl(),
  tagline: "Pizzas, crêpes & friands - cuits au feu, servis chaud.",
  creole: "Nou ka fè'y pou'w.",
  description:
    "Pizzeria à emporter au Gros-Morne, Martinique. Pizzas base tomate ou crème, pizzas pêcheur, crêpes salées et sucrées, friands et boissons. Commande par téléphone ou WhatsApp, du lundi au samedi à partir de 17h30.",

  phone: "+596696444122",
  phoneDisplay: "0696 44 41 22",
  // Le numéro WhatsApp est au format international sans espace ni "+".
  whatsapp: "596696444122",

  address: {
    street: "Route nationale",
    city: "Gros-Morne",
    postalCode: "97213",
    region: "Martinique",
    country: "MQ",
  },
  // Plus code PX7X+25, Gros-Morne - relevé directement sur place.
  geo: { lat: 14.7126174, lng: -61.0019799 },

  /** Fiche Google Maps de l'établissement (itinéraire, avis). */
  mapsUrl: "https://maps.app.goo.gl/yT42EQgx83vn9zfn6",
  /** Plan intégré : lien « Partager > Intégrer une carte » de la fiche Google. */
  mapsEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3150.5115674385875!2d-61.004601425970606!3d14.712602474326848!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8c6aa368cf49d925%3A0x69f733fe0cc50d8b!2sBambouno%20pizza!5e1!3m2!1sfr!2sfr!4v1791299170196!5m2!1sfr!2sfr",

  /** Service : vente à emporter uniquement (pas de salle, pas de réservation). */
  serviceType: "Vente à emporter",

  /**
   * Horaires d'ouverture, en heure locale Martinique (UTC−4, pas de DST).
   * 0 = dimanche … 6 = samedi. `null` = fermé.
   */
  hours: {
    0: null, // Dimanche : fermé.
    1: { open: "17:30", close: "22:00" },
    2: { open: "17:30", close: "22:00" },
    3: { open: "17:30", close: "22:00" },
    4: { open: "17:30", close: "22:00" },
    5: { open: "17:30", close: "22:00" },
    6: { open: "17:30", close: "23:00" }, // Samedi : une heure de plus.
  } as Record<number, { open: string; close: string } | null>,

  timeZone: "America/Martinique",
} as const;

export const dayNames = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
] as const;
