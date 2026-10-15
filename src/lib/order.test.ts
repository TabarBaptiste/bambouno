import { describe, expect, it } from "vitest";
import { cartCount, cartTotal, orderName, sanitize, sortByMenu } from "@/lib/order";
import { menuIndex } from "@/data/menu";

const pizza = menuIndex["p-4-fromages"];
const drink = menuIndex["b-coca"];

describe("panier", () => {
  it("additionne quantités et prix, en ignorant les plats retirés de la carte", () => {
    const lines = [
      { id: pizza.id, quantity: 2 },
      { id: drink.id, quantity: 1 },
      { id: "plat-supprime", quantity: 3 },
    ];
    expect(cartTotal(lines)).toBeCloseTo(pizza.price * 2 + drink.price);
    expect(cartCount(lines)).toBe(6);
  });
});

describe("orderName", () => {
  it("précise ce qu'est le plat", () => {
    expect(orderName("p-exotique")).toBe("Pizza Exotique");
    expect(orderName("ps-banane")).toBe("Pizza sucrée À la banane");
    expect(orderName("cu-banane")).toBe("Crêpe sucrée Banane");
  });

  it("ne répète pas le type quand le nom le contient déjà", () => {
    expect(orderName("bi-lorraine")).toBe("Bière Lorraine 25 cl");
  });

  it("laisse le nom seul quand la rubrique n'a pas de libellé (boissons)", () => {
    expect(orderName("b-coca")).toBe("Coca-Cola 50 cl");
  });

  it("renvoie une chaîne vide pour un plat retiré de la carte", () => {
    expect(orderName("plat-supprime")).toBe("");
  });
});

describe("sortByMenu", () => {
  it("range les plats dans l'ordre de la carte, pas dans l'ordre des ajouts", () => {
    const ids = sortByMenu([
      { id: "b-coca", quantity: 1 },
      { id: "p-4-fromages", quantity: 1 },
      { id: "f-gros-mornaise", quantity: 1 },
      { id: "p-exotique", quantity: 1 },
    ]).map((line) => line.id);
    expect(ids).toEqual(["p-4-fromages", "p-exotique", "f-gros-mornaise", "b-coca"]);
  });
});

describe("suppléments des crêpes sucrées", () => {
  const caramel = "cu-nutella+x-caramel-liquide";

  it("ajoute le supplément au nom et au prix de la ligne", () => {
    expect(orderName(caramel)).toBe("Crêpe sucrée Nutella, supplément caramel liquide");
    expect(cartTotal([{ id: caramel, quantity: 2 }])).toBeCloseTo((4 + 0.5) * 2);
  });

  it("garde le plat seul avant sa version avec supplément", () => {
    const ids = sortByMenu([
      { id: caramel, quantity: 1 },
      { id: "cu-nutella", quantity: 2 },
    ]).map((line) => line.id);
    expect(ids).toEqual(["cu-nutella", caramel]);
  });

  it("refuse un supplément inconnu ou sur une rubrique qui n'en propose pas", () => {
    expect(sanitize([{ id: "cu-nutella+x-inconnu", quantity: 1 }])).toEqual([]);
    expect(sanitize([{ id: "p-4-fromages+x-caramel-liquide", quantity: 1 }])).toEqual([]);
  });
});
