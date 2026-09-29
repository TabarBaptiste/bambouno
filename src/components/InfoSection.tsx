import { site } from "@/data/site";
import { HoursTable } from "@/components/HoursTable";
import { NewTabHint } from "@/components/NewTabHint";
import { OpenBadge } from "@/components/OpenBadge";
import { SectionTitle } from "@/components/SectionTitle";
import { ClockIcon, PhoneIcon, PinIcon } from "@/components/icons";

export function InfoSection() {
  return (
    <section id="infos" aria-labelledby="infos-titre" className="border-t border-hairline py-16">
      <div className="mx-auto max-w-5xl px-4">
        <SectionTitle id="infos-titre" prefix="Nous" accent="trouver" />

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
              <NewTabHint />
            </a>
          </div>

          <div className="rounded-card border border-hairline bg-surface p-5">
            <h3 className="flex items-center gap-2 font-heading text-lg font-semibold uppercase">
              <PhoneIcon className="size-5 text-red" />
              Une question ?
            </h3>
            <a href={`tel:${site.phone}`} className="btn-ghost mt-4 w-full text-sm">
              <PhoneIcon className="size-4" />
              <span className="sr-only">Appeler le </span>
              {site.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
