type Umami = { track: (event: string, data?: Record<string, string | number>) => void };

/**
 * Événement Umami (statistiques sans cookies). Sans effet si le script n'est
 * pas chargé : en local, en test, ou si un bloqueur de publicité l'écarte.
 */
export function track(event: string, data?: Record<string, string | number>) {
  (window as unknown as { umami?: Umami }).umami?.track(event, data);
}
