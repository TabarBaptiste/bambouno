import { OpenBadge } from "@/components/OpenBadge";

/**
 * En-tête court : qui, où, ouvert ou pas. Le client vient pour commander,
 * la carte doit arriver dans le premier écran.
 */
export function Hero() {
  return (
    // Halo rouge diffus (rappelle le four), en dégradé qui s'éteint avant le
    // bas de la section : pas de bord net au-dessus de la carte.
    <section
      id="top"
      aria-labelledby="accroche"
      className="bg-[radial-gradient(ellipse_70%_90%_at_50%_0%,rgba(230,51,41,0.22),transparent_75%)]"
    >
      <div className="mx-auto max-w-5xl px-4 pb-10 pt-8 sm:pb-14 sm:pt-14">
        <OpenBadge />
        <h1
          id="accroche"
          className="section-title mt-4 text-[2.5rem] min-[360px]:text-5xl sm:text-6xl lg:text-7xl"
        >
          <span className="text-white">Pizzas & crêpes</span>
          <br />
          <span className="text-red">au Gros-Morne</span>
        </h1>
      </div>
    </section>
  );
}
