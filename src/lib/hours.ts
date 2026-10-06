import { site } from "@/data/site";

export type OpenState = {
  isOpen: boolean;
  /** Libellé minimal, ex. « Ouvert » ou « Fermé • Ouvre à 17h30 ». */
  label: string;
};

/** En deçà, l'heure d'ouverture ou de fermeture mérite d'être affichée. */
const SOON_MINUTES = 60;

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/** Formate "17:30" en "17h30", et "22:00" en "22h". */
export function formatHour(hhmm: string): string {
  const [h, m] = hhmm.split(":");
  return m === "00" ? `${Number(h)}h` : `${Number(h)}h${m}`;
}

/**
 * Jour de la semaine et minutes écoulées depuis minuit, dans le fuseau du
 * restaurant - pas celui du visiteur. Un client en métropole doit voir
 * l'ouverture réelle au Gros-Morne.
 */
export function nowInMartinique(date = new Date()): { day: number; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: site.timeZone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const dayIndex = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(
    get("weekday"),
  );
  // Intl peut rendre "24" pour minuit selon l'implémentation ; on normalise.
  const hour = Number(get("hour")) % 24;

  return { day: dayIndex, minutes: hour * 60 + Number(get("minute")) };
}

const DAY_LOWER = [
  "dimanche",
  "lundi",
  "mardi",
  "mercredi",
  "jeudi",
  "vendredi",
  "samedi",
] as const;

/** Prochaine ouverture : « à 17h30 » aujourd'hui, sinon « lundi à 17h30 ». */
function nextOpening(day: number, minutes: number): string {
  const today = site.hours[day];
  if (today && minutes < toMinutes(today.open)) return `à ${formatHour(today.open)}`;

  for (let offset = 1; offset <= 7; offset++) {
    const nextDay = (day + offset) % 7;
    const slot = site.hours[nextDay];
    if (slot) return `${DAY_LOWER[nextDay]} à ${formatHour(slot.open)}`;
  }
  return "";
}

/**
 * Statut réduit à l'essentiel :
 * - ouvert : « Ouvert », plus l'heure de fermeture dans la dernière heure ;
 * - fermé : toujours « Fermé • Ouvre … » avec l'heure, ou le jour quand ce
 *   n'est pas aujourd'hui (dimanche, ou après la fermeture du soir).
 */
export function getOpenState(date = new Date()): OpenState {
  const { day, minutes } = nowInMartinique(date);
  const today = site.hours[day];

  if (today && minutes >= toMinutes(today.open) && minutes < toMinutes(today.close)) {
    const close = toMinutes(today.close);
    return close - minutes <= SOON_MINUTES
      ? { isOpen: true, label: `Ouvert • ferme à ${formatHour(today.close)}` }
      : { isOpen: true, label: "Ouvert" };
  }

  const next = nextOpening(day, minutes);
  return { isOpen: false, label: next ? `Fermé • Ouvre ${next}` : "Fermé" };
}

/** Horaires au format schema.org OpeningHoursSpecification. */
export function openingHoursSchema() {
  const schemaDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return Object.entries(site.hours)
    .filter(([, slot]) => slot !== null)
    .map(([day, slot]) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: schemaDays[Number(day)],
      opens: slot!.open,
      closes: slot!.close,
    }));
}
