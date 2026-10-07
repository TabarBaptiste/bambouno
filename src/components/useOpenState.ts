"use client";

import { useEffect, useState } from "react";
import { getOpenState, type OpenState } from "@/lib/hours";

/**
 * Statut ouvert/fermé en temps réel, mis à jour chaque minute.
 *
 * Renvoie `null` tant que le JS n'a pas pris la main : le HTML est généré au
 * build, donc un statut rendu au serveur serait périmé et provoquerait une
 * erreur d'hydratation. Les appelants affichent un emplacement neutre, jamais
 * un statut potentiellement faux.
 */
export function useOpenState(): OpenState | null {
  const [state, setState] = useState<OpenState | null>(null);

  useEffect(() => {
    // BRANCHE DE DÉMO, À NE PAS FUSIONNER DANS main : `?heure=2026-10-07T19:00`
    // simule cette heure locale en Martinique, pour filmer la commande.
    const fake = new URLSearchParams(window.location.search).get("heure");
    const fakeStart = fake ? new Date(`${fake}-04:00`).getTime() : NaN;
    const mountedAt = Date.now();
    const now = () =>
      Number.isNaN(fakeStart) ? new Date() : new Date(fakeStart + (Date.now() - mountedAt));

    const update = () => setState(getOpenState(now()));
    update();
    // Une minute suffit : la précision utile est celle de l'heure d'ouverture.
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return state;
}
