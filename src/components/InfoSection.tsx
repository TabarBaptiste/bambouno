import { site } from "@/data/site";
import { HoursTable } from "@/components/HoursTable";
import { OpenBadge } from "@/components/OpenBadge";
import { SectionTitle } from "@/components/SectionTitle";
import { ClockIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "@/components/icons";
import { whatsappUrl } from "@/lib/order";

export function InfoSection() {
  return (
    <section id="infos" className="scroll-mt-40 border-t border-hairline py-16">
      <div className="mx-auto max-w-5xl px-4">
        <SectionTitle prefix="Nous" accent="trouver" />

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-card border border-hairline bg-surface p-5">
            <h3 className="flex items-center gap-2 font-heading text-lg font-semibold uppercase">
              <ClockIcon className="size-5 text-red" />
              Horaires
            </h3>
            <div className="mt-3">
              <OpenBadge />
            </div>
            <div className="mt-4">
              <HoursTable />
            </div>
          </div>

          <div className="rounded-card border border-hairline bg-surface p-5">
            <h3 className="flex items-center gap-2 font-heading text-lg font-semibold uppercase">
              <PinIcon className="size-5 text-red" />
              Adresse
            </h3>
            <address className="mt-3 not-italic text-sm leading-relaxed text-muted">
              {site.address.street}
              <br />
              {site.address.postalCode} {site.address.city}
              <br />
              {site.address.region}
            </address>
            <p className="mt-3 text-sm text-mango">{site.serviceType} uniquement</p>
            <a
              href={site.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost mt-4 w-full text-sm"
            >
              Itinéraire
            </a>
          </div>

          <div className="rounded-card border border-hairline bg-surface p-5">
            <h3 className="flex items-center gap-2 font-heading text-lg font-semibold uppercase">
              <PhoneIcon className="size-5 text-red" />
              Commander
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Choisissez vos plats dans la carte, puis envoyez votre sélection sur
              WhatsApp. On vous confirme l'heure de retrait.
            </p>
            <a
              href={whatsappUrl([])}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-4 w-full text-sm"
            >
              <WhatsAppIcon className="size-5" />
              WhatsApp
            </a>
            <a href={`tel:${site.phone}`} className="btn-ghost mt-2 w-full text-sm">
              <PhoneIcon className="size-4" />
              {site.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
