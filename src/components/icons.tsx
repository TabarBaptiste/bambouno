/** Icônes inline : pas de dépendance, pas de requête réseau. */

type IconProps = { className?: string };

export function WhatsAppIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" fillRule="evenodd" aria-hidden className={className}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.02h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.19-.31a8.22 8.22 0 0 1-1.26-4.35c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.26.86 5.81 2.42a8.16 8.16 0 0 1 2.41 5.82c0 4.54-3.7 8.2-8.24 8.2Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07 0 1.23.89 2.41 1.02 2.58.12.16 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.19.21-.58.21-1.08.15-1.19-.06-.1-.23-.17-.48-.29Z" />
    </svg>
  );
}

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
