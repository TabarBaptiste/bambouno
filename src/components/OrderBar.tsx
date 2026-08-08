"use client";

import { useState } from "react";
import { formatPrice, menuIndex } from "@/data/menu";
import { site } from "@/data/site";
import { useOrder } from "@/components/OrderProvider";
import { whatsappUrl } from "@/lib/order";
import { WhatsAppIcon } from "@/components/icons";

/**
 * Barre de commande fixe en bas d'écran. Elle n'apparaît qu'une fois un plat
 * sélectionné, pour ne pas manger l'écran pendant la lecture de la carte.
 */
export function OrderBar() {
  const { lines, count, total, add, remove, clear } = useOrder();
  const [expanded, setExpanded] = useState(false);

  if (count === 0) return null;

  return (
    <>
      {/*
        Cale de la hauteur de la barre : réservée seulement quand la barre
        existe, pour ne pas laisser de vide sous le pied de page à vide.
      */}
      <div aria-hidden className="h-28" />
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-ink/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      {expanded ? (
        <div className="mx-auto max-h-[45vh] max-w-3xl overflow-y-auto px-4 pt-4">
          <ul className="divide-y divide-hairline">
            {lines.map((line) => {
              const item = menuIndex[line.id];
              if (!item) return null;
              return (
                <li key={line.id} className="flex items-center gap-3 py-2.5">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-heading text-base font-semibold uppercase">
                      {item.name}
                    </p>
                    <p className="text-sm text-muted">
                      {formatPrice(item.price)} l'unité
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(line.id)}
                    aria-label={`Retirer un ${item.name}`}
                    className="size-8 rounded-full border border-hairline leading-none hover:border-red hover:text-red"
                  >
                    −
                  </button>
                  <span className="min-w-5 text-center font-heading font-semibold">
                    {line.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => add(line.id)}
                    aria-label={`Ajouter un ${item.name}`}
                    className="size-8 rounded-full bg-red leading-none text-white hover:bg-red-dark"
                  >
                    +
                  </button>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            onClick={clear}
            className="my-3 text-sm text-muted underline underline-offset-4 hover:text-white"
          >
            Vider la sélection
          </button>
        </div>
      ) : null}

      <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          className="flex min-w-0 flex-1 items-center gap-2 text-left"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-red font-heading font-semibold">
            {count}
          </span>
          <span className="min-w-0">
            <span className="block font-heading text-lg font-semibold leading-none">
              {formatPrice(total)}
            </span>
            <span className="block text-xs text-muted">
              {expanded ? "Masquer le détail" : "Voir le détail"}
            </span>
          </span>
        </button>

        <a
          href={whatsappUrl(lines)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary shrink-0 text-sm"
        >
          <WhatsAppIcon className="size-5" />
          Commander
        </a>
      </div>

      <p className="px-4 pb-2 text-center text-[11px] leading-tight text-muted">
        Total indicatif — la commande est confirmée par {site.name} sur WhatsApp.
      </p>
    </div>
    </>
  );
}
