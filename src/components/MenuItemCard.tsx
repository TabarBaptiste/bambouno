"use client";

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

  return (
    <li
      className={`group relative flex flex-col rounded-card border bg-surface p-4 transition-colors ${
        quantity > 0 ? "border-red/60" : "border-hairline hover:border-hairline/80"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-heading text-lg font-semibold uppercase leading-tight tracking-tight text-red">
          {item.name}
          <span className="mt-1 block h-px w-full bg-white/80" />
        </h3>
        <p className="shrink-0 font-heading text-lg font-semibold text-red">
          {formatPrice(item.price)}
        </p>
      </div>

      {item.description && !compact ? (
        <p className="mt-2 text-sm leading-snug text-muted">{item.description}</p>
      ) : null}

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {item.note ? (
          <span className="rounded-full bg-mango/15 px-2 py-0.5 text-xs font-medium text-mango">
            {item.note}
          </span>
        ) : null}
        {item.tags?.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-hairline px-2 py-0.5 text-xs text-muted"
          >
            {tagLabels[tag]}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-end gap-2">
        {quantity > 0 ? (
          <>
            <button
              type="button"
              onClick={() => remove(item.id)}
              aria-label={`Retirer un ${item.name}`}
              className="size-9 rounded-full border border-hairline text-lg leading-none text-white transition-colors hover:border-red hover:text-red"
            >
              −
            </button>
            <span
              aria-live="polite"
              className="min-w-6 text-center font-heading text-lg font-semibold"
            >
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => add(item.id)}
              aria-label={`Ajouter un ${item.name}`}
              className="size-9 rounded-full bg-red text-lg leading-none text-white transition-colors hover:bg-red-dark"
            >
              +
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => add(item.id)}
            className="rounded-full border border-hairline px-4 py-2 font-heading text-sm font-semibold uppercase tracking-wide transition-colors hover:border-red hover:bg-red/10 hover:text-red"
          >
            Ajouter
          </button>
        )}
      </div>
    </li>
  );
}
