import { site } from "@/data/site";
import { OpenBadge } from "@/components/OpenBadge";
import { PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { whatsappUrl } from "@/lib/order";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* Halo rouge diffus : rappelle le four, sans image à télécharger. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-red/20 blur-[120px]"
      />

      <div className="relative mx-auto max-w-5xl px-4 pb-16 pt-14 sm:pt-20">
        <OpenBadge />

        <h1 className="section-title mt-5 text-5xl sm:text-6xl lg:text-7xl">
          <span className="text-white">Pizzas, crêpes</span>
          <br />
          <span className="text-red">&amp; friands</span>
          <br />
          <span className="text-white">à Gros-Morne</span>
        </h1>

        <p className="mt-5 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
          {site.tagline} Vente à emporter, tous les soirs de 17h30 à 22h.{" "}
          <span className="text-mango">{site.creole}</span>
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={whatsappUrl([])}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            <WhatsAppIcon className="size-5" />
            Commander sur WhatsApp
          </a>
          <a href={`tel:${site.phone}`} className="btn-ghost">
            <PhoneIcon className="size-4" />
            {site.phoneDisplay}
          </a>
        </div>

        <p className="mt-6 text-sm text-muted">
          Composez votre commande ci-dessous : le message WhatsApp se remplit tout
          seul.
        </p>
      </div>
    </section>
  );
}
