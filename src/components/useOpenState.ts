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
    const update = () => setState(getOpenState());
    update();
    // Une minute suffit : la précision utile est celle de l'heure d'ouverture.
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return state;
}
