import { formatPrice, menuIndex } from "@/data/menu";
import { site } from "@/data/site";

export type CartLine = { id: string; quantity: number };

/** Ne garde que des lignes qui existent encore à la carte et des quantités saines. */
export function sanitize(value: unknown): CartLine[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    if (typeof entry !== "object" || entry === null) return [];
    const { id, quantity } = entry as Partial<CartLine>;
    if (typeof id !== "string" || !menuIndex[id]) return [];
    if (typeof quantity !== "number" || !Number.isFinite(quantity)) return [];
    const clamped = Math.min(Math.max(Math.floor(quantity), 1), 99);
    return [{ id, quantity: clamped }];
  });
}

export function cartTotal(lines: CartLine[]): number {
  return lines.reduce((sum, line) => {
    const item = menuIndex[line.id];
    return item ? sum + item.price * line.quantity : sum;
  }, 0);
}

export function cartCount(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}

/**
 * Message pré-rempli pour WhatsApp. Le client n'a plus qu'à envoyer, puis à
 * préciser son prénom et son heure de retrait — volontairement pas de champ
 * formulaire, la conversation fait le reste.
 */
export function buildOrderMessage(lines: CartLine[]): string {
  const rows = lines
    .map((line) => {
      const item = menuIndex[line.id];
      if (!item) return null;
      return `• ${line.quantity} × ${item.name} — ${formatPrice(item.price * line.quantity)}`;
    })
    .filter(Boolean);

  if (rows.length === 0) {
    return `Bonjour ${site.name}, je voudrais passer une commande.`;
  }

  return [
    `Bonjour ${site.name} 👋`,
    "",
    "Je voudrais commander :",
    ...rows,
    "",
    `Total indicatif : ${formatPrice(cartTotal(lines))}`,
    "",
    "À quelle heure puis-je venir récupérer ?",
  ].join("\n");
}

export function whatsappUrl(lines: CartLine[]): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(buildOrderMessage(lines))}`;
}
