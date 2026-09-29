"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { formatPrice, menuIndex } from "@/data/menu";
import { cartCount, cartTotal, sanitize, type CartLine } from "@/lib/order";

const STORAGE_KEY = "bambouno.cart.v1";

type OrderContextValue = {
  lines: CartLine[];
  count: number;
  total: number;
  quantityOf: (id: string) => number;
  add: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
};

type CartAction = { kind: "add" | "remove"; id: string } | { kind: "clear" };

const OrderContext = createContext<OrderContextValue | null>(null);

function describeCart(lines: CartLine[]): string {
  const count = cartCount(lines);
  if (count === 0) return "Sélection vide.";
  const articles = count > 1 ? "articles" : "article";
  return `Sélection : ${count} ${articles}, ${formatPrice(cartTotal(lines))}.`;
}

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  // Dernière action, pour l'annonce faite aux lecteurs d'écran.
  const [lastAction, setLastAction] = useState<CartAction | null>(null);
  // Tant que le stockage n'est pas relu, on n'écrit rien : sinon le panier
  // vide initial écraserait la sélection sauvegardée. Un état et non une ref :
  // l'effet d'écriture du premier rendu doit encore voir `false`.
  const [loaded, setLoaded] = useState(false);

  // La sélection survit à un rechargement : sur mobile, le client quitte
  // souvent l'onglet pour vérifier quelque chose avant d'envoyer sa commande.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setLines(sanitize(JSON.parse(stored)));
    } catch {
      // Stockage indisponible (navigation privée, quota) : on démarre à vide.
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // Idem : la persistance est un confort, pas une fonctionnalité critique.
    }
  }, [lines, loaded]);

  const add = useCallback((id: string) => {
    if (!menuIndex[id]) return;
    setLines((current) => {
      const existing = current.find((line) => line.id === id);
      if (!existing) return [...current, { id, quantity: 1 }];
      if (existing.quantity >= 99) return current;
      return current.map((line) =>
        line.id === id ? { ...line, quantity: line.quantity + 1 } : line,
      );
    });
    setLastAction({ kind: "add", id });
  }, []);

  const remove = useCallback((id: string) => {
    setLines((current) =>
      current.flatMap((line) => {
        if (line.id !== id) return [line];
        return line.quantity > 1 ? [{ ...line, quantity: line.quantity - 1 }] : [];
      }),
    );
    setLastAction({ kind: "remove", id });
  }, []);

  const clear = useCallback(() => {
    setLines([]);
    setLastAction({ kind: "clear" });
  }, []);

  const announcement = useMemo(() => {
    if (!lastAction) return "";
    if (lastAction.kind === "clear") return "Sélection vidée.";
    const name = menuIndex[lastAction.id]?.name ?? "Article";
    const verb = lastAction.kind === "add" ? "ajouté" : "retiré";
    return `${name} ${verb}. ${describeCart(lines)}`;
  }, [lastAction, lines]);

  const value = useMemo<OrderContextValue>(() => {
    const quantities = new Map(lines.map((line) => [line.id, line.quantity]));
    return {
      lines,
      count: cartCount(lines),
      total: cartTotal(lines),
      quantityOf: (id) => quantities.get(id) ?? 0,
      add,
      remove,
      clear,
    };
  }, [lines, add, remove, clear]);

  return (
    <OrderContext.Provider value={value}>
      {children}
      {/* Région live présente dès le premier rendu, sinon rien n'est annoncé. */}
      <p role="status" className="sr-only">
        {announcement}
      </p>
    </OrderContext.Provider>
  );
}

export function useOrder(): OrderContextValue {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder doit être utilisé à l'intérieur de <OrderProvider>.");
  }
  return context;
}
