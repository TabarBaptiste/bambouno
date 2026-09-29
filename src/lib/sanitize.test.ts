import { describe, expect, it } from "vitest";
import { sanitize } from "@/lib/order";

describe("sanitize (panier relu depuis localStorage)", () => {
  it("rejette tout ce qui n'est pas un tableau", () => {
    expect(sanitize(null)).toEqual([]);
    expect(sanitize({ id: "p-4-fromages" })).toEqual([]);
  });

  it("écarte les plats inconnus et les entrées malformées", () => {
    expect(
      sanitize([
        { id: "p-4-fromages", quantity: 2 },
        { id: "plat-supprime", quantity: 1 },
        { id: "b-coca", quantity: "3" },
        { id: "b-coca", quantity: Number.NaN },
        "texte",
      ]),
    ).toEqual([{ id: "p-4-fromages", quantity: 2 }]);
  });

  it("borne les quantités entre 1 et 99", () => {
    expect(
      sanitize([
        { id: "p-4-fromages", quantity: 0 },
        { id: "b-coca", quantity: 1e6 },
        { id: "b-fanta", quantity: 2.7 },
      ]),
    ).toEqual([
      { id: "p-4-fromages", quantity: 1 },
      { id: "b-coca", quantity: 99 },
      { id: "b-fanta", quantity: 2 },
    ]);
  });
});
