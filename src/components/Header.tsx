"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/data/site";
import {
  ClockIcon,
  MenuIcon,
  PhoneIcon,
  PinIcon,
  PizzaIcon,
  SearchIcon,
} from "@/components/icons";
import { SearchDialog } from "@/components/SearchDialog";

const LINKS = [
  { href: "#carte", label: "La carte", Icon: PizzaIcon },
  { href: "#horaires", label: "Horaires", Icon: ClockIcon },
  { href: "#adresse", label: "Adresse", Icon: PinIcon },
];

const ICON_BUTTON =
  "relative flex size-11 shrink-0 items-center justify-center rounded-full border border-control text-white transition-colors hover:border-red";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const menuToggle = useRef<HTMLButtonElement>(null);

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
          type="button"
          onClick={() => setSearchOpen(true)}
          aria-haspopup="dialog"
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

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
