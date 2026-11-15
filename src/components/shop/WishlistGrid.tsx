"use client";

import { useMemo, useState } from "react";
import { getProduct } from "@/lib/data";
import { useStore } from "@/lib/store";
import type { Product } from "@/lib/types";
import { ChevronDown } from "@/components/ui/Icons";
import { ProductCard } from "@/components/product/ProductCard";
import { Reveal } from "@/components/motion/Reveal";

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

/** Saved products: count/empty line + sort, then a 3-up grid. */
export function WishlistGrid() {
  const { wishlist } = useStore();
  const [sort, setSort] = useState<SortKey>("relevance");
  const items = useMemo(() => {
    const list = wishlist.map(getProduct).filter(Boolean) as Product[];
    if (sort === "a-z") list.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "z-a") list.sort((a, b) => b.title.localeCompare(a.title));
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "newest") list.sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
    if (sort === "best") list.sort((a, b) => Number(b.collections.includes("Best Sellers")) - Number(a.collections.includes("Best Sellers")));
    return list;
  }, [wishlist, sort]);

  return (
    <section data-section="Content" className="mx-auto max-w-[1260px] px-5 pt-10 pb-16 md:px-8 lg:px-[50px] lg:pt-[54px] lg:pb-[84px]">
      <div className="flex items-center justify-between gap-4">
        <p className="text-[16px] leading-[1.1]">
          {items.length ? `${items.length} saved ${items.length === 1 ? "item" : "items"}` : "No favorites yet..."}
        </p>
        <label className="relative flex h-[39px] items-center gap-1.5 rounded-full bg-white pr-3.5 pl-4 text-[16px] tracking-[-0.02em] text-muted inset-ring inset-ring-[#dbdbdb]">
          {SORTS[sort]}
          <ChevronDown size={16} strokeWidth={1.6} className="text-[#080a10]" />
          <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="absolute inset-0 cursor-pointer opacity-0" aria-label="Sort">
            {Object.entries(SORTS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </label>
      </div>
      {items.length > 0 && (
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {items.map((p, i) => (
            <Reveal key={p.slug} y={30} delay={(i % 3) * 0.08}>
              <ProductCard product={p} showNew className="h-full" imageClassName="aspect-[376/369]" sizes="(min-width: 1200px) 376px, 50vw" />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
