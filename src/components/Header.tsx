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

/** Hauteur cumulée du header et de la barre de rubriques collée. */
const STICKY_OFFSET = 64 + 57;

/**
 * Place le haut de la carte juste sous les barres collées, une seule fois, à
 * l'ouverture de la recherche. Ensuite plus aucun défilement programmé : les
 * résultats s'affichent à cet endroit pendant la frappe, sans rien bouger.
 */
function alignMenuList() {
  const list = document.getElementById("menu-liste");
  if (!list) return;
  const top = list.getBoundingClientRect().top + window.scrollY - STICKY_OFFSET;
  window.scrollTo({ top, behavior: "instant" });
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { query, setQuery } = useSearch();
  const header = useRef<HTMLElement>(null);
  const menuToggle = useRef<HTMLButtonElement>(null);
  const searchToggle = useRef<HTMLButtonElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);

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
    // Rendu synchrone puis focus dans le même geste : sur iPhone, c'est la
    // seule façon d'ouvrir le clavier.
    flushSync(() => {
      setMenuOpen(false);
      setSearchOpen(true);
    });
    alignMenuList();
    searchInput.current?.focus({ preventScroll: true });
  };

  // Fermer la recherche la vide : pas de filtre caché qui traîne ensuite.
  const closeSearch = () => {
    flushSync(() => {
      setSearchOpen(false);
      setQuery("");
    });
    searchToggle.current?.focus();
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
          // « Rechercher » sur le clavier : on le range pour voir les résultats.
          searchInput.current?.blur();
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
            onKeyDown={(event) => {
              if (event.key === "Escape") closeSearch();
            }}
            placeholder="Crevettes, chèvre, nutella…"
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
          onClick={closeSearch}
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
