"use client";

import Image from "next/image";
import { useRef } from "react";
import { formatPrice, type DishVisual, type MenuItem } from "@/data/menu";
import { DishIllustration } from "@/components/DishIllustration";
import { ChiliIcon, FishIcon, LeafIcon } from "@/components/icons";
import { useOrder } from "@/components/OrderProvider";

/**
 * Pictos à droite du nom. « Sucré » et « Alcool » n'en ont pas : la rubrique
 * (crêpes sucrées, bières) le dit déjà.
 */
const TAG_ICONS = {
  vegetarien: { Icon: LeafIcon, label: "Végétarien", color: "text-leaf" },
  poisson: { Icon: FishIcon, label: "Produits de la mer", color: "text-sky-300" },
  epice: { Icon: ChiliIcon, label: "Épicé", color: "text-red-text" },
} as const;

export function MenuItemCard({ item, visual }: { item: MenuItem; visual: DishVisual }) {
  const { quantityOf, add, remove } = useOrder();
  const quantity = quantityOf(item.id);
  const addButton = useRef<HTMLButtonElement>(null);

  const removeOne = () => {
    // Le bouton « − » disparaît quand la quantité retombe à zéro : on rend le
    // focus au bouton d'ajout pour ne pas perdre l'utilisateur clavier.
    if (quantity === 1) addButton.current?.focus();
    remove(item.id);
  };

  const icons = (item.tags ?? []).flatMap((tag) =>
    tag in TAG_ICONS ? [TAG_ICONS[tag as keyof typeof TAG_ICONS]] : [],
  );

  return (
    <li className="flex items-start gap-4 py-4">
      <div className="relative size-16 shrink-0 overflow-hidden rounded-full sm:size-20">
        {item.image ? (
          <Image src={item.image} alt="" fill sizes="80px" className="object-cover" />
        ) : (
          <DishIllustration visual={visual} className="size-full" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h4 className="flex flex-wrap items-center gap-x-1.5 font-heading text-lg font-semibold uppercase leading-tight tracking-wide text-white">
            {item.name}
            {icons.map(({ Icon, label, color }) => (
              <Icon key={label} label={label} className={`size-4 shrink-0 ${color}`} />
            ))}
          </h4>
          <p className="shrink-0 font-heading text-lg font-semibold leading-tight text-red-text">
            <span className="sr-only">Prix : </span>
            {formatPrice(item.price)}
          </p>
        </div>
        {item.description ? (
          <p className="mt-1 text-sm leading-snug text-muted">{item.description}</p>
        ) : null}
        {item.note ? <p className="mt-1 text-xs font-medium text-mango">{item.note}</p> : null}

        {/*
          Sous le texte, « + » toujours au même endroit, à droite : on peut
          taper deux fois vite sans que le bouton bouge. Le « − » et la
          quantité apparaissent à sa gauche. Le « + » reste le même nœud DOM,
          donc le focus clavier ne saute pas non plus.
        */}
        <div className="mt-3 flex items-center justify-end gap-3">
          {quantity > 0 ? (
            <>
              <button
                type="button"
                onClick={removeOne}
                aria-label={`Retirer ${item.name}`}
                className="flex size-11 items-center justify-center rounded-full border border-control text-2xl leading-none text-white transition-colors hover:border-red hover:text-red-text"
              >
                <span aria-hidden>−</span>
              </button>
              <span className="min-w-5 text-center font-heading text-lg font-semibold leading-none">
                <span className="sr-only">Quantité : </span>
                {quantity}
              </span>
            </>
          ) : null}
          <button
            ref={addButton}
            type="button"
            onClick={() => add(item.id)}
            aria-label={`Ajouter ${item.name}`}
            className="flex size-11 items-center justify-center rounded-full bg-red-cta text-2xl leading-none text-white transition-colors hover:bg-red-dark"
          >
            <span aria-hidden>+</span>
          </button>
        </div>
      </div>
    </li>
  );
}
