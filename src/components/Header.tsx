import { menu } from "@/data/menu";
import { site } from "@/data/site";
import { PhoneIcon } from "@/components/icons";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-hairline bg-ink/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center gap-4 px-4">
        <a href="#top" className="shrink-0">
          <span className="section-title text-xl sm:text-2xl">
            <span className="text-white">Bambou</span>
            <span className="text-red">no</span>
          </span>
        </a>

        <nav
          aria-label="Sections de la carte"
          className="hidden min-w-0 flex-1 overflow-x-auto md:block"
        >
          <ul className="flex items-center gap-4 whitespace-nowrap">
            {menu.slice(0, 4).map((category) => (
              <li key={category.id}>
                <a
                  href={`#${category.id}`}
                  className="font-heading text-sm font-semibold uppercase tracking-wide text-muted transition-colors hover:text-white"
                >
                  {category.titleAccent}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#infos"
                className="font-heading text-sm font-semibold uppercase tracking-wide text-muted transition-colors hover:text-white"
              >
                Infos
              </a>
            </li>
          </ul>
        </nav>

        <a
          href={`tel:${site.phone}`}
          className="btn-primary ml-auto px-4 py-2 text-sm md:ml-0"
        >
          <PhoneIcon className="size-4" />
          <span className="hidden sm:inline">Appeler</span>
        </a>
      </div>
    </header>
  );
}
