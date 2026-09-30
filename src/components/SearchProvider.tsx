"use client";

import { createContext, useContext, useMemo, useState } from "react";

type SearchContextValue = {
  query: string;
  setQuery: (query: string) => void;
};

const SearchContext = createContext<SearchContextValue | null>(null);

/**
 * La recherche est saisie dans le header et filtre la carte plus bas dans la
 * page : les deux ne partagent aucun parent proche, d'où ce contexte.
 */
export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState("");
  const value = useMemo(() => ({ query, setQuery }), [query]);
  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

export function useSearch(): SearchContextValue {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch doit être utilisé à l'intérieur de <SearchProvider>.");
  }
  return context;
}
