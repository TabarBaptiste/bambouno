"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { menu, shortTitle } from "@/data/menu";
import { MenuItemCard } from "@/components/MenuItemCard";
import { filterMenu } from "@/lib/search";

/**
 * Recherche en fenêtre plein écran (<dialog> modal), résultats et boutons
 * d'ajout compris. Filtrer la page principale pendant la frappe ne tient pas
 * sur mobile : le clavier réduit la fenêtre visible, le navigateur fait
 * défiler la page pour garder le champ à l'écran, et un champ dans un
 * en-tête collé finit hors champ. Ici rien ne défile en dehors de la fenêtre.
 */
export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open && !element.open) element.showModal();
    if (!open && element.open) element.close();
  }, [open]);

  // La fenêtre épouse la zone réellement visible : sur iOS, le clavier ne
  // réduit pas la fenêtre de mise en page, seulement la « visual viewport ».
  useEffect(() => {
    const element = dialog.current;
    const viewport = window.visualViewport;
    if (!open || !element || !viewport) return;
    const sync = () => {
      element.style.setProperty("--vv-h", `${viewport.height}px`);
      element.style.setProperty("--vv-top", `${viewport.offsetTop}px`);
    };
    sync();
    viewport.addEventListener("resize", sync);
    viewport.addEventListener("scroll", sync);
    return () => {
      viewport.removeEventListener("resize", sync);
      viewport.removeEventListener("scroll", sync);
    };
  }, [open]);

  return (
    <dialog
      ref={dialog}
      aria-label="Rechercher dans la carte"
      onClose={onClose}
      className="fixed inset-x-0 bottom-auto top-[var(--vv-top,0px)] m-0 h-[var(--vv-h,100dvh)] max-h-none w-full max-w-none overflow-hidden bg-ink p-0 text-white backdrop:bg-black/70 sm:bottom-0 sm:top-0 sm:m-auto sm:h-[80vh] sm:max-w-xl sm:rounded-2xl sm:border sm:border-hairline"
    >
      {open ? <SearchPanel onClose={onClose} /> : null}
    </dialog>
  );
}

function SearchPanel({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const filtered = useMemo(() => filterMenu(menu, query, []), [query]);
  const count = filtered.reduce((sum, category) => sum + category.items.length, 0);
  const searching = query.trim().length > 0;

  return (
    <div className="flex h-full flex-col">
      <h2 className="sr-only">Rechercher dans la carte</h2>

      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          // « Rechercher » sur le clavier : on le range pour voir tous les résultats.
          input.current?.blur();
        }}
        className="flex items-center gap-3 border-b border-hairline px-4 py-3"
      >
        <label className="flex-1">
          <span className="sr-only">Rechercher un plat ou un ingrédient</span>
          <input
            ref={input}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Chercher : crevettes, chèvre, nutella…"
            enterKeyHint="search"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            className="w-full rounded-full border border-control bg-surface px-4 py-2.5 text-base text-white placeholder:text-muted sm:text-sm"
          />
        </label>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer la recherche"
          className="min-h-11 shrink-0 rounded-full px-3 font-heading text-base font-semibold uppercase tracking-wide hover:text-red-text"
        >
          Fermer
        </button>
      </form>

      {/* Nombre de résultats annoncé aux lecteurs d'écran pendant la saisie. */}
      <p role="status" className="sr-only">
        {searching
          ? count === 0
            ? "Aucun plat ne correspond."
            : `${count} ${count > 1 ? "plats correspondent" : "plat correspond"}.`
          : ""}
      </p>

      <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-[40vh]">
        {!searching ? (
          <p className="py-12 text-center text-muted">
            Tapez un plat ou un ingrédient : crevettes, chèvre, nutella…
          </p>
        ) : count === 0 ? (
          <div className="py-12 text-center text-muted">
            <p>Rien ne correspond à cette recherche. Appelez-nous, on trouvera.</p>
            <button type="button" onClick={() => setQuery("")} className="btn-ghost mt-6 text-sm">
              Effacer la recherche
            </button>
          </div>
        ) : (
          filtered.map((category) => (
            <section key={category.id} aria-labelledby={`recherche-${category.id}`} className="pt-6">
              <h3
                id={`recherche-${category.id}`}
                className="border-b border-hairline pb-2 font-heading text-lg font-semibold uppercase tracking-wide text-red-text"
              >
                {shortTitle(category)}
              </h3>
              <ul className="divide-y divide-hairline">
                {category.items.map((item) => (
                  <MenuItemCard key={item.id} item={item} visual={category.visual} />
                ))}
              </ul>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
