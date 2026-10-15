/** Icônes inline : pas de dépendance, pas de requête réseau. */

type IconProps = { className?: string };

export function PhoneIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" fillRule="evenodd" aria-hidden className={className}>
      <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2Z" />
    </svg>
  );
}

export function PinIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" fillRule="evenodd" aria-hidden className={className}>
      <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
    </svg>
  );
}

export function ClockIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" fillRule="evenodd" aria-hidden className={className}>
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 10.59V7h-2v6.41l4.3 4.3 1.4-1.42L13 12.59Z" />
    </svg>
  );
}

/*
 * Pictos d'étiquettes, affichés à droite du nom du plat. Contrairement aux
 * icônes ci-dessus, ils portent une information : ils sont donc nommés
 * (role="img" + <title>) plutôt que masqués.
 */

type TagIconProps = { label: string; className?: string };

export function LeafIcon({ label, className }: TagIconProps) {
  return (
    <svg viewBox="0 0 24 24" role="img" fill="currentColor" className={className}>
      <title>{label}</title>
      <path d="M20 3c-9 0-15 4.5-15 11.5 0 1.6.4 3 1 4.2L4 21l1.4 1.4 2.3-2.3c1.2.6 2.6.9 4.3.9C19 21 21 13 20 3Zm-8.3 15.5c-.9 0-1.8-.2-2.6-.5 1.8-2.7 4.3-5.2 7.1-7.1l-.8-1.2c-3 1.9-5.6 4.5-7.6 7.3-.3-.8-.5-1.6-.5-2.5C7.3 9.3 11.8 5.8 18.2 5.1c.4 7.4-1.4 13.4-6.5 13.4Z" />
    </svg>
  );
}

export function FishIcon({ label, className }: TagIconProps) {
  return (
    <svg viewBox="0 0 24 24" role="img" fill="currentColor" className={className}>
      <title>{label}</title>
      <path d="M13 5c-4.2 0-7.4 3-8.6 5L1.5 7.5v9L4.4 14c1.2 2 4.4 5 8.6 5 5.2 0 8.5-4.4 9.5-7-1-2.6-4.3-7-9.5-7Zm3.5 8a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z" />
    </svg>
  );
}

export function ChiliIcon({ label, className }: TagIconProps) {
  return (
    <svg viewBox="0 0 24 24" role="img" fill="currentColor" className={className}>
      <title>{label}</title>
      <path d="M15.6 2.3 14.2 3.7c.5.5.8 1.1.9 1.8-1.4.1-2.6.9-3.2 2.1C10.2 11 7 15.5 2.5 17.5c-.9.4-.7 1.7.2 1.9C11.7 22 20.4 16 20 8.9c-.1-1.4-1-2.5-2.2-3-.1-1.4-.8-2.7-2.2-3.6Z" />
    </svg>
  );
}

/** Burger qui devient une croix à l'ouverture. */
export function MenuIcon({ open, className }: IconProps & { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden className={className}>
      {open ? (
        <path d="M6 6l12 12M18 6 6 18" />
      ) : (
        <path d="M4 7h16M4 12h16M4 17h16" />
      )}
    </svg>
  );
}

export function PizzaIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M3.5 5.5Q12 1 20.5 5.5L19.3 7.7Q12 4 4.7 7.7Z" />
      <path d="M5.6 9.3Q12 6.3 18.4 9.3L12 22Z" />
    </svg>
  );
}

/** Loupe qui devient une croix quand le champ de recherche est ouvert. */
export function SearchIcon({ open, className }: IconProps & { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden className={className}>
      {open ? (
        <path d="M6 6l12 12M18 6 6 18" />
      ) : (
        <>
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4.5 4.5" />
        </>
      )}
    </svg>
  );
}
