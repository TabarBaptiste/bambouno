/**
 * Titre de section reprenant la signature du menu papier : mot en blanc,
 * mot-clé en rouge, filet blanc de 2px calé sur la largeur du texte.
 */
export function SectionTitle({
  prefix,
  accent,
  subtitle,
  align = "left",
}: {
  prefix: string;
  accent: string;
  subtitle?: string;
  align?: "left" | "center";
}) {
  return (
    <header className={align === "center" ? "text-center" : ""}>
      <h2 className="section-title inline-block text-3xl sm:text-4xl lg:text-5xl">
        <span className="text-white">{prefix} </span>
        <span className="text-red">{accent}</span>
        <span className="mt-2 block h-[2px] w-full bg-white" />
      </h2>
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
