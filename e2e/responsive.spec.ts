import { expect, test } from "@playwright/test";

// WCAG 1.4.10 : contenu lisible sans défilement horizontal à 320 px de large
// (équivalent d'un zoom à 400 % sur un écran de 1280 px).
for (const width of [320, 375, 768, 1280]) {
  test(`pas de défilement horizontal à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/");
    await page.getByRole("button", { name: "Ajouter 4 Fromages" }).click();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

test("zoom 400 % : le header ne reste pas collé sur un écran très bas", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 256 });
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, 1500));
  const header = page.getByRole("banner").first();
  await expect(header).not.toBeInViewport();
});

test("le texte reste lisible avec espacement augmenté (WCAG 1.4.12)", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/");
  await page.addStyleTag({
    content:
      "* { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; } p { margin-bottom: 2em !important; }",
  });
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});
