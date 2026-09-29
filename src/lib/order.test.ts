import { describe, expect, it } from "vitest";
import { buildOrderMessage, cartCount, cartTotal, whatsappUrl } from "@/lib/order";
import { menuIndex } from "@/data/menu";
import { site } from "@/data/site";

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

describe("message WhatsApp", () => {
  it("propose un message simple quand le panier est vide", () => {
    expect(buildOrderMessage([])).toBe(`Bonjour ${site.name}, je voudrais passer une commande.`);
  });

  it("liste les plats et le total", () => {
    const message = buildOrderMessage([{ id: pizza.id, quantity: 2 }]);
    expect(message).toContain(`• 2 × ${pizza.name}`);
    expect(message).toContain("Total indicatif");
  });

  it("encode le message dans l'URL wa.me", () => {
    const url = new URL(whatsappUrl([{ id: pizza.id, quantity: 1 }]));
    expect(url.origin + url.pathname).toBe(`https://wa.me/${site.whatsapp}`);
    expect(url.searchParams.get("text")).toBe(buildOrderMessage([{ id: pizza.id, quantity: 1 }]));
  });
});
