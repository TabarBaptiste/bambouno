import { describe, expect, it } from "vitest";
import {
  buildOrderMessage,
  cartCount,
  cartTotal,
  cleanName,
  MAX_NAME_LENGTH,
  whatsappUrl,
} from "@/lib/order";
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
    expect(buildOrderMessage([])).toBe(`Bonjour ${site.name} 👋\n\nJe voudrais passer une commande.`);
  });

  it("se présente avec le prénom, nettoyé", () => {
    const message = buildOrderMessage([{ id: pizza.id, quantity: 1 }], "  Marie   Lou ");
    expect(message.split("\n")[0]).toBe(`Bonjour ${site.name}, c'est Marie Lou 👋`);
  });

  it("borne la longueur du prénom", () => {
    expect(cleanName("a".repeat(100))).toHaveLength(MAX_NAME_LENGTH);
  });

  it("liste les plats et le total", () => {
    const message = buildOrderMessage([{ id: pizza.id, quantity: 2 }]);
    expect(message).toContain(`• 2 × ${pizza.name}`);
    expect(message).toContain("Total :");
  });

  it("encode le message dans l'URL wa.me", () => {
    const lines = [{ id: pizza.id, quantity: 1 }];
    const url = new URL(whatsappUrl(lines, "Léa"));
    expect(url.origin + url.pathname).toBe(`https://wa.me/${site.whatsapp}`);
    expect(url.searchParams.get("text")).toBe(buildOrderMessage(lines, "Léa"));
  });
});
