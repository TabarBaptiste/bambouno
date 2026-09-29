import { describe, expect, it } from "vitest";
import { formatHour, getOpenState, nowInMartinique } from "@/lib/hours";

// La Martinique est en UTC−4 toute l'année : 18h locale = 22h UTC.
// Le 29 septembre 2026 est un mardi.
const martinique = (isoLocal: string) => new Date(`${isoLocal}-04:00`);

describe("formatHour", () => {
  it("omet les minutes rondes", () => {
    expect(formatHour("22:00")).toBe("22h");
    expect(formatHour("17:30")).toBe("17h30");
    expect(formatHour("09:00")).toBe("9h");
  });
});

describe("nowInMartinique", () => {
  it("calcule le jour et l'heure dans le fuseau du restaurant", () => {
    expect(nowInMartinique(martinique("2026-09-29T18:15:00"))).toEqual({
      day: 2,
      minutes: 18 * 60 + 15,
    });
  });

  it("ne dépend pas du fuseau du visiteur (Paris est déjà le lendemain)", () => {
    // 23h30 en Martinique = 5h30 à Paris le mercredi : on reste mardi.
    expect(nowInMartinique(new Date("2026-09-30T03:30:00Z")).day).toBe(2);
  });

  it("normalise minuit", () => {
    expect(nowInMartinique(martinique("2026-09-29T00:05:00")).minutes).toBe(5);
  });
});

describe("getOpenState", () => {
  it("affiche juste « Ouvert » en plein service", () => {
    expect(getOpenState(martinique("2026-09-29T18:00:00"))).toEqual({
      isOpen: true,
      label: "Ouvert",
    });
  });

  it("précise l'heure de fermeture dans la dernière heure", () => {
    expect(getOpenState(martinique("2026-09-29T21:15:00"))).toEqual({
      isOpen: true,
      label: "Ouvert · ferme à 22h",
    });
  });

  it("annonce l'ouverture dans l'heure qui précède", () => {
    expect(getOpenState(martinique("2026-09-29T16:45:00"))).toEqual({
      isOpen: false,
      label: "Ouvre à 17h30",
    });
  });

  it("affiche juste « Fermé » quand l'ouverture est loin", () => {
    expect(getOpenState(martinique("2026-09-29T12:00:00")).label).toBe("Fermé");
  });

  it("ferme pile à l'heure de fermeture", () => {
    expect(getOpenState(martinique("2026-09-29T22:00:00"))).toEqual({
      isOpen: false,
      label: "Fermé",
    });
  });

  it("suit l'horaire du samedi (23h)", () => {
    expect(getOpenState(martinique("2026-10-03T22:30:00")).label).toBe(
      "Ouvert · ferme à 23h",
    );
  });

  it("reste fermé le dimanche", () => {
    expect(getOpenState(martinique("2026-10-04T17:00:00")).label).toBe("Fermé");
  });
});
