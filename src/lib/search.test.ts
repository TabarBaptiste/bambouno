import { describe, expect, it } from "vitest";
import { menu } from "@/data/menu";
import { filterMenu, normalize } from "@/lib/search";

const ids = (result: ReturnType<typeof filterMenu>) =>
  result.flatMap((category) => category.items.map((item) => item.id));

describe("normalize", () => {
  it("retire accents et majuscules", () => {
    expect(normalize("Crème Brûlée")).toBe("creme brulee");
  });
});

describe("filterMenu", () => {
  it("renvoie toute la carte sans critère", () => {
    expect(filterMenu(menu, "  ", [])).toEqual(menu);
  });

  it("trouve un ingrédient sans les accents", () => {
    const withAccent = ids(filterMenu(menu, "chèvre", []));
    expect(withAccent.length).toBeGreaterThan(0);
    expect(ids(filterMenu(menu, "CHEVRE", []))).toEqual(withAccent);
  });

  it("cumule les étiquettes en ET", () => {
    const result = filterMenu(menu, "", ["sucre", "vegetarien"]);
    for (const category of result) {
      for (const item of category.items) {
        expect(item.tags).toEqual(expect.arrayContaining(["sucre", "vegetarien"]));
      }
    }
  });

  it("retire les catégories vides", () => {
    expect(filterMenu(menu, "aucun-plat-ne-contient-ceci", [])).toEqual([]);
  });
});
