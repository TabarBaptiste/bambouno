"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/data/site";
import { ClockIcon, MenuIcon, PhoneIcon, PinIcon, PizzaIcon } from "@/components/icons";

const LINKS = [
  { href: "#carte", label: "La carte", Icon: PizzaIcon },
  { href: "#horaires", label: "Horaires", Icon: ClockIcon },
  { href: "#adresse", label: "Adresse", Icon: PinIcon },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  // Échap ou clic en dehors referment le menu ; Échap rend le focus au bouton.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggle.current?.focus();
    };
    const onPointer = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <header
      ref={header}
      className="sticky top-0 z-30 border-b border-hairline bg-ink short:static"
    >
      <div className="mx-auto flex h-16 max-w-5xl items-center gap-3 px-4">
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
          ref={toggle}
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="menu-principal"
          aria-label="Menu"
          className="flex size-11 items-center justify-center rounded-full border border-control text-white transition-colors hover:border-red"
        >
          <MenuIcon open={open} className="size-5" />
        </button>
      </div>

      <nav
        id="menu-principal"
        aria-label="Navigation principale"
        hidden={!open}
        className="border-t border-hairline bg-ink"
      >
        <ul className="mx-auto max-w-5xl px-4 py-2">
          {LINKS.map(({ href, label, Icon }) => (
            <li key={href}>
              <a
                href={href}
                onClick={() => setOpen(false)}
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
