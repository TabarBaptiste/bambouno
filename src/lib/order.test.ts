import { describe, expect, it } from "vitest";
import {
  buildOrderMessage,
  cartCount,
  cartTotal,
  cleanName,
  MAX_NAME_LENGTH,
  orderName,
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

describe("message WhatsApp", () => {
  it("range les plats dans l'ordre de la carte, pas dans l'ordre des ajouts", () => {
    const message = buildOrderMessage([
      { id: "b-coca", quantity: 1 },
      { id: "p-4-fromages", quantity: 1 },
      { id: "f-gros-mornaise", quantity: 1 },
      { id: "p-exotique", quantity: 1 },
    ]);
    expect(message).toContain(
      "• 1 × Pizza 4 Fromages\n• 1 × Pizza Exotique\n• 1 × Friand La Gros-Mornaise\n• 1 × Coca-Cola 50 cl",
    );
  });

  it("propose un message simple quand le panier est vide", () => {
    expect(buildOrderMessage([])).toBe(`Bonjour ${site.name}\n\nJe voudrais passer une commande.`);
  });

  it("se présente avec le prénom, nettoyé", () => {
    const message = buildOrderMessage([{ id: pizza.id, quantity: 1 }], "  Marie   Lou ");
    expect(message.split("\n")[0]).toBe(`Bonjour ${site.name}, c'est Marie Lou`);
  });

  it("borne la longueur du prénom", () => {
    expect(cleanName("a".repeat(100))).toHaveLength(MAX_NAME_LENGTH);
  });

  it("liste les plats, sans aucun prix", () => {
    const message = buildOrderMessage([
      { id: pizza.id, quantity: 2 },
      { id: drink.id, quantity: 1 },
    ]);
    expect(message).toContain(`• 2 × Pizza ${pizza.name}\n• 1 × ${drink.name}`);
    expect(message).not.toMatch(/€|total/i);
  });

  it("encode le message dans l'URL wa.me", () => {
    const lines = [{ id: pizza.id, quantity: 1 }];
    const url = new URL(whatsappUrl(lines, "Léa"));
    expect(url.origin + url.pathname).toBe(`https://wa.me/${site.whatsapp}`);
    expect(url.searchParams.get("text")).toBe(buildOrderMessage(lines, "Léa"));
  });
});
