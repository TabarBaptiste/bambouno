/**
 * Coordonnées et informations pratiques, relevées sur la fiche Google
 * Business de l'établissement.
 *
 * ⚠️ Seules les coordonnées GPS restent approximatives (voir TODO plus bas) :
 * « Route nationale » ne suffit pas à placer un point précis.
 */

export const site = {
  name: "Bambouno Pizza",
  tagline: "Pizzas, crêpes & friands — cuits au feu, servis chaud.",
  creole: "Nou ka fè'y pou'w.",
  description:
    "Pizzeria à emporter à Gros-Morne, Martinique. Pizzas base tomate ou crème, pizzas pêcheur, crêpes salées et sucrées, friands et boissons. Commande par téléphone ou WhatsApp, du lundi au samedi à partir de 17h30.",

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
  // TODO client : « Route nationale » ne suffit pas à placer un point précis.
  // Relever les coordonnées exactes sur place ou depuis la fiche Google.
  geo: { lat: 14.7333, lng: -60.9772 },

  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Bambouno+Pizza+Gros-Morne",

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
