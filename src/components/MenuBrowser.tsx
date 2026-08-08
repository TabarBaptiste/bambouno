"use client";

import { useMemo, useState } from "react";
import { menu, tagLabels, type MenuItem } from "@/data/menu";
import { MenuItemCard } from "@/components/MenuItemCard";
import { SectionTitle } from "@/components/SectionTitle";

type TagFilter = NonNullable<MenuItem["tags"]>[number];

const TAG_FILTERS: TagFilter[] = ["vegetarien", "poisson", "epice", "sucre"];

export function MenuBrowser() {
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState<TagFilter[]>([]);

  const toggleTag = (tag: TagFilter) =>
    setActiveTags((current) =>
      current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag],
    );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return menu
      .map((category) => ({
        ...category,
        items: category.items.filter((item) => {
          // Les filtres se cumulent en ET : « Végé + Sucré » ne renvoie que
          // les items qui portent les deux étiquettes.
          const matchesTags = activeTags.every((tag) => item.tags?.includes(tag));
          if (!matchesTags) return false;
          if (!needle) return true;
          return (
            item.name.toLowerCase().includes(needle) ||
            (item.description?.toLowerCase().includes(needle) ?? false)
          );
        }),
      }))
      .filter((category) => category.items.length > 0);
  }, [query, activeTags]);

  const isFiltering = query.trim().length > 0 || activeTags.length > 0;

  return (
    <div>
      {/*
        Barre de filtres collante, pleine largeur : le client garde la recherche
        sous le pouce. Le fond doit couvrir toute la fenêtre, sinon le contenu
        défile visiblement dans les gouttières sur grand écran.
      */}
      <div className="sticky top-16 z-20 border-b border-hairline bg-ink/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center">
          <label className="relative flex-1">
            <span className="sr-only">Rechercher un plat ou un ingrédient</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Chercher : crevettes, chèvre, nutella…"
              className="w-full rounded-full border border-hairline bg-surface px-4 py-2.5 text-sm text-white placeholder:text-muted focus:border-red focus:outline-none"
            />
          </label>

          <div className="flex flex-wrap gap-2" role="group" aria-label="Filtres">
            {TAG_FILTERS.map((tag) => {
              const active = activeTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleTag(tag)}
                  className={`rounded-full border px-3 py-1.5 font-heading text-sm font-semibold uppercase tracking-wide transition-colors ${
                    active
                      ? "border-red bg-red text-white"
                      : "border-hairline text-muted hover:border-red hover:text-white"
                  }`}
                >
                  {tagLabels[tag]}
                </button>
              );
            })}
            {isFiltering ? (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setActiveTags([]);
                }}
                className="rounded-full px-3 py-1.5 text-sm text-muted underline underline-offset-4 hover:text-white"
              >
                Effacer
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mx-auto max-w-5xl px-4 py-16 text-center text-muted">
          Rien ne correspond à cette recherche. Appelez-nous, on trouvera.
        </p>
      ) : (
        <div className="mx-auto max-w-5xl space-y-16 px-4 py-12">
          {filtered.map((category) => (
            <section key={category.id} id={category.id} className="scroll-mt-40">
              <SectionTitle
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
