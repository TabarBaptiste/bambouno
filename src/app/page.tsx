import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { InfoSection } from "@/components/InfoSection";
import { JsonLd } from "@/components/JsonLd";
import { MenuBrowser } from "@/components/MenuBrowser";
import { MenuNav } from "@/components/MenuNav";
import { OrderBar } from "@/components/OrderBar";
import { OrderProvider } from "@/components/OrderProvider";
import { SectionTitle } from "@/components/SectionTitle";

/**
 * Page unique : la carte tient dans un seul défilement, avec ancres.
 * Sur ce type de commerce, chaque navigation supplémentaire perd un client.
 */
export default function HomePage() {
  return (
    <OrderProvider>
      <JsonLd />
      <Header />
      {/* tabIndex -1 : cible focalisable du lien d'évitement. */}
      <main id="contenu" tabIndex={-1} className="outline-none">
        <Hero />

        <section id="carte" aria-labelledby="carte-titre" tabIndex={-1} className="outline-none">
          {/*
            MenuBrowser gère lui-même ses largeurs : sa barre de filtres collante
            doit être pleine largeur, elle ne peut pas vivre dans ce conteneur.
          */}
          <div className="mx-auto max-w-5xl px-4">
            <SectionTitle
              id="carte-titre"
              prefix="Notre"
              accent="carte"
              subtitle="Ajoutez vos plats, puis envoyez la sélection sur WhatsApp."
            />
            <MenuNav />
          </div>
          <MenuBrowser />
        </section>

        <InfoSection />
      </main>
      <Footer />
      <OrderBar />
    </OrderProvider>
  );
}
