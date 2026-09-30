import { describe, expect, it } from "vitest";
import { countLabel, formatPrice, menu, menuIndex } from "@/data/menu";

describe("countLabel", () => {
  it("accorde l'unité au nombre", () => {
    expect(countLabel(15, "pizzas")).toBe("15 pizzas");
    expect(countLabel(1, "pizzas")).toBe("1 pizza");
    expect(countLabel(1, "crêpes")).toBe("1 crêpe");
  });
});

// Garde-fous sur les données : la carte est éditée à la main, une faute de
// frappe (id en double, prix oublié) casserait le panier sans bruit.
describe("données de la carte", () => {
  const items = menu.flatMap((category) => category.items);

  it("a des identifiants de plats uniques", () => {
    expect(new Set(items.map((item) => item.id)).size).toBe(items.length);
    expect(Object.keys(menuIndex)).toHaveLength(items.length);
  });

  it("a des identifiants de catégories uniques, utilisables en ancre", () => {
    const ids = menu.map((category) => category.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9-]+$/);
  });

  it("n'a aucune catégorie vide", () => {
    for (const category of menu) expect(category.items.length).toBeGreaterThan(0);
  });

  it("a des prix positifs au centime près", () => {
    for (const item of items) {
      expect(item.price).toBeGreaterThan(0);
      expect(Math.round(item.price * 100)).toBe(item.price * 100);
    }
  });

  it("n'a pas d'espaces parasites dans les noms", () => {
    for (const item of items) expect(item.name).toBe(item.name.trim());
  });
});

describe("formatPrice", () => {
  it("affiche les euros à la française", () => {
    // Intl insère une espace insécable avant le symbole.
    expect(formatPrice(14).replace(/\s/g, " ")).toBe("14 €");
    expect(formatPrice(3.5).replace(/\s/g, " ")).toBe("3,50 €");
  });
});
