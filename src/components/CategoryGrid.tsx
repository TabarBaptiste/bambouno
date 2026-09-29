import { menu } from "@/data/menu";
import { DishIllustration } from "@/components/DishIllustration";

/**
 * Sommaire de la carte en cartes, deux par ligne sur mobile : on choisit sa
 * rubrique d'un coup de pouce au lieu de faire défiler toute la carte.
 */
export function CategoryGrid() {
  return (
    <nav aria-label="Rubriques de la carte" className="mb-6 mt-6">
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {menu.map((category) => (
          <li key={category.id}>
            <a
              href={`#${category.id}`}
              className="flex h-full min-h-20 items-center gap-3 rounded-card border border-hairline bg-surface p-3 transition-colors hover:border-red"
            >
              <DishIllustration visual={category.visual} className="size-9 shrink-0 sm:size-11" />
              <span className="min-w-0">
                <span className="block font-heading text-base font-semibold uppercase leading-tight text-white">
                  {category.titlePrefix} {category.titleAccent}
                </span>
                <span className="block text-xs text-muted">
                  {category.items.length} {category.unit}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
