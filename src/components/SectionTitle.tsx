/**
 * Titre de section reprenant la signature du menu papier : mot en blanc,
 * mot-clé en rouge, filet blanc de 2px calé sur la largeur du texte.
 *
 * `level` ne change que la sémantique : le visuel reste identique, mais le
 * plan du document lu par les lecteurs d'écran reste cohérent (h2 > h3).
 */
export function SectionTitle({
  id,
  prefix,
  accent,
  subtitle,
  level = 2,
  align = "left",
}: {
  id?: string;
  prefix: string;
  accent: string;
  subtitle?: string;
  level?: 2 | 3;
  align?: "left" | "center";
}) {
  const Heading = level === 2 ? "h2" : "h3";
  return (
    <header className={align === "center" ? "text-center" : ""}>
      <Heading id={id} className="section-title inline-block text-3xl sm:text-4xl lg:text-5xl">
        <span className="text-white">{prefix} </span>
        <span className="text-red">{accent}</span>
        <span aria-hidden className="mt-2 block h-[2px] w-full bg-white" />
      </Heading>
      {subtitle ? (
        <p
          className={`mt-3 max-w-xl text-sm text-muted ${align === "center" ? "mx-auto" : ""}`}
        >
          {subtitle}
        </p>
      ) : null}
    </header>
  );
}
