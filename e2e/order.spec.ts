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
  await cart.getByRole("button", { name: "Retirer Pizza 4 Fromages" }).click();
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
  expect(text).toContain("1 × Pizza 4 Fromages");
  expect(text).not.toContain("€");
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

test("le message WhatsApp dit ce qu'est chaque plat, à plat, sans prix", async ({ page }) => {
  await page.goto("/");
  for (const name of ["Ajouter Exotique", "Ajouter À la banane", "Ajouter Crevettes à la crème"]) {
    await page.getByRole("button", { name }).click();
  }
  await page.getByRole("button", { name: /Voir le panier/ }).click();
  const cart = page.getByRole("dialog", { name: "Votre panier" });
  // Le panier montre ce qui sera envoyé.
  await expect(cart).toContainText("Pizza sucrée À la banane");
  await expect(cart).toContainText("Pizza pêcheur Crevettes à la crème");

  await cart.getByRole("textbox", { name: "Votre prénom" }).fill("Léa");
  const popupPromise = page.waitForEvent("popup");
  await cart.getByRole("button", { name: /Commander sur WhatsApp/ }).click();
  const text = new URL((await popupPromise).url()).searchParams.get("text");
  expect(text).toContain(
    "• 1 × Pizza Exotique\n• 1 × Pizza sucrée À la banane\n• 1 × Pizza pêcheur Crevettes à la crème",
  );
  expect(text).not.toMatch(/€|total/i);
});

async function search(page: import("@playwright/test").Page, text: string) {
  await page.getByRole("button", { name: "Rechercher" }).click();
  await page.getByRole("searchbox").fill(text);
}

test("la recherche est dans le header et ignore les accents", async ({ page }) => {
  await page.goto("/");
  // Plus de champ de recherche dans la page : il faut ouvrir celui du header.
  await expect(page.getByRole("searchbox")).toBeHidden();
  await page.getByRole("button", { name: "Rechercher" }).click();
  await expect(page.getByRole("searchbox")).toBeFocused();

  await page.getByRole("searchbox").fill("chevre");
  await expect(page.getByRole("heading", { name: "4 Fromages" })).toBeVisible();
  await expect(page.getByRole("status").filter({ hasText: /correspond/ })).toBeAttached();
});

test("la barre de recherche filtre la carte directement, sans faire bouger la page", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Rechercher" }).click();
  const input = page.getByRole("searchbox");
  await expect(input).toBeFocused();

  // La carte est placée sous le header à l'ouverture, puis plus rien ne défile.
  const scrollAtOpen = await page.evaluate(() => window.scrollY);
  await input.pressSequentially("banane", { delay: 30 });
  expect(await page.evaluate(() => window.scrollY)).toBe(scrollAtOpen);

  await expect(input).toBeInViewport();
  await expect(page.getByRole("heading", { name: /À la banane/ })).toBeInViewport();
  await expect(page.locator("#boissons")).toHaveCount(0);

  // On ajoute depuis les résultats : la barre du panier apparaît.
  await page.getByRole("button", { name: "Ajouter À la banane" }).click();
  await expect(page.getByRole("button", { name: /Voir le panier/ })).toBeVisible();
  expect(await page.evaluate(() => window.scrollY)).toBe(scrollAtOpen);
});

test("le champ de recherche n'a pas d'anneau jaune", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Rechercher" }).click();
  const input = page.getByRole("searchbox");
  await expect(input).toHaveCSS("outline-style", "none");
  await expect(input).toHaveCSS("border-top-color", "rgb(255, 90, 79)");
});

test("Fermer vide la recherche et rend toute la carte", async ({ page }) => {
  await page.goto("/");
  await search(page, "banane");
  await expect(page.locator("#boissons")).toHaveCount(0);
  await page.getByRole("button", { name: "Fermer la recherche" }).click();
  await expect(page.getByRole("searchbox")).toBeHidden();
  await expect(page.locator("#boissons")).toBeAttached();
  await expect(page.getByRole("button", { name: "Rechercher" })).toBeFocused();
});

test("une rubrique masquée par la recherche réapparaît au clic", async ({ page }) => {
  await page.goto("/");
  await search(page, "banane");
  await expect(page.locator("#boissons")).toHaveCount(0);
  // Les rubriques du haut de page restent accessibles pendant la recherche.
  await page.evaluate(() => window.scrollTo(0, 0));

  await page
    .getByRole("navigation", { name: "Rubriques de la carte" })
    .getByRole("link", { name: /boissons/i })
    .click();

  await expect(page.locator("#boissons")).toBeInViewport();
  await expect(page.getByRole("searchbox")).toHaveValue("");
});

test("la barre de rubriques suit le défilement et recentre la puce active", async ({ page }) => {
  await page.goto("/");
  const bar = page.getByRole("navigation", { name: "Aller à une rubrique" });

  await page.evaluate(() => document.getElementById("boissons")?.scrollIntoView({ behavior: "instant" }));
  const boissons = bar.getByRole("link", { name: "Boissons" });
  await expect(boissons).toHaveAttribute("aria-current", "true");
  // La barre reste collée sous le header et la puce active est visible dans son défilement.
  await expect(bar).toBeInViewport();
  await expect(boissons).toBeInViewport({ ratio: 0.99 });

  await page.evaluate(() => document.getElementById("friands")?.scrollIntoView({ behavior: "instant" }));
  const friands = bar.getByRole("link", { name: "Friands" });
  await expect(friands).toHaveAttribute("aria-current", "true");
  await expect(boissons).not.toHaveAttribute("aria-current", "true");
  await expect(friands).toBeInViewport({ ratio: 0.99 });
});

test("toucher une puce mène à la rubrique et la met en avant", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => document.getElementById("pizzas-tomate")?.scrollIntoView({ behavior: "instant" }));
  const bar = page.getByRole("navigation", { name: "Aller à une rubrique" });

  await bar.getByRole("link", { name: "Bières" }).click();
  await expect(page.locator("#bieres")).toBeInViewport();
  await expect(bar.getByRole("link", { name: "Bières" })).toHaveAttribute("aria-current", "true");
  // Pas de saut d'une puce à l'autre une fois arrivé.
  await page.waitForTimeout(1200);
  await expect(bar.getByRole("link", { name: "Bières" })).toHaveAttribute("aria-current", "true");
});

test("le menu burger mène aux horaires et à l'adresse", async ({ page }) => {
  await page.goto("/");
  const burger = page.getByRole("button", { name: "Menu" });
  await expect(burger).toHaveAttribute("aria-expanded", "false");
  await burger.click();
  const nav = page.getByRole("navigation", { name: "Navigation principale" });
  await nav.getByRole("link", { name: "Horaires" }).click();
  await expect(nav).toBeHidden();
  await expect(page.locator("#horaires")).toBeInViewport();

  await burger.click();
  await page.keyboard.press("Escape");
  await expect(nav).toBeHidden();
  await expect(burger).toBeFocused();

  await burger.click();
  await nav.getByRole("link", { name: "Adresse" }).click();
  await expect(page.locator("#adresse")).toBeInViewport();
});

test("le plan Google Maps ne se charge qu'à la demande", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("iframe")).toHaveCount(0);
  await page.getByRole("button", { name: "Afficher le plan" }).click();
  await expect(page.locator("iframe[title^='Plan d']")).toHaveAttribute(
    "src",
    /google\.com\/maps/,
  );
});

test("pas d'encadré jaune sur la zone atteinte par un lien d'ancre", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Menu" }).click();
  await page.getByRole("navigation", { name: "Navigation principale" })
    .getByRole("link", { name: "Horaires" })
    .click();
  await expect(page.locator("#horaires")).toBeFocused();
  await expect(page.locator("#horaires")).toHaveCSS("outline-style", "none");

  // Le clavier, lui, garde son anneau sur les vrais arrêts de tabulation.
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Aller au contenu" })).toHaveCSS(
    "outline-style",
    "solid",
  );
});
