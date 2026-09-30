import { categoryOf, menu, menuIndex } from "@/data/menu";
import { normalize } from "@/lib/search";
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

/**
 * Nom complet d'un plat : « Pizza sucrée À la banane », « Crêpe salée
 * Crevettes à la crème ». Le type n'est pas répété quand le nom le contient
 * déjà (« Bière Lorraine 25 cl »).
 */
export function orderName(id: string): string {
  const item = menuIndex[id];
  if (!item) return "";
  const label = categoryOf[id]?.orderLabel;
  if (!label || normalize(item.name).startsWith(normalize(label))) return item.name;
  return `${label} ${item.name}`;
}

/** Rang de chaque plat dans la carte (rubrique, puis ordre dans la rubrique). */
const menuRank: Record<string, number> = Object.fromEntries(
  menu.flatMap((category) => category.items).map((item, index) => [item.id, index]),
);

/**
 * Lignes rangées dans l'ordre de la carte : pizzas ensemble, puis friands…,
 * quel que soit l'ordre des ajouts. Plus simple à lire pour le restaurant.
 */
export function sortByMenu(lines: CartLine[]): CartLine[] {
  return [...lines].sort(
    (a, b) => (menuRank[a.id] ?? Infinity) - (menuRank[b.id] ?? Infinity),
  );
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

/** Longueur maximale du prénom : au-delà, c'est une erreur de saisie. */
export const MAX_NAME_LENGTH = 40;

/** Prénom nettoyé : espaces superflus retirés, longueur bornée. */
export function cleanName(name: string): string {
  return name.replace(/\s+/g, " ").trim().slice(0, MAX_NAME_LENGTH);
}

/**
 * Message pré-rempli pour WhatsApp. Le prénom permet au restaurant
 * d'appeler le client au retrait ; l'heure se règle dans la conversation.
 * Pas de prix : c'est le restaurant qui confirme le montant. Liste à plat,
 * dans l'ordre de la carte, chaque plat précédé de son type pour se lire seul.
 */
export function buildOrderMessage(lines: CartLine[], name = ""): string {
  const rows = sortByMenu(lines)
    .map((line) => {
      if (!menuIndex[line.id]) return null;
      return `• ${line.quantity} × ${orderName(line.id)}`;
    })
    .filter(Boolean);

  const firstName = cleanName(name);
  const greeting = firstName
    ? `Bonjour ${site.name}, c'est ${firstName} 👋`
    : `Bonjour ${site.name} 👋`;

  if (rows.length === 0) {
    return `${greeting}\n\nJe voudrais passer une commande.`;
  }

  return [
    greeting,
    "",
    "Je voudrais commander :",
    ...rows,
    "",
    "À quelle heure puis-je venir récupérer ?",
  ].join("\n");
}

export function whatsappUrl(lines: CartLine[], name = ""): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(buildOrderMessage(lines, name))}`;
}
