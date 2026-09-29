import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

async function expectNoAxeViolations(page: Page, include?: string) {
  const builder = new AxeBuilder({ page }).withTags(WCAG_TAGS);
  if (include) builder.include(include);
  const results = await builder.analyze();
  const summary = results.violations.map(
    (violation) =>
      `${violation.id} (${violation.impact}) : ${violation.help}\n` +
      violation.nodes.map((node) => `  - ${node.target.join(" ")}`).join("\n"),
  );
  expect(summary, summary.join("\n\n")).toEqual([]);
}

test.describe("accessibilité (axe, WCAG 2.2 AA)", () => {
  test("page d'accueil", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expectNoAxeViolations(page);
  });

  test("barre de panier", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Ajouter 4 Fromages" }).click();
    await expect(page.locator("#order-bar")).toBeVisible();
    // Audit limité à la barre : le reste de la page est couvert plus haut, et
    // sa position de défilement ferait varier les cibles recouvertes.
    await expectNoAxeViolations(page, "#order-bar");
  });

  test("panneau du panier, avec l'erreur de prénom", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Ajouter 4 Fromages" }).click();
    await page.getByRole("button", { name: /Voir le panier/ }).click();
    const cart = page.getByRole("dialog", { name: "Votre panier" });
    await cart.getByRole("button", { name: /Commander sur WhatsApp/ }).click();
    await expect(cart.getByText("Indiquez votre prénom")).toBeVisible();
    await expectNoAxeViolations(page, "dialog");
  });

  test("avec une recherche active", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("searchbox").fill("banane");
    await expectNoAxeViolations(page);
  });

  test("page 404", async ({ page }) => {
    const response = await page.goto("/page-inexistante");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "Page introuvable" })).toBeVisible();
    await expectNoAxeViolations(page);
  });
});

test.describe("structure", () => {
  test("un seul h1 et une hiérarchie de titres sans saut", async ({ page }) => {
    await page.goto("/");
    const levels = await page
      .locator("h1, h2, h3, h4, h5, h6")
      .evaluateAll((headings) => headings.map((h) => Number(h.tagName[1])));
    expect(levels.filter((level) => level === 1)).toHaveLength(1);
    for (let i = 1; i < levels.length; i++) {
      expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);
    }
  });

  test("les liens externes signalent le nouvel onglet", async ({ page }) => {
    await page.goto("/");
    const links = page.locator('a[target="_blank"]');
    for (const link of await links.all()) {
      await expect(link).toContainText("nouvel onglet");
      await expect(link).toHaveAttribute("rel", /noopener/);
    }
  });
});
