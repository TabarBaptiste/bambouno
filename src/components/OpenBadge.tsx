"use client";

import { useOpenState } from "@/components/useOpenState";

/** Badge « Ouvert » / « Fermé • Ouvre à 17h30 » (voir useOpenState). */
export function OpenBadge({ className = "" }: { className?: string }) {
  const state = useOpenState();

  if (!state) {
    // Emplacement vide de la taille du badge, le temps du calcul : pas de
    // saut de mise en page, et jamais un statut potentiellement faux.
    return (
      <span
        aria-hidden
        className={`inline-block h-8 w-24 rounded-full border border-hairline bg-surface ${className}`}
      />
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
