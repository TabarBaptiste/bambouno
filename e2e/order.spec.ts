import { expect, test } from "@playwright/test";
import { fixerHeure, MARTINIQUE } from "./horloge";

test.beforeEach(async ({ page }) => {
  // Ouvert par défaut : les parcours de commande ne dépendent pas de l'heure réelle.
  await fixerHeure(page, MARTINIQUE.ouvert);
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

test("composer une commande au clavier, jusqu'au bouton d'appel", async ({ page }) => {
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

  // Aucun appel ne se lance sans passer par le panier.
  const openCart = page.getByRole("button", { name: /Voir le panier/ });
  await expect(openCart).toContainText("2 articles");
  await openCart.click();

  const cart = page.getByRole("dialog", { name: "Votre panier" });
  await expect(cart).toBeVisible();

  // Modifier dans le panier.
  await cart.getByRole("button", { name: "Retirer Pizza 4 Fromages" }).click();
  await expect(cart.getByText("Quantité : 1")).toBeAttached();

  // Le restaurant prend les commandes par téléphone : le bouton lance l'appel.
  const call = cart.getByRole("link", { name: /Appeler pour commander/ });
  await expect(call).toHaveAttribute("href", "tel:+596696444122");
  await expect(call).toHaveAccessibleName(/0696 44 41 22/);
  await expect(cart.getByText("Quantité : 1")).toBeAttached();
  await expect(cart.getByRole("textbox")).toHaveCount(0);
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

test("le panier survit au rechargement", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Ajouter Coca-Cola 50 cl" }).click();
  await page.reload();

  const openCart = page.getByRole("button", { name: /Voir le panier/ });
  await expect(openCart).toContainText("1 article");
});

test("le panier dit ce qu'est chaque plat, à plat, dans l'ordre de la carte", async ({ page }) => {
  await page.goto("/");
  for (const name of ["Ajouter Exotique", "Ajouter À la banane", "Ajouter Crevettes à la crème"]) {
    await page.getByRole("button", { name }).click();
  }
  await page.getByRole("button", { name: /Voir le panier/ }).click();
  const cart = page.getByRole("dialog", { name: "Votre panier" });
  await expect(cart).toContainText("Pizza sucrée À la banane");
  await expect(cart).toContainText("Pizza pêcheur Crevettes à la crème");
  const names = await cart.locator("li p:first-child").allTextContents();
  expect(names).toEqual([
    "Pizza Exotique",
    "Pizza pêcheur Crevettes à la crème",
    "Pizza sucrée À la banane",
  ]);
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

test("la recherche remonte en haut, ne montre que la carte et ne bouge plus", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => document.getElementById("friands")?.scrollIntoView({ behavior: "instant" }));
  const reading = await page.evaluate(() => Math.round(window.scrollY));

  await page.getByRole("button", { name: "Rechercher" }).click();
  const input = page.getByRole("searchbox");
  await expect(input).toBeFocused();
  // Header à sa place naturelle, en haut de page : rien à faire défiler au clavier.
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
  await expect(page.getByRole("heading", { level: 1 })).toBeHidden();
  await expect(page.getByRole("navigation", { name: "Rubriques de la carte" })).toBeHidden();

  await input.pressSequentially("banane", { delay: 30 });
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
  await expect(page.getByRole("heading", { name: /À la banane/ })).toBeInViewport();
  await expect(page.locator("#boissons")).toHaveCount(0);

  // On ajoute depuis les résultats : la barre du panier apparaît.
  await page.getByRole("button", { name: "Ajouter À la banane" }).click();
  await expect(page.getByRole("button", { name: /Voir le panier/ })).toBeVisible();

  // Fermer rend la page entière, à l'endroit où on lisait.
  await page.getByRole("button", { name: "Fermer la recherche" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toBeAttached();
  // À quelques pixels près (positions sous-pixel).
  expect(Math.abs((await page.evaluate(() => window.scrollY)) - reading)).toBeLessThan(10);
});

test("valider un champ vide referme la recherche", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Rechercher" }).click();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("searchbox")).toBeHidden();
  await expect(page.getByRole("button", { name: "Rechercher" })).toBeVisible();
});

test("ranger le clavier avec un champ vide referme la recherche", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Rechercher" }).click();
  await page.getByRole("searchbox").blur();
  await expect(page.getByRole("searchbox")).toBeHidden();
});

test("valider une recherche garde les résultats", async ({ page }) => {
  await page.goto("/");
  await search(page, "banane");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("searchbox")).toBeVisible();
  await expect(page.getByRole("searchbox")).not.toBeFocused();
  await expect(page.getByRole("heading", { name: /À la banane/ })).toBeVisible();
});

test("le panier est rangé dans l'ordre de la carte", async ({ page }) => {
  await page.goto("/");
  for (const name of ["Ajouter Coca-Cola 50 cl", "Ajouter La Gros-Mornaise", "Ajouter 4 Fromages"]) {
    await page.getByRole("button", { name }).click();
  }
  await page.getByRole("button", { name: /Voir le panier/ }).click();
  const names = await page
    .getByRole("dialog", { name: "Votre panier" })
    .locator("li p:first-child")
    .allTextContents();
  expect(names).toEqual(["Pizza 4 Fromages", "Friand La Gros-Mornaise", "Coca-Cola 50 cl"]);
});

test("le champ de recherche n'a pas d'anneau jaune", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Rechercher" }).click();
  const input = page.getByRole("searchbox");
  await expect(input).toHaveCSS("outline-style", "none");
  await expect(input).toHaveCSS("border-top-color", "rgb(255, 90, 79)");
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

test.describe("hors des horaires d'ouverture", () => {
  async function ouvrirLePanier(page: import("@playwright/test").Page) {
    await page.goto("/");
    await page.getByRole("button", { name: "Ajouter 4 Fromages" }).click();
    await page.getByRole("button", { name: /Voir le panier/ }).click();
    return page.getByRole("dialog", { name: "Votre panier" });
  }

  test("le panier reste utilisable mais l'appel est désactivé", async ({ page }) => {
    await fixerHeure(page, MARTINIQUE.ferme);
    const cart = await ouvrirLePanier(page);

    // Tout le reste fonctionne : quantités, vider le panier.
    await cart.getByRole("button", { name: "Ajouter Pizza 4 Fromages" }).click();
    await expect(cart.getByText("Quantité : 2")).toBeAttached();

    const call = cart.getByRole("button", { name: /Appeler pour commander/ });
    await expect(call).toHaveAttribute("aria-disabled", "true");
    await expect(call).toBeVisible();
    // Pas de lien d'appel, et l'explication est lue avec le bouton.
    await expect(cart.getByRole("link", { name: /Appeler pour commander/ })).toHaveCount(0);
    await expect(cart.getByRole("status")).toContainText("Fermé • Ouvre à 17h30");
    await expect(call).toHaveAccessibleDescription(/Fermé • Ouvre à 17h30/);
  });

  test("le dimanche, le message annonce le lundi", async ({ page }) => {
    await fixerHeure(page, MARTINIQUE.dimanche);
    const cart = await ouvrirLePanier(page);
    await expect(cart.getByRole("status")).toContainText("Fermé • Ouvre lundi à 17h30");
    await expect(cart.getByRole("button", { name: /Appeler pour commander/ })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  test("dans la dernière heure, on peut encore commander", async ({ page }) => {
    await fixerHeure(page, MARTINIQUE.bientotFerme);
    const cart = await ouvrirLePanier(page);
    await expect(cart.getByRole("link", { name: /Appeler pour commander/ })).toBeVisible();
    await expect(cart.getByRole("status")).toBeEmpty();
  });

  test("l'appel se désactive quand la fermeture tombe pendant que le panier est ouvert", async ({ page }) => {
    await page.clock.install({ time: new Date("2026-09-29T21:59:30-04:00") });
    await page.goto("/");
    await page.getByRole("button", { name: "Ajouter 4 Fromages" }).click();
    await page.getByRole("button", { name: /Voir le panier/ }).click();
    const cart = page.getByRole("dialog", { name: "Votre panier" });
    await expect(cart.getByRole("link", { name: /Appeler pour commander/ })).toBeVisible();

    // 22h00 passées : la minuterie d'une minute recalcule le statut.
    await page.clock.runFor(61_000);
    await expect(cart.getByRole("button", { name: /Appeler pour commander/ })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    await expect(cart.getByRole("status")).toContainText("Fermé");
  });
});

test("la puce active se recale même si le défilement arrive après le verrou du clic", async ({ page }) => {
  // Serveur lent : le trajet fluide n'aboutit qu'après les 900 ms de verrou.
  // Avec l'horloge figée, l'ancien verrou (fondé sur Date.now) ne se libérait jamais.
  await page.goto("/");
  await page.evaluate(() => document.getElementById("pizzas-tomate")?.scrollIntoView({ behavior: "instant" }));
  const bar = page.getByRole("navigation", { name: "Aller à une rubrique" });
  await bar.getByRole("link", { name: "Bières" }).click();
  // On annule le trajet fluide et on laisse passer le verrou avant d'arriver.
  await page.evaluate(() => window.scrollTo({ top: 1500, behavior: "instant" }));
  await page.waitForTimeout(1300);
  await page.evaluate(() => document.getElementById("bieres")?.scrollIntoView({ behavior: "instant" }));
  await expect(page.locator("#bieres")).toBeInViewport();
  await expect(bar.getByRole("link", { name: "Bières" })).toHaveAttribute("aria-current", "true");
});
