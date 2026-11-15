"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getProduct } from "./data";

export type CartLine = {
  slug: string;
  variantId: string;
  variantTitle: string;
  qty: number;
};

type StoreState = {
  cart: CartLine[];
  wishlist: string[];
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  /** what the cart drawer shows */
  drawerView: DrawerView;
  setDrawerView: (v: DrawerView) => void;
  /** open the drawer on the checkout step ("Buy Now") */
  checkout: () => void;
  addToCart: (line: CartLine) => void;
  updateQty: (variantId: string, qty: number) => void;
  removeFromCart: (variantId: string) => void;
  clearCart: () => void;
  toggleWishlist: (slug: string) => void;
  inWishlist: (slug: string) => boolean;
  cartCount: number;
  subtotal: number;
};

export type DrawerView = "cart" | "checkout" | "done";

const StoreContext = createContext<StoreState | null>(null);

const CART_KEY = "ecom.cart.v1";
const WISH_KEY = "ecom.wishlist.v1";

function load<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage can be unavailable (private mode) — state still works in memory */
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cartOpen, setCartOpenState] = useState(false);
  const [drawerView, setDrawerView] = useState<DrawerView>("cart");
  const setCartOpen = useCallback((open: boolean) => {
    setCartOpenState(open);
    if (open) setDrawerView((v) => (v === "done" ? "cart" : v));
    else setTimeout(() => setDrawerView("cart"), 300);
  }, []);
  const checkout = useCallback(() => {
    setDrawerView("checkout");
    setCartOpenState(true);
  }, []);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCart(load<CartLine[]>(CART_KEY, []).filter((l) => getProduct(l.slug)));
    setWishlist(load<string[]>(WISH_KEY, []).filter((s) => getProduct(s)));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) save(CART_KEY, cart);
  }, [cart, hydrated]);

  useEffect(() => {
    if (hydrated) save(WISH_KEY, wishlist);
  }, [wishlist, hydrated]);

  const addToCart = useCallback((line: CartLine) => {
    setCart((prev) => {
      const existing = prev.find((l) => l.variantId === line.variantId);
      if (existing) {
        return prev.map((l) => (l.variantId === line.variantId ? { ...l, qty: l.qty + line.qty } : l));
      }
      return [...prev, line];
    });
    setCartOpenState(true);
  }, []);

  const updateQty = useCallback((variantId: string, qty: number) => {
    setCart((prev) =>
      qty <= 0 ? prev.filter((l) => l.variantId !== variantId) : prev.map((l) => (l.variantId === variantId ? { ...l, qty } : l)),
    );
  }, []);

  const removeFromCart = useCallback((variantId: string) => {
    setCart((prev) => prev.filter((l) => l.variantId !== variantId));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback((slug: string) => {
    setWishlist((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  }, []);

  const value = useMemo<StoreState>(() => {
    const cartCount = cart.reduce((n, l) => n + l.qty, 0);
    const subtotal = cart.reduce((n, l) => n + (getProduct(l.slug)?.price ?? 0) * l.qty, 0);
    return {
      cart,
      wishlist,
      cartOpen,
      setCartOpen,
      drawerView,
      setDrawerView,
      checkout,
      addToCart,
      updateQty,
      removeFromCart,
      clearCart,
      toggleWishlist,
      inWishlist: (slug) => wishlist.includes(slug),
      cartCount,
      subtotal,
    };
  }, [cart, wishlist, cartOpen, setCartOpen, drawerView, checkout, addToCart, updateQty, removeFromCart, clearCart, toggleWishlist]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
