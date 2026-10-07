import { site } from "@/data/site";

export function Footer() {
  return (
    <footer className="border-t border-hairline py-10">
      <div className="mx-auto max-w-5xl px-4">
        <p className="section-title text-2xl">
          <span className="text-white">Bambou</span>
          <span className="text-red">no</span>
        </p>
        <p className="mt-2 max-w-md text-sm text-muted">
          Pizzeria à emporter,{" "}
          {site.address.city} - {site.address.region}.
        </p>
        <p className="mt-2 text-sm">
          <a
            href={`tel:${site.phone}`}
            className="text-white underline underline-offset-4 hover:text-red-text"
          >
            {site.phoneDisplay}
          </a>
        </p>
        <p className="mt-6 text-xs text-muted">
          Les allergènes sont communiqués
          sur demande à la commande.
        </p>
      </div>
    </footer>
  );
}
