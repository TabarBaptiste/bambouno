"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
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

type Panel = "menu" | "search" | null;

const ICON_BUTTON =
  "relative flex size-11 shrink-0 items-center justify-center rounded-full border border-control text-white transition-colors hover:border-red";

/** Amène la liste des plats à l'écran si la recherche l'a laissée hors champ. */
function revealResults(force = false) {
  const list = document.getElementById("menu-liste");
  if (!list) return;
  const top = list.getBoundingClientRect().top;
  if (force || top < 0 || top > window.innerHeight * 0.6) {
    list.scrollIntoView({ behavior: "instant", block: "start" });
  }
}

export function Header() {
  const [panel, setPanel] = useState<Panel>(null);
  const { query, setQuery } = useSearch();
  const header = useRef<HTMLElement>(null);
  const menuToggle = useRef<HTMLButtonElement>(null);
  const searchToggle = useRef<HTMLButtonElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);

  // Échap ou clic en dehors referment le panneau ; Échap rend le focus à son bouton.
  useEffect(() => {
    if (!panel) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      (panel === "menu" ? menuToggle : searchToggle).current?.focus();
      setPanel(null);
    };
    const onPointer = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) setPanel(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [panel]);

  useEffect(() => {
    if (panel === "search") searchInput.current?.focus();
  }, [panel]);

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPanel(null);
    if (!query.trim()) return;
    // La liste est rendue : on y amène la vue, et le focus avec elle.
    window.requestAnimationFrame(() => {
      revealResults(true);
      document.getElementById("menu-liste")?.focus({ preventScroll: true });
    });
  };

  const hasQuery = query.trim().length > 0;

  return (
    <header
      ref={header}
      className="sticky top-0 z-30 border-b border-hairline bg-ink short:static"
    >
      <div className="mx-auto flex h-16 max-w-5xl items-center gap-2 px-4">
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
          onClick={() => setPanel((value) => (value === "search" ? null : "search"))}
          aria-expanded={panel === "search"}
          aria-controls="recherche"
          aria-label={hasQuery ? `Rechercher, recherche en cours : ${query.trim()}` : "Rechercher"}
          className={ICON_BUTTON}
        >
          <SearchIcon open={panel === "search"} className="size-5" />
          {/* Pastille : une recherche filtre la carte même panneau fermé. */}
          {hasQuery && panel !== "search" ? (
            <span aria-hidden className="absolute right-0.5 top-0.5 size-3 rounded-full border-2 border-ink bg-red-text" />
          ) : null}
        </button>

        <button
          ref={menuToggle}
          type="button"
          onClick={() => setPanel((value) => (value === "menu" ? null : "menu"))}
          aria-expanded={panel === "menu"}
          aria-controls="menu-principal"
          aria-label="Menu"
          className={ICON_BUTTON}
        >
          <MenuIcon open={panel === "menu"} className="size-5" />
        </button>
      </div>

      {/*
        Les deux panneaux se superposent à la page au lieu de la pousser :
        les refermer ne décale rien sous le doigt qui vient de toucher ailleurs.
      */}
      <div
        id="recherche"
        hidden={panel !== "search"}
        className="absolute inset-x-0 top-full border-b border-hairline bg-ink shadow-[0_12px_24px_-12px_rgba(0,0,0,0.8)]"
      >
        <form
          role="search"
          onSubmit={submitSearch}
          className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3"
        >
          <label className="flex-1">
            <span className="sr-only">Rechercher un plat ou un ingrédient</span>
            <input
              ref={searchInput}
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                if (event.target.value.trim()) {
                  window.requestAnimationFrame(() => revealResults());
                }
              }}
              placeholder="Chercher : crevettes, chèvre, nutella…"
              enterKeyHint="search"
              autoComplete="off"
              className="w-full rounded-full border border-control bg-surface px-4 py-2.5 text-base text-white placeholder:text-muted focus:border-red sm:text-sm"
            />
          </label>
          {hasQuery ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                searchInput.current?.focus();
              }}
              className="min-h-11 shrink-0 rounded-full px-2 text-sm text-muted underline underline-offset-4 hover:text-white"
            >
              Effacer<span className="sr-only"> la recherche</span>
            </button>
          ) : null}
        </form>
      </div>

      <nav
        id="menu-principal"
        aria-label="Navigation principale"
        hidden={panel !== "menu"}
        className="absolute inset-x-0 top-full border-b border-hairline bg-ink shadow-[0_12px_24px_-12px_rgba(0,0,0,0.8)]"
      >
        <ul className="mx-auto max-w-5xl px-4 py-2">
          {LINKS.map(({ href, label, Icon }) => (
            <li key={href}>
              <a
                href={href}
                onClick={() => setPanel(null)}
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
