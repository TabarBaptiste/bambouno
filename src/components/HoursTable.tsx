"use client";

import { useEffect, useState } from "react";
import { dayNames, site } from "@/data/site";
import { formatHour, nowInMartinique } from "@/lib/hours";

/**
 * Tableau des horaires. Le jour courant est mis en avant côté client
 * uniquement, pour la même raison que le badge ouvert/fermé : le HTML est
 * statique et ne connaît pas la date du visiteur.
 */
export function HoursTable() {
  const [today, setToday] = useState<number | null>(null);

  useEffect(() => {
    setToday(nowInMartinique().day);
  }, []);

  // Semaine affichée du lundi au dimanche, plus lisible que l'ordre technique.
  const order = [1, 2, 3, 4, 5, 6, 0];

  return (
    <ul className="divide-y divide-hairline">
      {order.map((day) => {
        const slot = site.hours[day];
        const isToday = today === day;
        return (
          <li
            key={day}
            className={`flex items-center justify-between py-2 text-sm ${
              isToday ? "text-white" : "text-muted"
            }`}
          >
            <span className="font-heading font-semibold uppercase tracking-wide">
              {dayNames[day]}
              {isToday ? <span className="ml-2 text-xs text-red">aujourd'hui</span> : null}
            </span>
            <span className={slot ? "" : "text-red"}>
              {slot ? `${formatHour(slot.open)} – ${formatHour(slot.close)}` : "Fermé"}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
