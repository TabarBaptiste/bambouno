import type { Page } from "@playwright/test";

/**
 * Heures fixes en Martinique (UTC−4, sans heure d'été). Les tests ne doivent
 * jamais dépendre de l'heure réelle : le bouton de commande n'est actif que
 * pendant les horaires d'ouverture.
 */
export const MARTINIQUE = {
  /** Mardi 29 septembre 2026, 18h : ouvert. */
  ouvert: new Date("2026-09-29T18:00:00-04:00"),
  /** Mardi 29 septembre 2026, 12h : fermé, ouvre à 17h30. */
  ferme: new Date("2026-09-29T12:00:00-04:00"),
  /** Dimanche 4 octobre 2026, 12h : fermé, ouvre lundi. */
  dimanche: new Date("2026-10-04T12:00:00-04:00"),
  /** Mardi 29 septembre 2026, 21h30 : ouvert, ferme à 22h. */
  bientotFerme: new Date("2026-09-29T21:30:00-04:00"),
};

/** Fige `new Date()` dans la page ; les minuteries continuent de tourner. */
export async function fixerHeure(page: Page, date: Date) {
  await page.clock.setFixedTime(date);
}
