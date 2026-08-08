/**
 * Coordonnées et informations pratiques.
 *
 * ⚠️ À CONFIRMER AVEC LE CLIENT avant mise en ligne : les valeurs marquées
 * TODO sont des placeholders repris de la fiche Google et doivent être
 * validées (numéro exact, adresse complète, jours de fermeture).
 */

export const site = {
  name: "Bambouno Pizza",
  tagline: "Pizzas, crêpes & friands — cuits au feu, servis chaud.",
  creole: "Nou ka fè'y pou'w.",
  description:
    "Pizzeria à emporter à Gros-Morne, Martinique. Pizzas base tomate ou crème, pizzas pêcheur, crêpes salées et sucrées, friands. Commande par téléphone ou WhatsApp, du mardi au dimanche de 17h30 à 22h.",

  // TODO client : confirmer le numéro affiché sur la fiche Google.
  phone: "+596696000000",
  phoneDisplay: "0696 00 00 00",
  // Le numéro WhatsApp est au format international sans espace ni "+".
  whatsapp: "596696000000",

  address: {
    street: "Bourg", // TODO client : adresse précise
    city: "Gros-Morne",
    postalCode: "97213",
    region: "Martinique",
    country: "MQ",
  },
  // TODO client : recaler les coordonnées sur l'adresse exacte.
  geo: { lat: 14.7333, lng: -60.9772 },

  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Bambouno+Pizza+Gros-Morne",

  /** Service : vente à emporter uniquement (pas de salle, pas de réservation). */
  serviceType: "Vente à emporter",

  /**
   * Horaires d'ouverture, en heure locale Martinique (UTC−4, pas de DST).
   * 0 = dimanche … 6 = samedi. `null` = fermé.
   */
  hours: {
    0: { open: "17:30", close: "22:00" },
    1: null, // TODO client : confirmer le jour de fermeture
    2: { open: "17:30", close: "22:00" },
    3: { open: "17:30", close: "22:00" },
    4: { open: "17:30", close: "22:00" },
    5: { open: "17:30", close: "22:00" },
    6: { open: "17:30", close: "22:00" },
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
