import { site } from "@/data/site";
import { HoursTable } from "@/components/HoursTable";
import { MapEmbed } from "@/components/MapEmbed";
import { NewTabHint } from "@/components/NewTabHint";
import { OpenBadge } from "@/components/OpenBadge";
import { SectionTitle } from "@/components/SectionTitle";
import { ClockIcon, PhoneIcon, PinIcon } from "@/components/icons";

export function InfoSection() {
  return (
    <section id="infos" aria-labelledby="infos-titre" className="border-t border-hairline py-16">
      <div className="mx-auto max-w-5xl px-4">
        <SectionTitle id="infos-titre" prefix="Nous" accent="trouver" />

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div
            id="horaires"
            tabIndex={-1}
            className="rounded-card border border-hairline bg-surface p-5 outline-none"
          >
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
            <a href={`tel:${site.phone}`} className="btn-ghost mt-5 w-full text-sm">
              <PhoneIcon className="size-4" />
              <span className="sr-only">Appeler le </span>
              {site.phoneDisplay}
            </a>
          </div>

          <div
            id="adresse"
            tabIndex={-1}
            className="rounded-card border border-hairline bg-surface p-5 outline-none"
          >
            <h3 className="flex items-center gap-2 font-heading text-lg font-semibold uppercase">
              <PinIcon className="size-5 text-red" />
              Adresse
            </h3>
            <address className="mt-3 not-italic text-sm leading-relaxed text-muted">
              {site.address.street}, {site.address.postalCode} {site.address.city},{" "}
              {site.address.region}
            </address>
            <p className="mt-1 text-sm text-mango">{site.serviceType} uniquement</p>
            <div className="mt-4">
              <MapEmbed />
            </div>
            <a
              href={site.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-4 w-full text-sm"
            >
              Itinéraire
              <NewTabHint />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
