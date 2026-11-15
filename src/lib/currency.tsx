"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { formatPrice } from "./format";

type Currency = "USD" | "THB";
const CurrencyContext = createContext({
  currency: "USD" as Currency,
  setCurrency: (_currency: Currency) => {},
});
const storageKey = "trylivo.currency";
// Bank of Thailand USD reference rate, 13 November 2026.
const bahtPerDollar = 33.859;
const baht = new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB" });

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("USD");

  useEffect(() => {
    const detected = /^(th)(-|$)|-TH(-|$)/i.test(navigator.language) ? "THB" : "USD";
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(storageKey);
    } catch {}
    setCurrency(saved === "THB" || saved === "USD" ? saved : detected);
  }, []);

  function selectCurrency(value: Currency) {
    setCurrency(value);
    try {
      localStorage.setItem(storageKey, value);
    } catch {}
  }

  return <CurrencyContext.Provider value={{ currency, setCurrency: selectCurrency }}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const selection = useContext(CurrencyContext);
  return {
    ...selection,
    formatPrice: selection.currency === "THB" ? (usd: number) => baht.format(usd * bahtPerDollar) : formatPrice,
  };
}
