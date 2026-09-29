"use client";

import { useEffect, useMemo, useState } from "react";
import { menu } from "@/data/menu";
import { MenuItemCard } from "@/components/MenuItemCard";
import { filterMenu } from "@/lib/search";

const CATEGORY_IDS = new Set(menu.map((category) => category.id));

export function MenuBrowser() {
  const [query, setQuery] = useState("");
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
  }, []);

  useEffect(() => {
    if (!pendingAnchor) return;
    window.history.pushState(null, "", `#${pendingAnchor}`);
    const target = document.getElementById(pendingAnchor);
    target?.scrollIntoView();
    target?.focus({ preventScroll: true });
    setPendingAnchor(null);
  }, [pendingAnchor]);

  return (
    <div>
      {/*
        Barre de recherche collante, pleine largeur : le client garde la
        recherche sous le pouce. Le fond doit couvrir toute la fenêtre, sinon le
        contenu défile visiblement dans les gouttières sur grand écran.
      */}
      <div className="sticky top-16 z-20 border-b border-hairline bg-ink/95 backdrop-blur short:static">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <label className="relative flex-1">
            <span className="sr-only">Rechercher un plat ou un ingrédient</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Chercher : crevettes, chèvre, nutella…"
              enterKeyHint="search"
              autoComplete="off"
              className="w-full rounded-full border border-control bg-surface px-4 py-2.5 text-base text-white placeholder:text-muted focus:border-red sm:text-sm"
            />
          </label>
          {isFiltering ? (
            <button
              type="button"
              onClick={resetFilters}
              className="min-h-10 shrink-0 rounded-full px-2 text-sm text-muted underline underline-offset-4 hover:text-white"
            >
              Effacer<span className="sr-only"> la recherche</span>
            </button>
          ) : null}
        </div>
      </div>

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
        <div className="mx-auto max-w-3xl space-y-12 px-4 py-10">
          {filtered.map((category) => (
            <section
              key={category.id}
              id={category.id}
              aria-labelledby={`${category.id}-titre`}
              tabIndex={-1}
              className="outline-none"
            >
              <header className="flex items-baseline justify-between gap-4 border-b border-hairline pb-3">
                <h3
                  id={`${category.id}-titre`}
                  className="section-title text-3xl sm:text-4xl"
                >
                  {category.title}
                </h3>
                <p className="shrink-0 text-sm text-muted">
                  {category.items.length} {category.unit}
                </p>
              </header>
              {category.subtitle ? (
                <p className="mt-3 text-sm text-muted">{category.subtitle}</p>
              ) : null}
              <ul className="divide-y divide-hairline">
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
