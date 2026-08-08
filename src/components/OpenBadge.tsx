"use client";

import { useEffect, useState } from "react";
import { getOpenState, type OpenState } from "@/lib/hours";

/**
 * Statut ouvert/fermé en temps réel.
 *
 * Calculé côté client uniquement : le HTML est généré au build (ISR), donc un
 * statut rendu au serveur serait périmé et provoquerait une erreur
 * d'hydratation. On affiche les horaires en repli tant que le JS n'a pas pris
 * la main — jamais un statut potentiellement faux.
 */
export function OpenBadge({ className = "" }: { className?: string }) {
  const [state, setState] = useState<OpenState | null>(null);

  useEffect(() => {
    const update = () => setState(getOpenState());
    update();
    // Une minute suffit : la précision utile est celle de l'heure d'ouverture.
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  if (!state) {
    return (
      <span
        className={`inline-flex items-center gap-2 text-sm text-muted ${className}`}
      >
        Service de 17h30 à 22h
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-hairline bg-surface px-3 py-1.5 text-sm ${className}`}
    >
      <span
        aria-hidden
        className={`size-2 rounded-full ${state.isOpen ? "bg-leaf" : "bg-red"}`}
      />
      <span className={state.isOpen ? "text-leaf" : "text-muted"}>{state.label}</span>
    </span>
  );
}
