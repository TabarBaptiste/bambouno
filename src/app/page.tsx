import { CategoryGrid } from "@/components/CategoryGrid";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { InfoSection } from "@/components/InfoSection";
import { JsonLd } from "@/components/JsonLd";
import { MenuBrowser } from "@/components/MenuBrowser";
import { OrderBar } from "@/components/OrderBar";
import { OrderProvider } from "@/components/OrderProvider";
import { SearchProvider } from "@/components/SearchProvider";
import { SectionTitle } from "@/components/SectionTitle";
import { menu } from "@/data/menu";

/**
 * Page unique : la carte tient dans un seul défilement, avec ancres.
 * Sur ce type de commerce, chaque navigation supplémentaire perd un client.
 */
export default function HomePage() {
  return (
    <OrderProvider>
      <SearchProvider>
        <JsonLd />
        <Header />
        {/* tabIndex -1 : cible focalisable du lien d'évitement. */}
        <main id="contenu" tabIndex={-1} className="outline-none">
          <div data-hors-recherche>
            <Hero />
          </div>

          <section id="carte" aria-labelledby="carte-titre" tabIndex={-1} className="outline-none">
            {/*
              MenuBrowser gère lui-même ses largeurs : sa barre de rubriques
              collante doit être pleine largeur, elle ne peut pas vivre ici.
            */}
            <div data-hors-recherche className="mx-auto max-w-5xl px-4">
              <div className="flex items-baseline justify-between gap-4">
                <SectionTitle id="carte-titre" prefix="La" accent="carte" />
                <p className="shrink-0 text-sm text-muted">{menu.length} rubriques</p>
              </div>
              <CategoryGrid />
            </div>
            <MenuBrowser />
          </section>

          <div data-hors-recherche>
            <InfoSection />
          </div>
        </main>
        <div data-hors-recherche>
          <Footer />
        </div>
        <OrderBar />
      </SearchProvider>
    </OrderProvider>
  );
}
