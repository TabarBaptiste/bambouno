"use client";

import { useRef } from "react";
import { formatPrice, tagLabels, type MenuItem } from "@/data/menu";
import { useOrder } from "@/components/OrderProvider";

export function MenuItemCard({
  item,
  compact = false,
}: {
  item: MenuItem;
  compact?: boolean;
}) {
  const { quantityOf, add, remove } = useOrder();
  const quantity = quantityOf(item.id);
  const addButton = useRef<HTMLButtonElement>(null);

  const removeOne = () => {
    // Le bouton « − » disparaît quand la quantité retombe à zéro : on rend le
    // focus au bouton d'ajout pour ne pas perdre l'utilisateur clavier.
    if (quantity === 1) addButton.current?.focus();
    remove(item.id);
  };

  return (
    <li
      className={`group relative flex flex-col rounded-card border bg-surface p-4 transition-colors ${
        quantity > 0 ? "border-red/60" : "border-hairline"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h4 className="font-heading text-lg font-semibold uppercase leading-tight tracking-tight text-red-text">
          {item.name}
          <span aria-hidden className="mt-1 block h-px w-full bg-white/80" />
        </h4>
        <p className="shrink-0 font-heading text-lg font-semibold text-red-text">
          <span className="sr-only">Prix : </span>
          {formatPrice(item.price)}
        </p>
      </div>

      {item.description && !compact ? (
        <p className="mt-2 text-sm leading-snug text-muted">{item.description}</p>
      ) : null}

      {item.note || item.tags?.length ? (
        <ul className="mt-3 flex flex-wrap items-center gap-1.5" aria-label="Particularités">
          {item.note ? (
            <li className="rounded-full bg-mango/15 px-2 py-0.5 text-xs font-medium text-mango">
              {item.note}
            </li>
          ) : null}
          {item.tags?.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-hairline px-2 py-0.5 text-xs text-muted"
            >
              {tagLabels[tag]}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-auto flex items-center justify-end gap-2 pt-4">
        {quantity > 0 ? (
          <>
            <button
              type="button"
              onClick={removeOne}
              aria-label={`Retirer un ${item.name}`}
              className="size-10 rounded-full border border-control text-lg leading-none text-white transition-colors hover:border-red hover:text-red-text"
            >
              <span aria-hidden>−</span>
            </button>
            <span className="min-w-6 text-center font-heading text-lg font-semibold">
              <span className="sr-only">Quantité : </span>
              {quantity}
            </span>
          </>
        ) : null}
        {/*
          Un seul et même bouton pour « Ajouter » et « + » : React conserve le
          nœud DOM, donc le focus clavier reste en place au premier ajout.
        */}
        <button
          ref={addButton}
          type="button"
          onClick={() => add(item.id)}
          aria-label={quantity > 0 ? `Ajouter un ${item.name}` : undefined}
          className={
            quantity > 0
              ? "size-10 rounded-full bg-red-cta text-lg leading-none text-white transition-colors hover:bg-red-dark"
              : "min-h-10 rounded-full border border-control px-4 font-heading text-sm font-semibold uppercase tracking-wide transition-colors hover:border-red hover:bg-red/10 hover:text-red-text"
          }
        >
          {quantity > 0 ? (
            <span aria-hidden>+</span>
          ) : (
            <>
              Ajouter<span className="sr-only"> {item.name}</span>
            </>
          )}
        </button>
      </div>
    </li>
  );
}
