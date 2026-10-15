import { menu, resolveLine } from "@/data/menu";
import { normalize } from "@/lib/search";

export type CartLine = { id: string; quantity: number };

/** Ne garde que des lignes qui existent encore à la carte et des quantités saines. */
export function sanitize(value: unknown): CartLine[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    if (typeof entry !== "object" || entry === null) return [];
    const { id, quantity } = entry as Partial<CartLine>;
    if (typeof id !== "string" || !resolveLine(id)) return [];
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
  const line = resolveLine(id);
  if (!line) return "";
  const { item, category, extra } = line;
  const label = category.orderLabel;
  const name =
    !label || normalize(item.name).startsWith(normalize(label))
      ? item.name
      : `${label} ${item.name}`;
  return extra ? `${name}, supplément ${extra.name.toLowerCase()}` : name;
}

/** Rang de chaque plat dans la carte (rubrique, puis ordre dans la rubrique). */
const menuRank: Record<string, number> = Object.fromEntries(
  menu.flatMap((category) => category.items).map((item, index) => [item.id, index]),
);

/** Le plat seul d'abord, puis ses versions avec supplément, dans l'ordre de la carte. */
function rankOf(id: string): number {
  const [itemId, extraId] = id.split("+");
  const base = (menuRank[itemId] ?? Infinity) * 10;
  if (!extraId) return base;
  const extras = resolveLine(id)?.category.extras ?? [];
  return base + 1 + extras.findIndex((extra) => extra.id === extraId);
}

/**
 * Lignes rangées dans l'ordre de la carte : pizzas ensemble, puis friands…,
 * quel que soit l'ordre des ajouts. Plus simple à lire pour le restaurant.
 */
export function sortByMenu(lines: CartLine[]): CartLine[] {
  return [...lines].sort(
    (a, b) => rankOf(a.id) - rankOf(b.id),
  );
}

export function cartTotal(lines: CartLine[]): number {
  return lines.reduce((sum, line) => {
    const resolved = resolveLine(line.id);
    if (!resolved) return sum;
    return sum + (resolved.item.price + (resolved.extra?.price ?? 0)) * line.quantity;
  }, 0);
}

export function cartCount(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}
