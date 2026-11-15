"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown, SearchIcon } from "@/components/ui/Icons";
import { useCurrency } from "@/lib/currency";
import type { ProductOption } from "@/lib/types";

type ComparisonProduct = {
  slug: string;
  title: string;
  price: number;
  type: string;
  image?: string;
  options: ProductOption[];
};

export function CompareProducts({ products }: { products: ComparisonProduct[] }) {
  const [left, setLeft] = useState("lightweight-jacket");
  const [right, setRight] = useState("zipper-jacket");
  const { formatPrice } = useCurrency();
  const columns = [
    { slug: left, other: right, select: setLeft, label: "First product" },
    { slug: right, other: left, select: setRight, label: "Second product" },
  ];

  return (
    <div className="mt-8 grid grid-cols-2 items-start gap-3 md:mt-12 md:gap-6">
      {columns.map(({ slug, other, select, label }, index) => {
        const product = products.find((item) => item.slug === slug);
        const option = (name: string) => product?.options.find((item) => item.name.toLowerCase() === name)?.values.join(", ") || "—";
        return (
          <div key={label} className="min-w-0">
            <p className="text-sm font-medium text-muted">{label}</p>
            <ProductPicker
              label={label}
              alignRight={index === 1}
              slug={slug}
              products={products.filter((item) => item.slug !== other)}
              onSelect={select}
            />
            {product && (
              <article className="mt-3 overflow-hidden rounded-xl border border-line">
                <div className="relative aspect-square bg-surface">
                  {product.image && <Image src={product.image} alt={product.title} fill sizes="(min-width: 1360px) 630px, 50vw" quality={85} className="object-cover object-top" />}
                </div>
                <div className="p-3 md:p-6">
                  <h2 className="text-base font-medium md:text-2xl">{product.title}</h2>
                  <p className="mt-1 text-sm md:text-lg">{formatPrice(product.price)}</p>
                  <dl className="mt-4 divide-y divide-line border-y border-line text-sm md:mt-6">
                    {[
                      ["Category", product.type],
                      ["Sizes", option("size")],
                      ["Colors", option("color")],
                    ].map(([name, value]) => (
                      <div key={name} className="grid gap-1 py-3 sm:grid-cols-[5rem_1fr]">
                        <dt className="text-muted">{name}</dt>
                        <dd>{value}</dd>
                      </div>
                    ))}
                  </dl>
                  <Link href={`/product/${product.slug}`} className="btn-dark mt-4 text-center md:mt-6">View product</Link>
                </div>
              </article>
            )}
          </div>
        );
      })}
    </div>
  );
}

const PAGE_SIZE = 4;

function ProductPicker({ label, slug, products, onSelect, alignRight }: {
  label: string;
  slug: string;
  products: ComparisonProduct[];
  onSelect: (slug: string) => void;
  alignRight: boolean;
}) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const product = products.find((item) => item.slug === slug);
  const term = query.trim().toLowerCase();
  const matches = products.filter((item) => item.title.toLowerCase().includes(term));
  const pageCount = Math.ceil(matches.length / PAGE_SIZE);
  const activePage = Math.min(page, Math.max(0, pageCount - 1));
  const visible = matches.slice(activePage * PAGE_SIZE, (activePage + 1) * PAGE_SIZE);

  return (
    <details
      name="compare-product"
      className="group relative mt-2"
      onToggle={(event) => {
        if (event.currentTarget.open) {
          setQuery("");
          setPage(0);
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false;
      }}
      onKeyDown={(event) => {
        if (event.key !== "Escape" || !event.currentTarget.open) return;
        event.preventDefault();
        event.currentTarget.open = false;
        event.currentTarget.querySelector("summary")?.focus();
      }}
    >
      <summary aria-label={`${label}: ${product?.title ?? "Choose a product"}`} className="flex cursor-pointer list-none items-center justify-between gap-2 rounded-xl border border-line bg-white px-3 py-3 text-sm font-medium transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 [&::-webkit-details-marker]:hidden md:px-4">
        <span className="truncate">{product?.title ?? "Choose a product"}</span>
        <ChevronDown size={16} className="shrink-0 transition-transform group-open:rotate-180" />
      </summary>
      <div className={`absolute top-full z-20 mt-2 w-[min(20rem,calc(100vw-2.5rem))] rounded-xl border border-line bg-white p-2 shadow-lg sm:w-full ${alignRight ? "right-0" : "left-0"}`}>
        <div className="flex items-center gap-2 rounded-lg bg-surface px-3">
          <SearchIcon size={16} className="shrink-0 text-muted" />
          <input
            type="search"
            aria-label={`Search ${label.toLowerCase()}`}
            placeholder="Search products"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(0);
            }}
            className="h-10 min-w-0 flex-1 bg-transparent text-sm"
          />
        </div>
        <ul className="mt-2">
        {visible.map((item) => (
          <li key={item.slug}>
            <button
              type="button"
              aria-pressed={item.slug === slug}
              onClick={(event) => {
                onSelect(item.slug);
                const picker = event.currentTarget.closest("details");
                if (picker) {
                  picker.open = false;
                  picker.querySelector("summary")?.focus();
                }
              }}
              className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs hover:bg-surface focus-visible:bg-surface aria-pressed:bg-ink aria-pressed:text-white md:gap-3 md:text-sm"
            >
              {item.image && (
                <span className="relative size-8 shrink-0 overflow-hidden rounded-md bg-surface md:size-10">
                  <Image src={item.image} alt="" fill sizes="40px" className="object-cover object-top" />
                </span>
              )}
              <span>{item.title}</span>
            </button>
          </li>
        ))}
        </ul>
        {!matches.length && <p role="status" className="px-3 py-4 text-sm text-muted">No products found</p>}
        {pageCount > 1 && (
          <div className="mt-2 flex items-center justify-between gap-2 border-t border-line pt-2 text-xs">
            <button type="button" aria-label="Previous page" aria-disabled={activePage === 0} onClick={() => setPage(Math.max(0, activePage - 1))} className="rounded-md px-2 py-2 hover:bg-surface aria-disabled:opacity-35">Previous</button>
            <span className="text-muted" aria-live="polite">{activePage + 1} / {pageCount}</span>
            <button type="button" aria-label="Next page" aria-disabled={activePage === pageCount - 1} onClick={() => setPage(Math.min(pageCount - 1, activePage + 1))} className="rounded-md px-2 py-2 hover:bg-surface aria-disabled:opacity-35">Next</button>
          </div>
        )}
      </div>
    </details>
  );
}
