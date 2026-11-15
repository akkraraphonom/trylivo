"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { mainNav, megaMenu } from "@/lib/site";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/format";
import { Logo } from "@/components/ui/Logo";
import { lockScroll } from "@/components/motion/SmoothScroll";
import { BagIcon, ChevronDown, ChevronLeft, ChevronRight, CloseIcon, HeartIcon, SearchIcon, UserIcon } from "@/components/ui/Icons";
import { LocaleSelect } from "./LocaleSelect";

/** Pages that open with a full-bleed hero: the header sits on top of it, transparent, until you scroll. */
const OVERLAY_PREFIXES = ["/shop", "/journal", "/about", "/wishlist"];
const isOverlayRoute = (p: string) => p === "/" || OVERLAY_PREFIXES.some((r) => p === r || p.startsWith(`${r}/`));

function CountBadge({ n, light }: { n: number; light: boolean }) {
  return (
    <span
      className={cn(
        "header-count-badge absolute -top-1 -right-2 grid h-3.5 min-w-3.5 place-items-center rounded-full px-[3px] pb-px text-[10px] leading-[10px] font-normal transition-colors duration-300",
        light ? "bg-white text-ink" : "bg-ink text-white",
      )}
    >
      {n > 99 ? "99+" : n}
    </span>
  );
}

export function Header() {
  const pathname = usePathname();
  const { cartCount, wishlist, setCartOpen } = useStore();
  const [shopOpen, setShopOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setShopOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    lockScroll(true);
    return () => lockScroll(false);
  }, [mobileOpen]);

  // Framer has two nav variants: "Default Nav" (100px, transparent) at the top of the page and
  // "Scroll Nav" (76px, white with a hairline) once the page scrolls. Hero pages get white text at the top.
  const light = isOverlayRoute(pathname) && !scrolled;
  // the bar only shrinks to the 76px "Scroll Nav" on scroll; opening the mega menu just turns it white

  return (
    <>
      <header
        className={cn(
          "relative border-b transition-[padding,background-color,color,border-color] duration-300 ease-[cubic-bezier(.44,0,.56,1)]",
          scrolled ? "border-line bg-white py-2" : "border-transparent bg-transparent py-3.5 md:py-[18px] lg:py-5",
          light ? "text-white" : "text-ink",
        )}
        onMouseLeave={() => setShopOpen(false)}
      >
        <div className="site-header-row container-site flex h-[60px] items-center justify-between gap-6">
          <div className="flex items-center gap-14 lg:gap-[110px]">
            <Logo light={light} />
            <nav className="hidden items-center gap-10 lg:flex" aria-label="Main">
              {mainNav.map((item) =>
                item.dropdown ? (
                  <button
                    key={item.label}
                    type="button"
                    className={cn(
                      "flex items-center gap-1.5 py-0.5 text-[16px] leading-[1.2] font-medium tracking-[-0.03em] uppercase underline-offset-[5px]",
                      shopOpen && "underline decoration-1",
                    )}
                    aria-expanded={shopOpen}
                    onMouseEnter={() => setShopOpen(true)}
                    onClick={() => setShopOpen((v) => !v)}
                  >
                    {item.label}
                    <ChevronDown size={14} className={cn("transition-transform duration-300", shopOpen && "rotate-180")} />
                  </button>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    onMouseEnter={() => setShopOpen(false)}
                    className="group relative py-0.5 text-[16px] leading-[1.2] font-medium tracking-[-0.03em] uppercase"
                  >
                    {item.label}
                    <span
                      className={cn(
                        "absolute bottom-0 left-0 h-px bg-current transition-[width] duration-300 ease-[cubic-bezier(.44,0,.56,1)]",
                        "w-0 group-hover:w-full",
                      )}
                    />
                  </Link>
                ),
              )}
            </nav>
          </div>

          <div className="site-header-actions flex items-center gap-[18px] md:gap-[22px] lg:gap-6">
            <Link href="/search" aria-label="Search" className="transition-opacity hover:opacity-60">
              <SearchIcon size={21} />
            </Link>
            <Link href="/account" aria-label="Account" className="transition-opacity hover:opacity-60">
              <UserIcon size={20} />
            </Link>
            <Link href="/wishlist" aria-label={`Wishlist (${wishlist.length})`} className="relative hidden transition-opacity hover:opacity-60 md:block">
              <HeartIcon size={22} />
              <CountBadge n={wishlist.length} light={light} />
            </Link>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label={`Cart (${cartCount})`}
              className="relative transition-opacity hover:opacity-60"
            >
              <BagIcon size={23} />
              <CountBadge n={cartCount} light={light} />
            </button>
            <LocaleSelect light={light} className="hidden lg:block" />
            <button
              type="button"
              className="flex h-11 w-8 flex-col items-center justify-center gap-3 lg:hidden"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
            >
              <span className="h-[1.5px] w-full rounded-full bg-current" />
              <span className="h-[1.5px] w-full rounded-full bg-current" />
            </button>
          </div>
        </div>

        <MegaMenu open={shopOpen} onNavigate={() => setShopOpen(false)} />
      </header>

      {mobileOpen && <MobileMenu onClose={() => setMobileOpen(false)} />}
    </>
  );
}

function MegaMenu({ open, onNavigate }: { open: boolean; onNavigate: () => void }) {
  return (
    <div
      className={cn(
        "absolute inset-x-0 top-[calc(100%-10px)] hidden transition-[opacity,transform] duration-300 ease-[cubic-bezier(.44,0,.56,1)] lg:block",
        open ? "visible translate-y-0 opacity-100" : "pointer-events-none invisible -translate-y-2 opacity-0",
      )}
    >
      <div className="container-site">
        <div className="ml-[198px] grid w-[1040px] max-w-[calc(100%-198px)] grid-cols-[240px_1fr] gap-14 rounded-xl border border-[rgba(8,10,16,0.08)] bg-white px-9 pt-[38px] pb-9 text-ink shadow-[0_28px_56px_-16px_rgba(8,10,16,0.22)]">
          <div>
            <p className="text-[14px] leading-none font-medium tracking-[-0.03em] text-muted uppercase">Categories</p>
            <ul className="mt-5 flex flex-col gap-[22px]">
              {megaMenu.categories.map((c) => (
                <li key={c.href}>
                  <Link href={c.href} onClick={onNavigate} className="shop-menu-underline text-[16px] leading-[1.2] font-medium tracking-[-0.03em]">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[14px] leading-none font-medium tracking-[-0.03em] text-muted uppercase">Shop from Collections</p>
            <div className="mt-[18px] grid grid-cols-4 gap-4">
              {megaMenu.collections.map((c) => (
                <Link key={c.slug} href={`/shop/collection/${c.slug}`} onClick={onNavigate} className="shop-menu-collection group flex flex-col gap-2 text-center">
                  <span className="relative block aspect-[156/195] overflow-hidden rounded-lg bg-[#f5f5f5]">
                    <span className={cn("absolute inset-x-0 bottom-0", c.slug === "best-sellers" ? "top-0" : "top-1.5")}>
                      <Image src={c.image} alt="" fill sizes="156px" className="object-cover object-top" />
                    </span>
                  </span>
                  <span className="shop-menu-underline self-center text-[15px] leading-[1.1]">{c.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  const [shop, setShop] = useState(false);
  const row = "flex w-full items-center justify-between border-b border-[#e3e3e3] py-4 text-[28px] leading-[1.2] tracking-[-0.03em]";
  return (
    <div className="fixed inset-x-0 top-8 bottom-0 z-50 flex flex-col bg-white text-ink animate-fade-in lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
      <div className="container-site flex h-[88px] shrink-0 items-center justify-between md:h-24">
        <Logo />
        <button type="button" onClick={onClose} aria-label="Close menu">
          <CloseIcon size={28} strokeWidth={1.3} />
        </button>
      </div>
      <div className="container-site flex-1 overflow-y-auto pt-2" data-lenis-prevent>
        {shop ? (
          <nav aria-label="Shop" className="animate-fade-in">
            <button type="button" onClick={() => setShop(false)} className="mb-2 flex items-center gap-1 py-3 text-sm text-muted">
              <ChevronLeft size={16} /> Back
            </button>
            {[...megaMenu.categories, ...megaMenu.collections.map((c) => ({ label: c.label, href: `/shop/collection/${c.slug}` }))].map((l) => (
              <Link key={l.href} href={l.href} onClick={onClose} className={row}>
                {l.label}
              </Link>
            ))}
          </nav>
        ) : (
          <nav aria-label="Mobile">
            <button type="button" className={row} onClick={() => setShop(true)}>
              Shop <ChevronRight size={24} strokeWidth={1.3} />
            </button>
            {[
              { label: "Compare", href: "/compare" },
              { label: "About", href: "/about" },
              { label: "Wishlist", href: "/wishlist" },
              { label: "Contact", href: "/contact" },
            ].map((l) => (
              <Link key={l.href} href={l.href} onClick={onClose} className={row}>
                {l.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
      <div className="container-site flex shrink-0 items-center justify-between border-t border-line py-5 text-[15px]">
        <span className="text-muted">Country / Region</span>
        <LocaleSelect up />
      </div>
    </div>
  );
}
