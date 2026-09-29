import type { MenuCategory, MenuItem } from "@/data/menu";

export type MenuTag = NonNullable<MenuItem["tags"]>[number];

/**
 * Minuscules et sans accents : sur un clavier de téléphone, « creme » ou
 * « chevre » doivent trouver « crème » et « chèvre ».
 */
export function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

/**
 * Filtre la carte par texte (nom ou description) et par étiquettes.
 * Les étiquettes se cumulent en ET : « Végé + Sucré » ne renvoie que les
 * plats qui portent les deux. Les catégories vides disparaissent.
 */
export function filterMenu(
  menu: MenuCategory[],
  query: string,
  tags: MenuTag[],
): MenuCategory[] {
  const needle = normalize(query.trim());

  return menu
    .map((category) => ({
      ...category,
      items: category.items.filter((item) => {
        if (!tags.every((tag) => item.tags?.includes(tag))) return false;
        if (!needle) return true;
        return normalize(`${item.name} ${item.description ?? ""}`).includes(needle);
      }),
    }))
    .filter((category) => category.items.length > 0);
}
