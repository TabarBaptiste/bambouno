"use client";

import { useRef, useState } from "react";
import { formatPrice, menuIndex } from "@/data/menu";
import { site } from "@/data/site";
import { useOrder } from "@/components/OrderProvider";
import { NewTabHint } from "@/components/NewTabHint";
import { whatsappUrl } from "@/lib/order";
import { WhatsAppIcon } from "@/components/icons";

/** Quand la barre disparaît (panier vidé), le focus revient sur la carte. */
function focusMenu() {
  document.getElementById("carte")?.focus();
}

/**
 * Barre de commande fixe en bas d'écran. Elle n'apparaît qu'une fois un plat
 * sélectionné, pour ne pas manger l'écran pendant la lecture de la carte.
 */
export function OrderBar() {
  const { lines, count, total, add, remove, clear } = useOrder();
  const [expanded, setExpanded] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);

  if (count === 0) return null;

  const removeOne = (id: string, quantity: number) => {
    remove(id);
    // La ligne disparaît avec sa dernière unité : on garde le focus dans la
    // barre, ou sur la carte si c'était le dernier article.
    if (quantity === 1) {
      if (count === 1) focusMenu();
      else toggle.current?.focus();
    }
  };

  const clearAll = () => {
    clear();
    setExpanded(false);
    focusMenu();
  };

  const articles = count > 1 ? "articles" : "article";

  return (
    <>
      {/*
        Cale de la hauteur de la barre : réservée seulement quand la barre
        existe, pour ne pas laisser de vide sous le pied de page à vide.
      */}
      <div aria-hidden className="h-32" />
      <div
        id="order-bar"
        role="region"
        aria-label="Votre sélection"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-ink/95 pb-[env(safe-area-inset-bottom)] backdrop-blur"
      >
        <div
          id="order-bar-detail"
          hidden={!expanded}
          className="mx-auto max-h-[45vh] max-w-3xl overflow-y-auto px-4 pt-4 short:max-h-[40vh]"
        >
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
                      {formatPrice(item.price)} l&apos;unité
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeOne(line.id, line.quantity)}
                    aria-label={`Retirer un ${item.name}`}
                    className="size-10 rounded-full border border-control leading-none hover:border-red hover:text-red-text"
                  >
                    <span aria-hidden>−</span>
                  </button>
                  <span className="min-w-5 text-center font-heading font-semibold">
                    <span className="sr-only">Quantité : </span>
                    {line.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => add(line.id)}
                    aria-label={`Ajouter un ${item.name}`}
                    className="size-10 rounded-full bg-red-cta leading-none text-white hover:bg-red-dark"
                  >
                    <span aria-hidden>+</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            onClick={clearAll}
            className="my-3 min-h-10 text-sm text-muted underline underline-offset-4 hover:text-white"
          >
            Vider la sélection
          </button>
        </div>

        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <button
            ref={toggle}
            type="button"
            onClick={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
            aria-controls="order-bar-detail"
            className="flex min-h-10 min-w-0 flex-1 items-center gap-2 rounded-lg text-left"
          >
            <span
              aria-hidden
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-red-cta font-heading font-semibold"
            >
              {count}
            </span>
            <span className="min-w-0">
              <span className="sr-only">
                {count} {articles}, total{" "}
              </span>
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
            <span className="sr-only"> sur WhatsApp</span>
            <NewTabHint />
          </a>
        </div>

        <p className="px-4 pb-2 text-center text-xs leading-tight text-muted short:hidden">
          Total indicatif - la commande est confirmée par {site.name} sur WhatsApp.
        </p>
      </div>
    </>
  );
}
