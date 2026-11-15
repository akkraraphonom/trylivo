"use client";

import { useCurrency } from "@/lib/currency";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { productImagesForColor } from "@/lib/product-preview";
import { getProduct } from "@/lib/data";
import { useStore, type CartLine } from "@/lib/store";
import { cn } from "@/lib/format";
import { ChevronLeft, CloseIcon, MinusIcon, PlusIcon, TrashIcon } from "@/components/ui/Icons";
import { lockScroll } from "@/components/motion/SmoothScroll";

const FREE_SHIPPING = 150;
const SHIPPING = 9;

export function CartDrawer() {
  const { formatPrice } = useCurrency();
  const { cart, cartOpen, setCartOpen, drawerView, setDrawerView, subtotal, clearCart } = useStore();
  // keep mounted while the closing transition runs
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (cartOpen) {
      setMounted(true);
      let r2 = 0;
      const r1 = requestAnimationFrame(() => {
        r2 = requestAnimationFrame(() => setShown(true));
      });
      return () => {
        cancelAnimationFrame(r1);
        cancelAnimationFrame(r2);
      };
    }
    setShown(false);
    const t = setTimeout(() => setMounted(false), 350);
    return () => clearTimeout(t);
  }, [cartOpen]);

  useEffect(() => {
    if (!cartOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setCartOpen(false);
    document.addEventListener("keydown", onKey);
    lockScroll(true);
    return () => {
      document.removeEventListener("keydown", onKey);
      lockScroll(false);
    };
  }, [cartOpen, setCartOpen]);

  if (!mounted) return null;

  const shipping = subtotal >= FREE_SHIPPING || subtotal === 0 ? 0 : SHIPPING;
  const remaining = Math.max(0, FREE_SHIPPING - subtotal);
  const title = drawerView === "checkout" ? "Checkout" : drawerView === "done" ? "Order placed" : "Your Cart";

  return (
    <div className="fixed inset-0 z-[55]" role="dialog" aria-modal="true" aria-label={title}>
      <button
        type="button"
        aria-label="Close cart"
        className={cn("absolute inset-0 bg-black/40 transition-opacity duration-300", shown ? "opacity-100" : "opacity-0")}
        onClick={() => setCartOpen(false)}
      />
      <aside
        className={cn(
          "absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-[350ms] ease-[cubic-bezier(.22,1,.36,1)]",
          shown ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <div className="flex items-center gap-2">
            {drawerView === "checkout" && (
              <button type="button" onClick={() => setDrawerView("cart")} aria-label="Back to cart" className="-ml-1 p-1">
                <ChevronLeft size={18} />
              </button>
            )}
            <h2 className="text-xl tracking-[-0.03em]">{title}</h2>
          </div>
          <button type="button" onClick={() => setCartOpen(false)} aria-label="Close">
            <CloseIcon size={22} />
          </button>
        </div>

        {drawerView === "done" ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="text-2xl tracking-[-0.03em]">Thank you!</p>
            <p className="text-sm text-muted">
              This is a demo checkout — connect Shopify, Stripe or your own backend in <code>CartDrawer.tsx</code>.
            </p>
            <button type="button" className="btn-dark mt-2" onClick={() => setCartOpen(false)}>
              Continue shopping
            </button>
          </div>
        ) : cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="text-muted">Your cart is empty.</p>
            <Link href="/shop/collection/all" className="btn-dark" onClick={() => setCartOpen(false)}>
              Start shopping
            </Link>
          </div>
        ) : drawerView === "checkout" ? (
          <>
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-6" data-lenis-prevent>
              {cart.map((line) => (
                <LineRow key={line.variantId} line={line} compact />
              ))}
            </ul>
            <div className="space-y-2 border-t border-line px-6 py-5 text-sm">
              <Row label="Subtotal" value={formatPrice(subtotal)} />
              <Row label="Shipping" value={shipping === 0 ? "Free" : formatPrice(shipping)} />
              <Row label="Total" value={formatPrice(subtotal + shipping)} strong />
              <button
                type="button"
                className="btn-dark mt-3 w-full py-3"
                onClick={() => {
                  clearCart();
                  setDrawerView("done");
                }}
              >
                Place order
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="border-b border-line px-6 py-4 text-sm">
              {remaining > 0 ? (
                <p>
                  You&apos;re <strong className="font-medium">{formatPrice(remaining)}</strong> away from free shipping.
                </p>
              ) : (
                <p>You&apos;ve unlocked free shipping.</p>
              )}
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-surface">
                <div className="h-full bg-ink transition-all duration-500" style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING) * 100)}%` }} />
              </div>
            </div>

            <ul className="flex-1 divide-y divide-line overflow-y-auto px-6" data-lenis-prevent>
              {cart.map((line) => (
                <LineRow key={line.variantId} line={line} />
              ))}
            </ul>

            <div className="border-t border-line px-6 py-5">
              <div className="flex justify-between text-[17px]">
                <span>Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-muted">Taxes and shipping calculated at checkout.</p>
              <button type="button" className="btn-dark mt-4 w-full py-3" onClick={() => setDrawerView("checkout")}>
                Checkout
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={cn("flex justify-between", strong && "border-t border-line pt-2 text-[17px] font-medium")}>
      <span className={strong ? "" : "text-muted"}>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function LineRow({ line, compact }: { line: CartLine; compact?: boolean }) {
  const { formatPrice } = useCurrency();
  const { setCartOpen, updateQty, removeFromCart } = useStore();
  const p = getProduct(line.slug);
  if (!p) return null;
  const imageSrc = productImagesForColor(p, line.variantTitle.split(" / ")[0])[0]?.src;
  return (
    <li className="flex gap-4 py-5">
      <Link
        href={`/product/${p.slug}`}
        onClick={() => setCartOpen(false)}
        className={cn("relative shrink-0 overflow-hidden rounded-lg border border-line", compact ? "size-16" : "size-24")}
      >
        {imageSrc && <Image src={imageSrc} alt={p.title} fill sizes="96px" className="object-cover" />}
      </Link>
      <div className="flex flex-1 flex-col">
        <div className="flex justify-between gap-3">
          <div>
            <p className="font-medium">{p.title}</p>
            <p className="text-sm text-muted">
              {line.variantTitle}
              {compact && ` · Qty ${line.qty}`}
            </p>
          </div>
          <p className="text-sm">{formatPrice(p.price * line.qty)}</p>
        </div>
        {!compact && (
          <div className="mt-auto flex items-center justify-between">
            <QtyStepper value={line.qty} min={0} onChange={(q) => updateQty(line.variantId, q)} />
            <button type="button" onClick={() => removeFromCart(line.variantId)} className="text-muted hover:text-ink" aria-label={`Remove ${p.title}`}>
              <TrashIcon size={16} />
            </button>
          </div>
        )}
      </div>
    </li>
  );
}

export function QtyStepper({ value, onChange, min = 1 }: { value: number; onChange: (n: number) => void; min?: number }) {
  const btn = "grid h-9 w-[38px] place-items-center rounded-full text-ink-soft transition-opacity hover:text-ink disabled:opacity-40";
  return (
    <div className="inline-flex h-9 items-center rounded-full bg-white inset-ring inset-ring-[#e2e1e1]">
      <button type="button" aria-label="Decrease quantity" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} className={btn}>
        <MinusIcon size={14} />
      </button>
      <span className="min-w-2 text-center text-[16px] leading-none font-semibold tabular-nums">{value}</span>
      <button type="button" aria-label="Increase quantity" onClick={() => onChange(value + 1)} className={btn}>
        <PlusIcon size={14} />
      </button>
    </div>
  );
}
