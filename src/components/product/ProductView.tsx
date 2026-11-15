"use client";

import { useCurrency } from "@/lib/currency";

import { TryOns } from "./TryOns";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { lockScroll } from "@/components/motion/SmoothScroll";
import type { Product, RichNode } from "@/lib/types";
import { colorOptions, isNew, sizeOptions, slugify } from "@/lib/data";
import { productImagesForColor } from "@/lib/product-preview";
import { productPerks } from "@/lib/site";
import { useStore } from "@/lib/store";
import { cn, swatch } from "@/lib/format";
import { ChevronDown, CloseIcon, RulerIcon } from "@/components/ui/Icons";
import { RichText } from "@/components/ui/RichText";
import { QtyStepper } from "@/components/cart/CartDrawer";
import { ProductGallery } from "./ProductGallery";
import { WishlistButton } from "./WishlistButton";

function ProductColorFromUrl({ colors, onSelect }: { colors: string[]; onSelect: (color: string) => void }) {
  const requested = useSearchParams().get("color");

  useEffect(() => {
    const color = requested && colors.includes(requested) ? requested : colors[0];
    if (color) onSelect(color);
  }, [colors, onSelect, requested]);

  return null;
}

export function ProductView({ product, sizeGuide }: { product: Product; sizeGuide: RichNode[] }) {
  const { formatPrice } = useCurrency();
  const colors = colorOptions(product);
  const sizes = sizeOptions(product);
  const [color, setColor] = useState(colors[0]);
  const [size, setSize] = useState<string | undefined>(sizes.length === 1 ? sizes[0] : undefined);
  const [qty, setQty] = useState(1);
  const [guideOpen, setGuideOpen] = useState(false);
  const [error, setError] = useState("");
  const { addToCart, checkout } = useStore();
  const images = productImagesForColor(product, color);

  useEffect(() => {
    if (!guideOpen) return;
    lockScroll(true);
    return () => lockScroll(false);
  }, [guideOpen]);

  const variant = useMemo(() => {
    const title = [color, size].filter(Boolean).join(" / ");
    return product.variants.find((v) => v.title === title);
  }, [product.variants, color, size]);

  const onSale = product.comparePrice && product.comparePrice > product.price;
  const discount = onSale ? Math.round((1 - product.price / product.comparePrice!) * 100) : 0;

  const add = (buyNow = false) => {
    if (sizes.length && !size) {
      setError("Please select a size.");
      return;
    }
    setError("");
    addToCart({
      slug: product.slug,
      variantId: variant?.id ?? `${product.id}-${color ?? ""}-${size ?? ""}`,
      variantTitle: [color, size].filter(Boolean).join(" / ") || "Default",
      qty,
    });
    if (buyNow) checkout();
  };

  const crumb = "text-muted transition-colors hover:text-[#5c5c5c]";
  return (
    <section data-section="Main Content" className="container-site pt-[18px] pb-[68px] md:pb-[76px] lg:pt-4 lg:pb-[84px]">
      <Suspense fallback={null}>
        <ProductColorFromUrl colors={colors} onSelect={setColor} />
      </Suspense>
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[14px] leading-[1.2] font-medium tracking-[-0.02em] md:text-[16px] lg:text-[18px]">
        <Link href="/" className={cn(crumb, "whitespace-pre")}>
          {"Home  >"}
        </Link>
        <Link href="/shop/collection/all" className={crumb}>
          Product &gt;
        </Link>
        <Link href={`/shop/category/${slugify(product.type)}`}>{product.type}</Link>
      </nav>

      <div className="mt-5 grid grid-cols-1 gap-9 md:mt-7 md:grid-cols-2 md:gap-4 lg:grid-cols-[minmax(0,728fr)_minmax(0,516fr)]">
        <ProductGallery
          key={color}
          images={images}
          title={product.title}
          activeIndex={0}
          badge={isNew(product) ? "New" : undefined}
        />

        <div className="flex min-w-0 flex-col gap-10 md:sticky md:top-24 md:self-start lg:pl-8">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-4">
              <h1 className="text-[28px] leading-[1.1] tracking-[-0.03em] md:text-[30px] lg:text-[32px]">{product.title}</h1>
              <p className="flex items-baseline gap-2.5 text-[18px] leading-[1.2] tracking-[-0.02em] md:text-[20px]">
                <span>{formatPrice(product.price)}</span>
                {onSale && (
                  <>
                    <span className="text-[16px] text-muted line-through">{formatPrice(product.comparePrice!)}</span>
                    <span className="rounded-full bg-sale/10 px-2 py-0.5 text-[12px] text-sale">-{discount}%</span>
                  </>
                )}
              </p>
            </div>
            <p className="text-[14px] leading-[1.2] tracking-[-0.02em] text-muted md:text-[16px]">{product.excerpt}</p>
          </div>

          <div className="flex flex-col gap-6">
            {colors.length > 0 && (
              <fieldset className="flex min-w-0 flex-col gap-2.5">
                <legend className="mb-2.5 text-[14px] leading-[1.2] tracking-[-0.02em] text-muted md:text-[16px]">
                  Color: <span className="text-ink">{color}</span>
                </legend>
                <div className="flex flex-wrap gap-2">
                  {colors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      title={c}
                      aria-label={c}
                      aria-pressed={c === color}
                      onClick={() => setColor(c)}
                      className={cn(
                        "grid size-8 place-items-center rounded-full border bg-white transition-colors",
                        c === color ? "border-ink" : "border-[rgba(3,6,7,0.12)] hover:border-ink/40",
                      )}
                    >
                      <span className="size-[22px] rounded-full" style={{ backgroundColor: swatch(c) }} />
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            {sizes.length > 0 && (
              <fieldset className="flex min-w-0 flex-col">
                <legend className="mb-2.5 text-[14px] leading-[1.2] tracking-[-0.02em] text-muted md:text-[16px]">
                  Size{size && <span className="text-ink">: {size}</span>}
                </legend>
                <div className="flex flex-wrap gap-[5px]">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      aria-pressed={s === size}
                      onClick={() => {
                        setSize(s);
                        setError("");
                      }}
                      className={cn(
                        "h-8 min-w-[64px] rounded-full border px-3 text-[14px] transition-colors",
                        s === size ? "border-ink bg-ink text-white" : "border-[#dbdbdb] bg-white hover:border-ink",
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            <div className="flex min-w-0 flex-col gap-2.5">
              <p className="text-[14px] leading-[1.2] tracking-[-0.02em] text-muted md:text-[16px]">Quantity</p>
              <div className="self-start">
                <QtyStepper value={qty} onChange={setQty} />
              </div>
            </div>

            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => add()}
                    className="h-11 min-w-0 flex-1 max-w-[166px] rounded-full bg-white text-[16px] tracking-[-0.02em] inset-ring inset-ring-ink md:h-12"
                  >
                    Add to Cart
                  </button>
                  <button
                    type="button"
                    onClick={() => add(true)}
                    className="h-11 min-w-0 flex-1 max-w-[166px] rounded-full bg-ink text-[16px] font-medium tracking-[-0.02em] text-white md:h-12"
                  >
                    Buy Now
                  </button>
                </div>
                {error && (
                  <p className="text-[14px] text-sale" role="alert">
                    {error}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <WishlistButton slug={product.slug} withLabel />
                <button
                  type="button"
                  onClick={() => setGuideOpen(true)}
                  className="inline-flex items-center gap-2 text-[16px] leading-[1.2] font-medium tracking-[-0.02em]"
                >
                  <RulerIcon size={20} /> Size guide
                </button>
                {images[0] && <TryOns key={`${product.slug}-${color}`} product={product} color={color} />}
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Perks />
          </div>
        </div>
      </div>

      {guideOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4" role="dialog" aria-modal="true" aria-label="Size guide">
          <button type="button" aria-label="Close size guide" className="absolute inset-0 bg-black/40 animate-fade-in" onClick={() => setGuideOpen(false)} />
          <div className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 animate-fade-in md:p-8" data-lenis-prevent>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-2xl tracking-[-0.03em]">Size guide</h2>
              <button type="button" onClick={() => setGuideOpen(false)} aria-label="Close">
                <CloseIcon size={22} />
              </button>
            </div>
            <RichText nodes={sizeGuide} className="prose-ecom [&>h4:first-child]:mt-2" />
          </div>
        </div>
      )}
    </section>
  );
}

/** "Free Shipping Worldwide" / returns / materials — collapsible rows with 2px rules. */
function Perks() {
  const [open, setOpen] = useState(-1);
  return (
    <div className="flex flex-col gap-5">
      {productPerks.map((p, i) => {
        const isOpen = open === i;
        return (
          <div key={p.title} className="flex flex-col gap-[22px]">
            <button type="button" onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen} className="flex flex-col text-left">
              <span className="flex items-center justify-between">
                <span className="text-[18px] leading-[1.2] tracking-[-0.02em] md:text-[20px]">{p.title}</span>
                <ChevronDown size={18} strokeWidth={1.4} className={cn("ml-2.5 shrink-0 text-[#080a10] transition-transform duration-300", isOpen && "rotate-180")} />
              </span>
              <span className={cn("grid transition-[grid-template-rows,opacity] duration-300", isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
                <span className="min-h-0 overflow-hidden">
                  <span className="block pt-2.5 text-[16px] leading-[1.2] tracking-[-0.02em] text-muted">{p.text}</span>
                </span>
              </span>
            </button>
            <span className={cn("h-0.5", isOpen ? "bg-[#dbdbdb]" : "bg-[#e3e3e3]")} />
          </div>
        );
      })}
    </div>
  );
}
