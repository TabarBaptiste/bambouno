"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { site } from "@/data/site";
import {
  ClockIcon,
  MenuIcon,
  PhoneIcon,
  PinIcon,
  PizzaIcon,
  SearchIcon,
} from "@/components/icons";
import { useSearch } from "@/components/SearchProvider";

const LINKS = [
  { href: "#carte", label: "La carte", Icon: PizzaIcon },
  { href: "#horaires", label: "Horaires", Icon: ClockIcon },
  { href: "#adresse", label: "Adresse", Icon: PinIcon },
];

const ICON_BUTTON =
  "relative flex size-11 shrink-0 items-center justify-center rounded-full border border-control text-white transition-colors hover:border-red";

/**
 * Mode recherche : la page ne montre plus que la carte (hero, rubriques,
 * infos et pied de page masqués en CSS, cf. globals.css) et remonte en haut.
 * Le header est alors à sa place naturelle : sur iPhone, rien à faire
 * défiler quand le clavier s'ouvre, donc la barre ne disparaît plus.
 */
function setSearchMode(on: boolean) {
  if (on) document.documentElement.dataset.recherche = "";
  else delete document.documentElement.dataset.recherche;
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { query, setQuery } = useSearch();
  const header = useRef<HTMLElement>(null);
  const menuToggle = useRef<HTMLButtonElement>(null);
  const searchToggle = useRef<HTMLButtonElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  // Position de lecture avant la recherche, rendue à la fermeture.
  const scrollBeforeSearch = useRef<number | null>(null);

  // Échap ou clic en dehors referment le menu ; Échap rend le focus au bouton.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      menuToggle.current?.focus();
      setMenuOpen(false);
    };
    const onPointer = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [menuOpen]);

  const openSearch = () => {
    scrollBeforeSearch.current = window.scrollY;
    // Rendu synchrone puis focus dans le même geste : sur iPhone, c'est la
    // seule façon d'ouvrir le clavier.
    flushSync(() => {
      setMenuOpen(false);
      setSearchOpen(true);
    });
    setSearchMode(true);
    window.scrollTo({ top: 0, behavior: "instant" });
    searchInput.current?.focus({ preventScroll: true });
  };

  // Fermer la recherche la vide et rend la page telle qu'on l'avait laissée.
  const closeSearch = (restoreFocus = true) => {
    const previous = scrollBeforeSearch.current;
    if (previous === null) return; // déjà fermée
    scrollBeforeSearch.current = null;
    flushSync(() => {
      setSearchOpen(false);
      setQuery("");
    });
    setSearchMode(false);
    window.scrollTo({ top: previous, behavior: "instant" });
    if (restoreFocus) searchToggle.current?.focus({ preventScroll: true });
  };

  // Champ vide rangé (loupe ou « OK » du clavier, toucher ailleurs) : la
  // recherche n'a plus lieu d'être. Léger délai pour laisser aboutir un
  // toucher en cours (sur un plat par exemple) avant que la page change.
  const closeIfEmpty = () => {
    window.setTimeout(() => {
      const input = searchInput.current;
      if (input && document.activeElement !== input && !input.value.trim()) {
        closeSearch(false);
      }
    }, 250);
  };

  return (
    <header
      ref={header}
      // Écran très bas : le header défile avec la page (WCAG 1.4.10), sauf
      // pendant une recherche, où le clavier seul réduit la hauteur visible et
      // où le champ doit rester à l'écran.
      className={`sticky top-0 z-30 border-b border-hairline bg-ink ${searchOpen ? "" : "short:static"}`}
    >
      {/*
        La recherche prend la place de la ligne du header, à hauteur égale :
        rien ne se décale, et le champ reste en haut de l'écran avec le clavier.
      */}
      <form
        role="search"
        hidden={!searchOpen}
        onSubmit={(event) => {
          event.preventDefault();
          // Touche « Rechercher » : on range le clavier pour voir les
          // résultats, ou on referme tout si le champ est vide.
          if (query.trim()) searchInput.current?.blur();
          else closeSearch();
        }}
        className="mx-auto flex h-16 max-w-5xl items-center gap-2 px-4"
      >
        <label className="flex-1">
          <span className="sr-only">Rechercher un plat ou un ingrédient</span>
          <input
            ref={searchInput}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onBlur={closeIfEmpty}
            onKeyDown={(event) => {
              if (event.key === "Escape") closeSearch();
            }}
            placeholder="Crevettes, chèvre, nutella…"
            enterKeyHint="search"
            autoComplete="off"
            className="w-full rounded-full border border-control bg-surface px-4 py-2.5 text-base text-white placeholder:text-muted sm:text-sm"
          />
        </label>
        <button
          type="button"
          onClick={() => closeSearch()}
          className="min-h-11 shrink-0 rounded-full px-2 font-heading text-base font-semibold uppercase tracking-wide text-white hover:text-red-text"
        >
          Fermer<span className="sr-only"> la recherche</span>
        </button>
      </form>

      <div
        hidden={searchOpen}
        className="mx-auto flex h-16 max-w-5xl items-center gap-2 px-4"
      >
        <a href="#top" className="mr-auto shrink-0" aria-label={`${site.name}, retour en haut de page`}>
          <span className="section-title text-xl sm:text-2xl">
            <span className="text-white">Bambou</span>
            <span className="text-red">no</span>
          </span>
        </a>

        <a href={`tel:${site.phone}`} className="btn-primary min-h-11 px-4 py-2 text-sm">
          <PhoneIcon className="size-4" />
          {/* Sur mobile, l'icône seule reste nommée pour les lecteurs d'écran. */}
          <span className="sr-only sm:not-sr-only">Appeler</span>
          <span className="sr-only"> le {site.phoneDisplay}</span>
        </a>

        <button
          ref={searchToggle}
          type="button"
          onClick={openSearch}
          aria-label="Rechercher"
          className={ICON_BUTTON}
        >
          <SearchIcon open={false} className="size-5" />
        </button>

        <button
          ref={menuToggle}
          type="button"
          onClick={() => setMenuOpen((value) => !value)}
          aria-expanded={menuOpen}
          aria-controls="menu-principal"
          aria-label="Menu"
          className={ICON_BUTTON}
        >
          <MenuIcon open={menuOpen} className="size-5" />
        </button>
      </div>

      {/* Le menu se superpose à la page au lieu de la pousser : le refermer ne décale rien. */}
      <nav
        id="menu-principal"
        aria-label="Navigation principale"
        hidden={!menuOpen}
        className="absolute inset-x-0 top-full border-b border-hairline bg-ink shadow-[0_12px_24px_-12px_rgba(0,0,0,0.8)]"
      >
        <ul className="mx-auto max-w-5xl px-4 py-2">
          {LINKS.map(({ href, label, Icon }) => (
            <li key={href}>
              <a
                href={href}
                onClick={() => setMenuOpen(false)}
                className="flex min-h-12 items-center gap-3 font-heading text-lg font-semibold uppercase tracking-wide text-white hover:text-red-text"
              >
                <Icon className="size-5 text-red" />
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
