import { expect, test } from "@playwright/test";

test.beforeEach(async ({ context }) => {
  // Pas de vraie sortie vers WhatsApp pendant les tests.
  await context.route("https://wa.me/**", (route) =>
    route.fulfill({ contentType: "text/html", body: "<title>WhatsApp</title>" }),
  );
});

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

test("composer une commande au clavier, avec prénom, jusqu'à WhatsApp", async ({ page }) => {
  await page.goto("/");

  const add = page.getByRole("button", { name: "Ajouter 4 Fromages" });
  await add.focus();
  await page.keyboard.press("Enter");
  // Le « + » ne change pas de nœud : le focus reste en place.
  await expect(add).toBeFocused();
  await page.keyboard.press("Enter");

  // L'ajout est annoncé aux lecteurs d'écran.
  await expect(page.getByRole("status").filter({ hasText: "4 Fromages ajouté" })).toHaveText(
    /2 articles/,
  );

  // Rien ne part vers WhatsApp sans passer par le panier.
  const openCart = page.getByRole("button", { name: /Voir le panier/ });
  await expect(openCart).toContainText("2 articles");
  await openCart.click();

  const cart = page.getByRole("dialog", { name: "Votre panier" });
  await expect(cart).toBeVisible();

  // Modifier dans le panier.
  await cart.getByRole("button", { name: "Retirer 4 Fromages" }).click();
  await expect(cart.getByText("Quantité : 1")).toBeAttached();

  // Le prénom est obligatoire.
  const submit = cart.getByRole("button", { name: /Commander sur WhatsApp/ });
  await submit.click();
  const firstName = cart.getByRole("textbox", { name: "Votre prénom" });
  await expect(firstName).toBeFocused();
  await expect(firstName).toHaveAttribute("aria-invalid", "true");

  await firstName.fill("Léa");
  const popupPromise = page.waitForEvent("popup");
  await submit.click();
  const popup = await popupPromise;
  const text = new URL(popup.url()).searchParams.get("text");
  expect(text).toContain("c'est Léa");
  expect(text).toContain("1 × 4 Fromages");
  await expect(cart).toBeHidden();
});

test("Échap ferme le panier et rend le focus au bouton", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Ajouter 4 Fromages" }).click();
  const openCart = page.getByRole("button", { name: /Voir le panier/ });
  await openCart.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(openCart).toBeFocused();
});

test("retirer la dernière unité rend le focus au bouton d'ajout", async ({ page }) => {
  await page.goto("/");
  const add = page.getByRole("button", { name: "Ajouter 4 Fromages" });
  await add.click();
  await page.getByRole("button", { name: "Retirer 4 Fromages" }).click();
  await expect(add).toBeFocused();
  await expect(page.locator("#order-bar")).toBeHidden();
});

test("le panier et le prénom survivent au rechargement", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Ajouter Coca-Cola 50 cl" }).click();
  await page.getByRole("button", { name: /Voir le panier/ }).click();
  await page.getByRole("textbox", { name: "Votre prénom" }).fill("Marc");
  await page.reload();

  const openCart = page.getByRole("button", { name: /Voir le panier/ });
  await expect(openCart).toContainText("1 article");
  await openCart.click();
  await expect(page.getByRole("textbox", { name: "Votre prénom" })).toHaveValue("Marc");
});

test("la recherche ignore les accents", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("searchbox").fill("chevre");
  await expect(page.getByRole("heading", { name: "4 Fromages" })).toBeVisible();
  await expect(page.getByRole("status").filter({ hasText: /correspond/ })).toBeAttached();
});

test("une rubrique masquée par la recherche réapparaît au clic", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("searchbox").fill("banane");
  await expect(page.locator("#boissons")).toHaveCount(0);

  await page
    .getByRole("navigation", { name: "Rubriques de la carte" })
    .getByRole("link", { name: /Boissons/ })
    .click();

  await expect(page.locator("#boissons")).toBeInViewport();
  await expect(page.getByRole("searchbox")).toHaveValue("");
});
