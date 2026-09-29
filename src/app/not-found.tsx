import Link from "next/link";

export const metadata = { title: "Page introuvable" };

export default function NotFound() {
  return (
    <main id="contenu" className="mx-auto flex min-h-dvh max-w-5xl flex-col justify-center px-4 py-16">
      <h1 className="section-title text-5xl sm:text-6xl">
        <span className="text-white">Page </span>
        <span className="text-red">introuvable</span>
      </h1>
      <p className="mt-5 max-w-lg text-muted">
        Cette page n&apos;existe pas ou plus. La carte, elle, est toujours là.
      </p>
      <Link href="/" className="btn-primary mt-8 self-start">
        Voir la carte
      </Link>
    </main>
  );
}
