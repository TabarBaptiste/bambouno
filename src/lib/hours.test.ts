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
  it("est ouvert pendant le service", () => {
    expect(getOpenState(martinique("2026-09-29T18:00:00"))).toEqual({
      isOpen: true,
      label: "Ouvert jusqu'à 22h",
    });
  });

  it("annonce l'ouverture du jour avant le service", () => {
    const state = getOpenState(martinique("2026-09-29T12:00:00"));
    expect(state.isOpen).toBe(false);
    expect(state.label).toBe("Ouvre à 17h30");
  });

  it("ferme pile à l'heure de fermeture", () => {
    const state = getOpenState(martinique("2026-09-29T22:00:00"));
    expect(state.isOpen).toBe(false);
    expect(state.label).toBe("Fermé - ouvre demain à 17h30");
  });

  it("reste ouvert jusqu'à 23h le samedi", () => {
    expect(getOpenState(martinique("2026-10-03T22:30:00"))).toEqual({
      isOpen: true,
      label: "Ouvert jusqu'à 23h",
    });
  });

  it("saute le dimanche fermé", () => {
    const saturdayNight = getOpenState(martinique("2026-10-03T23:30:00"));
    expect(saturdayNight.label).toBe("Fermé - ouvre lundi à 17h30");

    const sunday = getOpenState(martinique("2026-10-04T18:00:00"));
    expect(sunday.isOpen).toBe(false);
    expect(sunday.label).toBe("Fermé - ouvre demain à 17h30");
  });
});
