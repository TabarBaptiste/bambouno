"use client";

import { useState } from "react";
import { site } from "@/data/site";
import { PinIcon } from "@/components/icons";

/**
 * Plan Google Maps chargé au toucher, pas d'office : l'intégration dépose des
 * cookies Google (consentement requis en France, CNIL) et pèse près d'1 Mo,
 * que la plupart des visiteurs venus commander n'ont pas à télécharger.
 */
export function MapEmbed() {
  const [loaded, setLoaded] = useState(false);

  if (loaded) {
    return (
      <iframe
        src={site.mapsEmbedUrl}
        title={`Plan d'accès à ${site.name}, ${site.address.city}`}
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        className="aspect-[4/3] w-full rounded-card border border-hairline"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setLoaded(true)}
      className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 rounded-card border border-control bg-[radial-gradient(circle_at_50%_45%,rgba(230,51,41,0.18),transparent_60%)] text-white transition-colors hover:border-red"
    >
      <PinIcon className="size-8 text-red" />
      <span className="font-heading text-base font-semibold uppercase tracking-wide">
        Afficher le plan
      </span>
      <span className="text-xs text-muted">Google Maps</span>
    </button>
  );
}
