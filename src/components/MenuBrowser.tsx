"use client";

import { useEffect, useMemo, useState } from "react";
import { menu, tagLabels } from "@/data/menu";
import { MenuItemCard } from "@/components/MenuItemCard";
import { SectionTitle } from "@/components/SectionTitle";
import { filterMenu, type MenuTag } from "@/lib/search";

type TagFilter = MenuTag;

const TAG_FILTERS: TagFilter[] = ["vegetarien", "poisson", "epice", "sucre"];

const CATEGORY_IDS = new Set(menu.map((category) => category.id));

export function MenuBrowser() {
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState<TagFilter[]>([]);
  const [pendingAnchor, setPendingAnchor] = useState<string | null>(null);

  const toggleTag = (tag: TagFilter) =>
    setActiveTags((current) =>
      current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag],
    );

  const resetFilters = () => {
    setQuery("");
    setActiveTags([]);
  };

  const filtered = useMemo(() => filterMenu(menu, query, activeTags), [query, activeTags]);
  const resultCount = filtered.reduce((sum, category) => sum + category.items.length, 0);
  const isFiltering = query.trim().length > 0 || activeTags.length > 0;

  // Un lien vers une catégorie masquée par les filtres (header, sommaire) ne
  // mènerait nulle part : on lève les filtres, puis on défile une fois la
  // section rendue.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.('a[href^="#"]');
      const id = link?.getAttribute("href")?.slice(1);
      if (!id || !CATEGORY_IDS.has(id) || document.getElementById(id)) return;
      event.preventDefault();
      setQuery("");
      setActiveTags([]);
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
        Barre de filtres collante, pleine largeur : le client garde la recherche
        sous le pouce. Le fond doit couvrir toute la fenêtre, sinon le contenu
        défile visiblement dans les gouttières sur grand écran.
      */}
      <div className="sticky top-16 z-20 border-b border-hairline bg-ink/95 backdrop-blur short:static">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center">
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

          {/* Une seule ligne défilante sur mobile : la barre collante reste basse. */}
          <div
            className="-mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
            role="group"
            aria-label="Filtrer la carte"
          >
            {TAG_FILTERS.map((tag) => {
              const active = activeTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleTag(tag)}
                  className={`min-h-10 shrink-0 rounded-full border px-3.5 font-heading text-sm font-semibold uppercase tracking-wide transition-colors ${
                    active
                      ? "border-red-cta bg-red-cta text-white"
                      : "border-control text-white hover:border-red"
                  }`}
                >
                  {tagLabels[tag]}
                </button>
              );
            })}
            {isFiltering ? (
              <button
                type="button"
                onClick={resetFilters}
                className="min-h-10 shrink-0 rounded-full px-3 text-sm text-muted underline underline-offset-4 hover:text-white"
              >
                Effacer<span className="sr-only"> la recherche et les filtres</span>
              </button>
            ) : null}
          </div>
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
        <div className="mx-auto max-w-5xl px-4 py-16 text-center text-muted">
          <p>Rien ne correspond à cette recherche. Appelez-nous, on trouvera.</p>
          <button type="button" onClick={resetFilters} className="btn-ghost mt-6 text-sm">
            Voir toute la carte
          </button>
        </div>
      ) : (
        <div className="mx-auto max-w-5xl space-y-16 px-4 py-12">
          {filtered.map((category) => (
            <section
              key={category.id}
              id={category.id}
              aria-labelledby={`${category.id}-titre`}
              tabIndex={-1}
              className="outline-none"
            >
              <SectionTitle
                id={`${category.id}-titre`}
                level={3}
                prefix={category.titlePrefix}
                accent={category.titleAccent}
                subtitle={category.subtitle}
              />
              <ul
                className={`mt-6 grid gap-3 ${
                  category.layout === "list"
                    ? "sm:grid-cols-2 lg:grid-cols-3"
                    : "sm:grid-cols-2"
                }`}
              >
                {category.items.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    compact={category.layout === "list"}
                  />
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
