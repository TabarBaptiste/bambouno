import { menu } from "@/data/menu";

/**
 * Sommaire de la carte. Sur mobile, le header n'a pas la place d'une
 * navigation : ce bandeau défilant horizontalement est le seul raccourci vers
 * les crêpes ou les boissons, tout en bas d'une longue page.
 */
export function MenuNav() {
  return (
    <nav aria-label="Catégories de la carte" className="mt-6">
      <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
        {menu.map((category) => (
          <li key={category.id} className="shrink-0">
            <a
              href={`#${category.id}`}
              className="inline-flex min-h-10 items-center rounded-full border border-hairline bg-surface px-3.5 font-heading text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:border-red"
            >
              {category.titlePrefix} {category.titleAccent}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
