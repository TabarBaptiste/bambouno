import { site } from "@/data/site";

export type OpenState = {
  isOpen: boolean;
  /** Phrase courte prête à afficher, ex. « Ouvert jusqu'à 22h00 ». */
  label: string;
  /** Jour de la prochaine ouverture (0-6), utile pour l'affichage détaillé. */
  nextOpenDay?: number;
};

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
 * l'ouverture réelle à Gros-Morne.
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

export function getOpenState(date = new Date()): OpenState {
  const { day, minutes } = nowInMartinique(date);
  const today = site.hours[day];

  if (today) {
    const open = toMinutes(today.open);
    const close = toMinutes(today.close);

    if (minutes >= open && minutes < close) {
      return { isOpen: true, label: `Ouvert jusqu'à ${formatHour(today.close)}` };
    }
    if (minutes < open) {
      return {
        isOpen: false,
        label: `Ouvre à ${formatHour(today.open)}`,
        nextOpenDay: day,
      };
    }
  }

  // Fermé pour aujourd'hui : on cherche le prochain jour ouvré.
  for (let offset = 1; offset <= 7; offset++) {
    const nextDay = (day + offset) % 7;
    const slot = site.hours[nextDay];
    if (slot) {
      const dayLabel = offset === 1 ? "demain" : DAY_LOWER[nextDay];
      return {
        isOpen: false,
        label: `Fermé - ouvre ${dayLabel} à ${formatHour(slot.open)}`,
        nextOpenDay: nextDay,
      };
    }
  }

  return { isOpen: false, label: "Fermé" };
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
