"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { menuIndex } from "@/data/menu";
import { cartCount, cartTotal, type CartLine } from "@/lib/order";

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

const OrderContext = createContext<OrderContextValue | null>(null);

/** Ne garde que des lignes qui existent encore à la carte et des quantités saines. */
function sanitize(value: unknown): CartLine[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    if (typeof entry !== "object" || entry === null) return [];
    const { id, quantity } = entry as Partial<CartLine>;
    if (typeof id !== "string" || !menuIndex[id]) return [];
    if (typeof quantity !== "number" || !Number.isFinite(quantity)) return [];
    const clamped = Math.min(Math.max(Math.floor(quantity), 1), 99);
    return [{ id, quantity: clamped }];
  });
}

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  // La sélection survit à un rechargement : sur mobile, le client quitte
  // souvent l'onglet pour vérifier quelque chose avant d'envoyer sa commande.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setLines(sanitize(JSON.parse(stored)));
    } catch {
      // Stockage indisponible (navigation privée, quota) : on démarre à vide.
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // Idem : la persistance est un confort, pas une fonctionnalité critique.
    }
  }, [lines]);

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
  }, []);

  const remove = useCallback((id: string) => {
    setLines((current) =>
      current.flatMap((line) => {
        if (line.id !== id) return [line];
        return line.quantity > 1 ? [{ ...line, quantity: line.quantity - 1 }] : [];
      }),
    );
  }, []);

  const clear = useCallback(() => setLines([]), []);

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

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrder(): OrderContextValue {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder doit être utilisé à l'intérieur de <OrderProvider>.");
  }
  return context;
}
