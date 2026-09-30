"use client";

import { useEffect, useMemo, useState } from "react";
import { countLabel, menu } from "@/data/menu";
import { CategoryBar } from "@/components/CategoryBar";
import { MenuItemCard } from "@/components/MenuItemCard";
import { useSearch } from "@/components/SearchProvider";
import { SectionTitle } from "@/components/SectionTitle";
import { filterMenu } from "@/lib/search";

const CATEGORY_IDS = new Set(menu.map((category) => category.id));

export function MenuBrowser() {
  const { query, setQuery } = useSearch();
  const [pendingAnchor, setPendingAnchor] = useState<string | null>(null);

  const resetFilters = () => setQuery("");

  const filtered = useMemo(() => filterMenu(menu, query, []), [query]);
  const resultCount = filtered.reduce((sum, category) => sum + category.items.length, 0);
  const isFiltering = query.trim().length > 0;

  // Un lien vers une catégorie masquée par la recherche (header, rubriques) ne
  // mènerait nulle part : on vide la recherche, puis on défile une fois la
  // section rendue.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.('a[href^="#"]');
      const id = link?.getAttribute("href")?.slice(1);
      if (!id || !CATEGORY_IDS.has(id) || document.getElementById(id)) return;
      event.preventDefault();
      setQuery("");
      setPendingAnchor(id);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [setQuery]);

  useEffect(() => {
    if (!pendingAnchor) return;
    window.history.pushState(null, "", `#${pendingAnchor}`);
    const target = document.getElementById(pendingAnchor);
    target?.scrollIntoView();
    target?.focus({ preventScroll: true });
    setPendingAnchor(null);
  }, [pendingAnchor]);

  // Pendant une recherche, la carte garde au moins la hauteur de l'écran :
  // sinon la page raccourcit à chaque lettre et le navigateur la fait sauter.
  return (
    <div className={isFiltering ? "min-h-[100dvh]" : undefined}>
      <CategoryBar categories={filtered} />

      {/* Nombre de résultats annoncé aux lecteurs d'écran pendant la saisie. */}
      <p role="status" className="sr-only">
        {isFiltering
          ? resultCount === 0
            ? "Aucun plat ne correspond."
            : `${resultCount} ${resultCount > 1 ? "plats correspondent" : "plat correspond"}.`
          : ""}
      </p>

      {filtered.length === 0 ? (
        <div className="mx-auto max-w-3xl px-4 py-16 text-center text-muted">
          <p>Rien ne correspond à cette recherche. Appelez-nous, on trouvera.</p>
          <button type="button" onClick={resetFilters} className="btn-ghost mt-6 text-sm">
            Voir toute la carte
          </button>
        </div>
      ) : (
        <div
          id="menu-liste"
          tabIndex={-1}
          className="mx-auto max-w-3xl space-y-12 px-4 py-10 outline-none"
        >
          {filtered.map((category) => (
            <section
              key={category.id}
              id={category.id}
              aria-labelledby={`${category.id}-titre`}
              tabIndex={-1}
              className="outline-none"
            >
              <div className="flex items-end justify-between gap-4">
                <SectionTitle
                  id={`${category.id}-titre`}
                  level={3}
                  prefix={category.titlePrefix}
                  accent={category.titleAccent}
                />
                <p className="shrink-0 pb-1 text-sm text-muted">
                  {countLabel(category.items.length, category.unit)}
                </p>
              </div>
              {category.subtitle ? (
                <p className="mt-3 text-sm text-muted">{category.subtitle}</p>
              ) : null}
              <ul className="mt-2 divide-y divide-hairline">
                {category.items.map((item) => (
                  <MenuItemCard key={item.id} item={item} visual={category.visual} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
