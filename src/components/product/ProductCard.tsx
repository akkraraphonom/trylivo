"use client";

import cardImagePaths from "@/data/card-images.json";
import detailImagePaths from "@/data/product-detail-images.json";

import { useCurrency } from "@/lib/currency";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { productImagesForColor } from "@/lib/product-preview";
import type { Product } from "@/lib/types";
import { colorOptions, isNew } from "@/lib/data";
import { cn, swatch } from "@/lib/format";
import { WishlistButton } from "./WishlistButton";

const cardImages: Record<string, string> = cardImagePaths;
const detailImages = new Set(detailImagePaths);

/**
 * Product card (Framer "Card" component): image on #f5f5f5, "New" tag, round
 * wishlist button, hover swaps to the second photo. Home sliders show the
 * price and colour swatches consistently across all product listings.
 */
export function ProductCard({
  product,
  className,
  imageClassName = "aspect-[401/412]",
  sizes = "(min-width: 1200px) 400px, (min-width: 810px) 50vw, 90vw",
  imageQuality,
  highResolution = false,
  revealWishlist,
  showMeta = true,
  showDiscount = false,
  showNew = false,
  compact = false,
}: {
  product: Product;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  imageQuality?: number;
  /** Use the full-detail source for large editorial tiles. */
  highResolution?: boolean;
  /** hide the heart until the card is hovered */
  revealWishlist?: boolean;
  showMeta?: boolean;
  showDiscount?: boolean;
  /** "New" tag — only the New Arrivals slider shows it on the home page */
  showNew?: boolean;
  /** tile variant (Seasonal Drop): 16px title below desktop */
  compact?: boolean;
}) {
  const cardRef = useRef<HTMLElement>(null);
  const [nearViewport, setNearViewport] = useState(false);
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setNearViewport(true); observer.disconnect(); }
    }, { rootMargin: "1600px 0px" });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const { formatPrice } = useCurrency();
  const colors = colorOptions(product);
  const [selectedColor, setSelectedColor] = useState<string>();
  const color = colors.includes(selectedColor ?? "") ? selectedColor : colors[0];
  const [primary, secondary] = productImagesForColor(product, color);
  const imageSource = (src: string) => cardImages[src] ?? (highResolution && detailImages.has(src) ? src.replace("/images/", "/images/detail/") : src);
  const swap = secondary && secondary !== primary;
  const comparePrice = product.comparePrice ?? 0;
  const onSale = comparePrice > product.price;
  const hasDiscount = showDiscount && onSale;
  const hasNew = showNew && isNew(product);
  const productPath = `/product/${product.slug}`;
  const href = color && color !== colors[0] ? `${productPath}?color=${encodeURIComponent(color)}` : productPath;

  return (
    <article
      ref={cardRef}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl bg-white shadow-[0_0_3.8px_1px_rgba(0,0,0,0.04),0_0_0_1px_rgba(0,0,0,0.04)]",
        className,
      )}
    >
      <Link href={href} aria-label={product.title} className={cn("group/photo relative block w-full overflow-hidden bg-[#f5f5f5]", imageClassName)}>
        {primary && (
          <Image
            src={imageSource(primary.src)}
            alt={product.title}
            fill
            sizes={sizes}
            quality={imageQuality}
            loading={nearViewport ? "eager" : "lazy"}
            decoding="async"
            className={cn("object-cover transition-opacity duration-500 ease-[cubic-bezier(.44,0,.56,1)]", swap && "group-hover/photo:opacity-0")}
          />
        )}
        {swap && (
          <Image
            src={imageSource(secondary.src)}
            alt=""
            aria-hidden
            fill
            sizes={sizes}
            quality={imageQuality}
            loading={nearViewport ? "eager" : "lazy"}
            decoding="async"
            className="object-cover opacity-0 transition-opacity duration-500 ease-[cubic-bezier(.44,0,.56,1)] group-hover/photo:opacity-100"
          />
        )}
      </Link>

      {(hasNew || hasDiscount) && (
        <div className="pointer-events-none absolute top-3 left-3 flex items-center gap-1.5 text-[11px] leading-none font-medium">
          {hasDiscount && <span className="rounded-full bg-[#cf2026] px-2 py-1 text-white">-{Math.round((1 - product.price / comparePrice) * 100)}%</span>}
          {hasNew && <span className="rounded-full border border-[#ece9e7] bg-white px-2.5 py-1">New</span>}
        </div>
      )}
      <WishlistButton slug={product.slug} reveal={revealWishlist} className="absolute top-3 right-3 z-[2]" />

        <div data-product-label className={cn("flex flex-1 flex-col justify-start", showMeta ? "gap-0.5 px-3 py-2.5 sm:px-4 sm:py-3" : "min-h-[59px] gap-1.5 px-4 pt-4 pb-[15px]")}>
          <Link href={href} className={cn("leading-[1.2] font-medium", compact ? "text-[16px] lg:text-[18px]" : "text-[18px]")}>
            {product.title}
          </Link>
          {showMeta && (
            <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-0.5">
              <p className="flex flex-wrap items-baseline gap-x-2 text-[14px] tracking-[-0.02em] sm:text-[16px]">
                <span>{formatPrice(product.price)}</span>
                {onSale && <span className="text-muted line-through">{formatPrice(comparePrice)}</span>}
              </p>
              {colors.length > 0 && (
                <div role="group" aria-label={`${product.title} colors`} className="ml-auto flex flex-wrap items-center gap-0.5">
                  {colors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      title={c}
                      aria-label={`Show ${c}`}
                      aria-pressed={color === c}
                      onClick={() => setSelectedColor(c)}
                      className="grid size-[26px] shrink-0 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ink"
                    >
                      <span aria-hidden="true" className={cn("size-[18px] rounded-full border border-black/15 ring-offset-1 transition-shadow", color === c && "ring-1 ring-ink")} style={{ backgroundColor: swatch(c) }} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
    </article>
  );
}
