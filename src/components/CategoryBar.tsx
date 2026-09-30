"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { shortTitle, type MenuCategory } from "@/data/menu";

/**
 * Ligne (en px depuis le haut de la fenêtre) à partir de laquelle une
 * rubrique est « en cours » : sous le header (64) et cette barre (~57).
 */
const CURRENT_LINE = 160;

/** Durée pendant laquelle un clic sur une puce garde la main sur le suivi. */
const CLICK_LOCK_MS = 900;

/**
 * Barre de rubriques collée sous le header. La puce de la rubrique à l'écran
 * est mise en avant et se recentre toute seule : où qu'on soit dans la carte,
 * on saute à une autre rubrique sans remonter en haut de page.
 */
export function CategoryBar({ categories }: { categories: MenuCategory[] }) {
  const [active, setActive] = useState<string | null>(null);
  const list = useRef<HTMLUListElement>(null);
  const lockedUntil = useRef(0);
  const ids = categories.map((category) => category.id).join(",");

  const findCurrent = useCallback(() => {
    let current: string | null = null;
    for (const id of ids.split(",")) {
      const section = document.getElementById(id);
      if (!section) continue;
      if (section.getBoundingClientRect().top <= CURRENT_LINE) current = id;
      else break;
    }
    return current;
  }, [ids]);

  // Suit le défilement de la page (une évaluation par image au maximum).
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      if (Date.now() < lockedUntil.current) return;
      setActive(findCurrent());
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [findCurrent]);

  // Recentre la puce active dans la barre, sans jamais faire défiler la page.
  useEffect(() => {
    const scroller = list.current;
    const chip = active ? scroller?.querySelector<HTMLElement>(`[data-rubrique="${active}"]`) : null;
    if (!scroller || !chip) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    scroller.scrollTo({
      left: chip.offsetLeft - (scroller.clientWidth - chip.offsetWidth) / 2,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [active]);

  const choose = (id: string) => {
    // Le défilement de la page traverse les rubriques intermédiaires : on fige
    // la puce choisie le temps du trajet, puis on la recale sur la réalité.
    setActive(id);
    lockedUntil.current = Date.now() + CLICK_LOCK_MS;
    window.setTimeout(() => setActive(findCurrent()), CLICK_LOCK_MS + 50);
  };

  const chip =
    "inline-flex min-h-10 items-center whitespace-nowrap rounded-full border px-3.5 font-heading text-sm font-semibold uppercase tracking-wide transition-colors";

  return (
    <div className="sticky top-16 z-20 border-b border-hairline bg-ink short:static">
      <nav aria-label="Aller à une rubrique" className="mx-auto max-w-5xl">
        <ul
          ref={list}
          className="flex gap-2 overflow-x-auto px-4 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {categories.map((category) => (
            <li key={category.id} className="shrink-0">
              <a
                href={`#${category.id}`}
                data-rubrique={category.id}
                aria-current={active === category.id ? "true" : undefined}
                onClick={() => choose(category.id)}
                className={`${chip} ${
                  active === category.id
                    ? "border-red-cta bg-red-cta text-white"
                    : "border-control text-white hover:border-red"
                }`}
              >
                {shortTitle(category)}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
