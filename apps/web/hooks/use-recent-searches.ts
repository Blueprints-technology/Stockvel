"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "stockvel_recent_searches";

export function useRecentSearches() {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    const stored =
      typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (stored) {
      setItems(JSON.parse(stored));
    }
  }, []);

  const addItem = (value: string) => {
    const next = [value, ...items.filter((item) => item !== value)].slice(0, 8);
    setItems(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  return { items, addItem };
}
