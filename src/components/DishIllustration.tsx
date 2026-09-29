import type { DishVisual } from "@/data/menu";

/**
 * Illustrations de repli des vignettes, en attendant les vraies photos du
 * client. Volontairement stylisées : elles ne prétendent pas montrer le plat.
 * Purement décoratives, donc masquées aux lecteurs d'écran.
 */

const CRUST = "#d9a35b";
const TOMATO = "#c8352b";
const CREAM = "#efe3c4";
const CHOCOLATE = "#6b3d24";
const CHEESE = "#f4ecd2";
const BASIL = "#3f8f4e";
const OLIVE = "#4a1f1a";

function Pizza({ sauce, toppings }: { sauce: string; toppings: [string, string, string] }) {
  const [a, b, c] = toppings;
  return (
    <>
      <circle cx="32" cy="32" r="30" fill={CRUST} />
      <circle cx="32" cy="32" r="24" fill={sauce} />
      <circle cx="23" cy="24" r="4.5" fill={a} />
      <circle cx="38" cy="22" r="3.5" fill={a} />
      <circle cx="24" cy="40" r="4" fill={a} />
      <circle cx="34" cy="37" r="3" fill={b} />
      <circle cx="42" cy="34" r="3" fill={c} />
    </>
  );
}

const VISUALS: Record<DishVisual, React.ReactNode> = {
  "pizza-tomate": <Pizza sauce={TOMATO} toppings={[CHEESE, BASIL, OLIVE]} />,
  "pizza-creme": <Pizza sauce={CREAM} toppings={["#f7d67a", BASIL, "#b5652f"]} />,
  "pizza-sucree": <Pizza sauce={CHOCOLATE} toppings={["#f2d25c", "#f7f0e4", "#e0564c"]} />,
  calzone: (
    <>
      <path d="M6 40a26 26 0 0 1 52 0Z" fill={CRUST} />
      <path d="M6 40h52" stroke="#a8743a" strokeWidth="4" strokeLinecap="round" />
      <circle cx="22" cy="28" r="2" fill="#a8743a" />
      <circle cx="34" cy="24" r="2" fill="#a8743a" />
      <circle cx="44" cy="31" r="2" fill="#a8743a" />
    </>
  ),
  friand: (
    <>
      <rect x="8" y="18" width="48" height="28" rx="10" fill={CRUST} />
      <path d="M18 24l6 16M30 24l6 16M42 24l6 16" stroke="#a8743a" strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  "crepe-salee": (
    <>
      <path d="M8 50L32 10l24 40Z" fill="#e2b56e" />
      <path d="M20 38l12-8 12 8" stroke="#b07a3c" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="32" cy="42" r="3.5" fill={BASIL} />
    </>
  ),
  "crepe-sucree": (
    <>
      <path d="M8 50L32 10l24 40Z" fill="#e2b56e" />
      <path d="M17 42c6-6 9 2 15-4s9 2 15-4" stroke={CHOCOLATE} strokeWidth="4" fill="none" strokeLinecap="round" />
    </>
  ),
  boisson: (
    <>
      <path d="M18 14h28l-4 40H22Z" fill="#6fb18a" />
      <path d="M20 24h24" stroke="#ffffff" strokeOpacity=".5" strokeWidth="3" />
      <path d="M36 14l6-8" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  biere: (
    <>
      <rect x="14" y="18" width="28" height="36" rx="4" fill="#e7a93a" />
      <path d="M42 26h6a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4h-6" stroke="#e7a93a" strokeWidth="4" fill="none" />
      <path d="M12 20a6 6 0 0 1 6-8h20a6 6 0 0 1 6 8Z" fill="#fbf4e2" />
    </>
  ),
};

export function DishIllustration({
  visual,
  className = "",
}: {
  visual: DishVisual;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden focusable="false" className={className}>
      {VISUALS[visual]}
    </svg>
  );
}
