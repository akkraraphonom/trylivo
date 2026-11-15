"use client";

import { useCurrency } from "@/lib/currency";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { lockScroll } from "@/components/motion/SmoothScroll";
import type { Product } from "@/lib/types";
import { colorOptions, sizeOptions } from "@/lib/data";
import { cn, swatch } from "@/lib/format";
import { ChevronDown, CloseIcon, SearchIcon } from "@/components/ui/Icons";
import { ProductCard } from "@/components/product/ProductCard";
import { revealStyle, useInViewOnce } from "@/components/motion/Reveal";

/* Filter vocabularies exactly as the template lists them */
const SORTS = {
  relevance: "Relevance",
  "a-z": "A-Z",
  "z-a": "Z-A",
  "price-asc": "Price (lowest first)",
  "price-desc": "Price (highest first)",
  newest: "Newest",
  best: "Best Selling",
} as const;
type SortKey = keyof typeof SORTS;

const TYPES = ["Jacket", "Sweater", "Hoodie", "Cardigan", "T-Shirt"];
const COLLECTIONS = [
  { label: "Men", value: "Men" },
  { label: "Women", value: "Women" },
  { label: "Kid", value: "Kid" },
  { label: "New", value: "New Arrivals" },
  { label: "Popular", value: "Best Sellers" },
  { label: "Seasonal Drop", value: "Seasonal Drop" },
];
const SIZES = ["XL", "L", "M", "S", "5Y", "6Y", "8Y", "10Y"];
const COLORS = ["Black", "Gray", "Stone Taupe", "Charcoal Gray", "Orange", "Sage Green", "Steel Blue", "Lavender", "Dark Green", "Pink", "Yellow", "White", "Red", "Green", "Brown", "Beige", "Navy"];
const PRICES = [
  { label: "Under $50", min: 0, max: 50 },
  { label: "$50 - $100", min: 50, max: 100 },
  { label: "$100 - $200", min: 100, max: 200 },
  { label: "Over $200", min: 200, max: Infinity },
];

type Filters = { types: string[]; collections: string[]; sizes: string[]; colors: string[]; prices: string[] };
const EMPTY: Filters = { types: [], collections: [], sizes: [], colors: [], prices: [] };

/** Template sizes "5Y" ≈ the catalogue's "4Y" kids size */
const sizeMatches = (p: Product, s: string) => sizeOptions(p).some((v) => v === s || (s === "5Y" && v === "4Y"));

export function Catalog({
  products,
  initialQuery = "",
  isSearchPage = false,
  showTypeFilter = true,
  showCollectionFilter = false,
  showProductMeta = true,
  heading,
}: {
  products: Product[];
  initialQuery?: string;
  isSearchPage?: boolean;
  showTypeFilter?: boolean;
  showCollectionFilter?: boolean;
  showProductMeta?: boolean;
  /** breadcrumb + title + description block (collection pages) */
  heading?: { crumb: string; title: string; text: string };
}) {
  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState<SortKey>("relevance");
  const [filters, setFilters] = useState<Filters>(EMPTY);
  const [drawer, setDrawer] = useState(false);
  const [ref, inView] = useInViewOnce<HTMLDivElement>();

  useEffect(() => {
    if (!drawer) return;
    lockScroll(true);
    return () => lockScroll(false);
  }, [drawer]);

  const activeCount = Object.values(filters).reduce((n, v) => n + v.length, 0);

  const list = useMemo(() => {
    const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const out = products.filter((p) => {
      if (words.length) {
        const hay = [p.title, p.type, p.excerpt, ...p.tags, ...p.collections, ...colorOptions(p)].join(" ").toLowerCase();
        if (!words.every((word) => hay.includes(word))) return false;
      }
      if (filters.types.length && !filters.types.includes(p.type)) return false;
      if (filters.collections.length && !filters.collections.some((c) => p.collections.includes(c))) return false;
      if (filters.sizes.length && !filters.sizes.some((s) => sizeMatches(p, s))) return false;
      if (filters.colors.length && !colorOptions(p).some((c) => filters.colors.includes(c))) return false;
      if (filters.prices.length && !PRICES.filter((r) => filters.prices.includes(r.label)).some((r) => p.price >= r.min && p.price < r.max))
        return false;
      return true;
    });
    const sorted = [...out];
    if (sort === "a-z") sorted.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "z-a") sorted.sort((a, b) => b.title.localeCompare(a.title));
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "newest") sorted.sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
    if (sort === "best") sorted.sort((a, b) => Number(b.collections.includes("Best Sellers")) - Number(a.collections.includes("Best Sellers")));
    return sorted;
  }, [products, query, filters, sort]);

  const toggle = (key: keyof Filters, value: string) =>
    setFilters((f) => ({ ...f, [key]: f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value] }));
  const clear = () => setFilters(EMPTY);

  const panel = (
    <FilterPanel
      filters={filters}
      toggle={toggle}
      setTypes={(t) => setFilters((f) => ({ ...f, types: t }))}
      showType={showTypeFilter}
      showCollection={showCollectionFilter}
    />
  );

  const searchField = (
    <div className={cn("relative min-w-0", isSearchPage ? "flex-1" : "w-full md:w-[358px] lg:w-[328px]")}>
      <SearchIcon size={16} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted" />
      <input
        type="search"
        name={isSearchPage ? "q" : undefined}
        aria-label="Search products"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products"
        className="h-11 w-full rounded-full border border-[#dbdbdb] bg-white py-2.5 pr-9 pl-10 text-[16px] text-ink outline-none transition-colors placeholder:text-muted focus:border-ink"
      />
    </div>
  );

  return (
    <section
      data-section="Content"
      className={cn(
        "mx-auto max-w-site px-5 pb-28 md:px-8 md:pb-20 lg:px-[50px] lg:pb-32",
        isSearchPage ? "pt-8 md:pt-12" : "pt-14 md:pt-[74px] lg:pt-[120px]",
      )}
    >
      {isSearchPage && (
        <div className="mx-auto mb-8 max-w-[650px] lg:max-w-none">
          <h1 className="mb-5 text-[40px] leading-[1.1] tracking-[-0.03em] md:text-[56px]">Search</h1>
          <form action="/search" method="get" role="search" className="flex max-w-xl gap-2">
            {searchField}
            <button type="submit" className="h-11 shrink-0 rounded-full bg-ink px-5 text-sm font-medium text-white hover:opacity-80">
              Search
            </button>
          </form>
        </div>
      )}
      {heading && (
        <div className="mx-auto mb-[62px] flex max-w-[650px] flex-col gap-6 lg:max-w-none">
          <p className="flex items-center gap-0.5 text-[14px] leading-[1.2] font-medium tracking-[-0.02em] md:text-[16px] lg:text-[18px]">
            <Link href="/" className="whitespace-pre text-muted transition-colors hover:text-[#5c5c5c]">
              {"Home  > "}
            </Link>
            <span>{heading.crumb}</span>
          </p>
          <div className="flex flex-col gap-5">
            <h2 className="text-[36px] leading-[1.1] tracking-[-0.03em] md:text-[56px]">{heading.title}</h2>
            <p className="max-w-[500px] text-[16px] leading-[1.2] tracking-[-0.02em] text-muted md:max-w-[400px] lg:max-w-[500px] lg:text-[18px]">{heading.text}</p>
          </div>
        </div>
      )}

      <div className="mx-auto flex max-w-[650px] gap-12 lg:max-w-none">
        {/* desktop sidebar */}
        <aside className="hidden w-60 shrink-0 pt-[100px] lg:block">
          <FilterTop count={activeCount} onClear={clear} />
          {panel}
        </aside>

        <div className="min-w-0 flex-1">
          {/* phone / tablet: filter trigger + sort */}
          <div className="mb-[34px] flex items-center justify-between md:mb-[43px] lg:hidden">
            <button
              type="button"
              onClick={() => setDrawer(true)}
              className="relative flex h-[35px] items-center gap-1.5 rounded-full bg-white px-5 text-[14px] tracking-[-0.02em] text-muted inset-ring inset-ring-[#dbdbdb] md:h-[38px] md:text-[15px]"
            >
              Filter <FunnelIcon />
              {activeCount > 0 && <Badge n={activeCount} />}
            </button>
            <SortSelect sort={sort} setSort={setSort} small />
          </div>

          <div className="flex flex-col gap-8 md:gap-9 lg:gap-[62px]">
            <div className={cn("flex items-center justify-between gap-4", isSearchPage && "hidden lg:flex lg:justify-end")}>
              {!isSearchPage && searchField}
              <div className="hidden lg:block">
                <SortSelect sort={sort} setSort={setSort} />
              </div>
            </div>

            {isSearchPage && (
              <p role="status" className="text-sm text-muted">
                {list.length === 0 ? "No products found" : `${list.length} ${list.length === 1 ? "product" : "products"}`}
              </p>
            )}
            <div ref={ref} className="grid gap-5 md:grid-cols-2 md:gap-x-5 md:gap-y-6 lg:grid-cols-3 lg:gap-x-4">
              {list.map((p, i) => (
                <div key={p.slug} style={isSearchPage ? undefined : revealStyle(inView, 30, (i % 3) * 0.08)}>
                  <ProductCard
                    product={p}
                    showNew
                    showMeta={showProductMeta}
                    className="h-full"
                    imageClassName="aspect-[350/381] md:aspect-[315/331] lg:aspect-[313/331]"
                    sizes="(min-width: 1200px) 313px, (min-width: 810px) 315px, 90vw"
                  />
                </div>
              ))}
            </div>
            {!isSearchPage && list.length === 0 && <p className="py-10 text-[16px] text-muted">No products found...</p>}
          </div>
        </div>
      </div>

      {/* phone / tablet filter drawer */}
      <div className={cn("fixed inset-0 z-50 lg:hidden", drawer ? "visible" : "invisible")} aria-hidden={!drawer}>
        <div
          className={cn("absolute inset-0 bg-black/30 transition-opacity duration-300", drawer ? "opacity-100" : "opacity-0")}
          onClick={() => setDrawer(false)}
        />
        <div
          role="dialog"
          aria-label="Filters"
          className={cn(
            "absolute inset-y-0 left-0 flex w-[min(340px,88vw)] flex-col bg-white transition-transform duration-300 ease-[cubic-bezier(.44,0,.56,1)]",
            drawer ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex items-center justify-between px-5 pt-5">
            <FilterTop count={activeCount} onClear={clear} />
            <button type="button" onClick={() => setDrawer(false)} aria-label="Close filters" className="mb-6">
              <CloseIcon size={22} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 pb-8" data-lenis-prevent>
            {panel}
          </div>
        </div>
      </div>
    </section>
  );
}

function Badge({ n }: { n: number }) {
  return (
    <span className="absolute -top-1 -right-1 grid size-3.5 place-items-center rounded-full bg-[#080a10] text-[9px] leading-none font-medium text-white">
      {n}
    </span>
  );
}

function FunnelIcon() {
  return (
    <svg width="15" height="14" viewBox="0 0 14.998 14.167" fill="none" stroke="#080a10" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M 6 12.675 C 6 12.958 6.16 13.216 6.414 13.343 L 7.914 14.088 C 8.147 14.204 8.423 14.191 8.644 14.056 C 8.865 13.92 9 13.679 9 13.421 L 9 8.202 C 9 7.832 9.138 7.476 9.387 7.202 L 14.805 1.245 C 15.003 1.027 15.054 0.713 14.934 0.444 C 14.814 0.174 14.546 0.001 14.25 0 L 0.75 0 C 0.453 0 0.185 0.174 0.065 0.443 C -0.056 0.712 -0.005 1.026 0.193 1.245 L 5.612 7.202 C 5.861 7.476 6 7.832 6 8.202 Z" />
    </svg>
  );
}

/** "Filter ⏷" pill that turns into "Clear ✕" with a count once anything is selected. */
function FilterTop({ count, onClear }: { count: number; onClear: () => void }) {
  const pill = "relative inline-flex h-[39px] items-center gap-1.5 rounded-full bg-white px-5 text-[16px] tracking-[-0.02em] text-muted inset-ring inset-ring-[#dbdbdb]";
  return (
    <div className="pb-6">
      {count > 0 ? (
        <button type="button" onClick={onClear} className={pill} aria-label="Reset all filters">
          Clear <CloseIcon size={18} className="text-[#080a10]" />
          <Badge n={count} />
        </button>
      ) : (
        <span className={pill}>
          Filter <FunnelIcon />
        </span>
      )}
    </div>
  );
}

function SortSelect({ sort, setSort, small }: { sort: SortKey; setSort: (s: SortKey) => void; small?: boolean }) {
  const details = useRef<HTMLDetailsElement>(null);
  const trigger = useRef<HTMLElement>(null);

  useEffect(() => {
    function closeOnOutsidePress(event: PointerEvent) {
      const menu = details.current;
      if (menu?.open && !menu.contains(event.target as Node)) menu.open = false;
    }
    document.addEventListener("pointerdown", closeOnOutsidePress);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePress);
  }, []);

  return (
    <details
      ref={details}
      className="group relative"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false;
      }}
      onKeyDown={(event) => {
        if (event.key !== "Escape" || !event.currentTarget.open) return;
        event.preventDefault();
        event.currentTarget.open = false;
        trigger.current?.focus();
      }}
    >
      <summary
        ref={trigger}
        aria-label={`Sort products: ${SORTS[sort]}`}
        className={cn(
          "flex cursor-pointer list-none items-center justify-between gap-2 rounded-full border border-line bg-white px-4 text-ink transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 group-open:border-ink [&::-webkit-details-marker]:hidden",
          small ? "h-[35px] text-sm md:h-[38px]" : "h-[39px] text-[15px]",
        )}
      >
        {SORTS[sort]}
        <ChevronDown size={15} className="shrink-0 transition-transform group-open:rotate-180" />
      </summary>
      <ul aria-label="Sort products" className="absolute right-0 top-full z-20 mt-2 w-56 rounded-xl border border-line bg-white p-1.5 text-sm shadow-[0_12px_28px_rgba(0,0,0,0.12)]">
        {(Object.keys(SORTS) as SortKey[]).map((key) => (
          <li key={key}>
            <button
              type="button"
              aria-pressed={key === sort}
              onClick={() => {
                setSort(key);
                if (details.current) details.current.open = false;
                trigger.current?.focus();
              }}
              className="flex min-h-10 w-full items-center justify-between gap-2 rounded-lg px-3 text-left text-ink hover:bg-surface focus-visible:bg-surface aria-pressed:bg-surface aria-pressed:font-medium"
            >
              {SORTS[key]}
              {key === sort && (
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m3.5 8 3 3 6-6" />
                </svg>
              )}
            </button>
          </li>
        ))}
      </ul>
    </details>
  );
}

function FilterPanel({
  filters,
  toggle,
  setTypes,
  showType,
  showCollection,
}: {
  filters: Filters;
  toggle: (k: keyof Filters, v: string) => void;
  setTypes: (t: string[]) => void;
  showType: boolean;
  showCollection: boolean;
}) {
  const { currency, formatPrice } = useCurrency();
  return (
    <div className="flex flex-col gap-4">
      {showType && (
        <Group title="Type" count={filters.types.length} first fixed>
          <Check label="All" checked={false} onChange={() => setTypes([])} />
          {TYPES.map((t) => (
            <Check key={t} label={t} checked={filters.types.includes(t)} onChange={() => toggle("types", t)} />
          ))}
        </Group>
      )}
      {showCollection && (
        <Group title="Collection" count={filters.collections.length} first={!showType} fixed>
          {COLLECTIONS.map((c) => (
            <Check key={c.value} label={c.label} checked={filters.collections.includes(c.value)} onChange={() => toggle("collections", c.value)} />
          ))}
        </Group>
      )}
      <Group title="Size" count={filters.sizes.length}>
        <div className="grid grid-cols-3 gap-[5px]">
          {SIZES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggle("sizes", s)}
              aria-pressed={filters.sizes.includes(s)}
              className={cn(
                "h-8 rounded-full border px-3 text-left text-[14px] transition-colors",
                filters.sizes.includes(s) ? "border-ink bg-ink text-white" : "border-[#dbdbdb] bg-white hover:border-ink",
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </Group>
      <Group title="Color" count={filters.colors.length}>
        <div className="flex flex-col gap-2">
          {COLORS.map((c) => {
            const on = filters.colors.includes(c);
            return (
              <button key={c} type="button" onClick={() => toggle("colors", c)} aria-pressed={on} className="flex items-center gap-2.5 text-[14px]">
                <span className={cn("grid size-8 place-items-center rounded-full border bg-white", on ? "border-ink" : "border-[rgba(3,6,7,0.12)]")}>
                  <span className="size-[22px] rounded-full" style={{ backgroundColor: swatch(c) }} />
                </span>
                {c}
              </button>
            );
          })}
        </div>
      </Group>
      <Group title="Price" count={filters.prices.length}>
        {PRICES.map((r) => (
          <Check key={r.label} label={currency === "USD" ? r.label : r.min === 0 ? `Under ${formatPrice(r.max)}` : Number.isFinite(r.max) ? `${formatPrice(r.min)} – ${formatPrice(r.max)}` : `Over ${formatPrice(r.min)}`} checked={filters.prices.includes(r.label)} onChange={() => toggle("prices", r.label)} />
        ))}
      </Group>
    </div>
  );
}

function Group({
  title,
  count,
  children,
  fixed,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
  first?: boolean;
  /** always open, no chevron (Type / Collection) */
  fixed?: boolean;
}) {
  const [open, setOpen] = useState(!!fixed);
  const head = (
    <span className="flex items-center gap-1 text-[16px] leading-[1.2] font-medium tracking-[-0.02em]">
      {title} <span className="text-[#030607]">({count})</span>
    </span>
  );
  return (
    <div className="flex flex-col border-t border-[rgba(3,6,7,0.08)] pt-4">
      {fixed ? (
        head
      ) : (
        <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex items-center justify-between">
          {head}
          <ChevronDown size={16} className={cn("text-ink-soft transition-transform duration-300", open && "rotate-180")} />
        </button>
      )}
      <div className={cn("grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(.44,0,.56,1)]", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
        <div className="min-h-0 overflow-hidden">
          <div className="flex flex-col gap-3 pt-4 pb-1">{children}</div>
        </div>
      </div>
    </div>
  );
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <button type="button" role="checkbox" aria-checked={checked} onClick={onChange} className="group flex items-center gap-2.5 text-[14px] text-black transition-colors hover:text-[#333]">
      <span className={cn("grid size-5 place-items-center rounded border bg-white transition-colors", checked ? "border-ink" : "border-[rgba(3,6,7,0.12)] group-hover:border-black")}>
        {checked && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M2.5 6.2 5 8.5l4.5-5" />
          </svg>
        )}
      </span>
      {label}
    </button>
  );
}
