import { expect, test } from "@playwright/test";

test("le lien d'évitement est le premier arrêt clavier", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Aller au contenu" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page.locator("#contenu")).toBeFocused();
});

test("le bouton d'appel a un nom accessible, même en icône seule", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("banner").getByRole("link", { name: /Appeler le 0696 44 41 22/ }),
  ).toBeVisible();
});

test("composer une commande au clavier et l'envoyer sur WhatsApp", async ({ page }) => {
  await page.goto("/");

  const addButton = page.getByRole("button", { name: "Ajouter 4 Fromages" });
  await addButton.focus();
  await page.keyboard.press("Enter");

  // Le bouton devient « + » sans perdre le focus clavier.
  const plus = page.getByRole("button", { name: "Ajouter un 4 Fromages" }).first();
  await expect(plus).toBeFocused();
  await page.keyboard.press("Enter");

  // L'ajout est annoncé aux lecteurs d'écran.
  await expect(page.getByRole("status").filter({ hasText: "4 Fromages ajouté" })).toHaveText(
    /2 articles/,
  );

  const bar = page.getByRole("region", { name: "Votre sélection" });
  await expect(bar).toBeVisible();
  const order = bar.getByRole("link", { name: /Commander sur WhatsApp/ });
  const href = await order.getAttribute("href");
  const text = new URL(href!).searchParams.get("text");
  expect(text).toContain("2 × 4 Fromages");

  // Retirer la dernière unité rend le focus au bouton d'ajout.
  const minus = page.getByRole("button", { name: "Retirer un 4 Fromages" }).first();
  await minus.click();
  await minus.click();
  await expect(addButton).toBeFocused();
  await expect(bar).toBeHidden();
});

test("la sélection survit au rechargement", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Ajouter Coca-Cola 50 cl" }).click();
  await expect(page.getByRole("region", { name: "Votre sélection" })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("region", { name: "Votre sélection" })).toContainText(
    "1 article",
  );
});

test("la recherche ignore les accents", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("searchbox").fill("chevre");
  await expect(page.getByRole("heading", { name: "4 Fromages" })).toBeVisible();
  await expect(page.getByRole("status").filter({ hasText: /correspond/ })).toBeAttached();
});

test("un lien vers une catégorie filtrée lève les filtres", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Sucré" }).click();
  await expect(page.locator("#boissons")).toHaveCount(0);

  await page
    .getByRole("navigation", { name: "Catégories de la carte" })
    .getByRole("link", { name: "Nos boissons" })
    .click();

  await expect(page.locator("#boissons")).toBeInViewport();
  await expect(page.getByRole("button", { name: "Sucré" })).toHaveAttribute(
    "aria-pressed",
    "false",
  );
});
