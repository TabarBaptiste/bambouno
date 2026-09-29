import { site } from "@/data/site";
import { PhoneIcon } from "@/components/icons";

const NAV_LINKS = [
  { href: "#carte", label: "Carte" },
  { href: "#pizzas-tomate", label: "Pizzas" },
  { href: "#crepes-salees", label: "Crêpes" },
  { href: "#boissons", label: "Boissons" },
  { href: "#infos", label: "Infos" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-hairline bg-ink short:static">
      <div className="mx-auto flex h-16 max-w-5xl items-center gap-4 px-4">
        <a href="#top" className="shrink-0" aria-label={`${site.name}, retour en haut de page`}>
          <span className="section-title text-xl sm:text-2xl">
            <span className="text-white">Bambou</span>
            <span className="text-red">no</span>
          </span>
        </a>

        <nav aria-label="Navigation principale" className="hidden min-w-0 flex-1 md:block">
          <ul className="flex items-center gap-1 whitespace-nowrap">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="inline-flex min-h-10 items-center px-2 font-heading text-sm font-semibold uppercase tracking-wide text-muted transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a
          href={`tel:${site.phone}`}
          className="btn-primary ml-auto min-h-10 px-4 py-2 text-sm md:ml-0"
        >
          <PhoneIcon className="size-4" />
          {/* Sur mobile, l'icône seule reste nommée pour les lecteurs d'écran. */}
          <span className="sr-only sm:not-sr-only">Appeler</span>
          <span className="sr-only"> le {site.phoneDisplay}</span>
        </a>
      </div>
    </header>
  );
}
