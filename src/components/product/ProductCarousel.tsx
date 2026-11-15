"use client";

import Link from "next/link";
import type { Product } from "@/lib/types";
import { Slider, SliderArrows } from "@/components/ui/Slider";
import { ProductCard } from "./ProductCard";
import { Reveal, revealStyle, useInViewOnce } from "@/components/motion/Reveal";

/**
 * "New Arrival is here" / "Related Products".
 * Phone: the first four cards stacked. Tablet/desktop: a looping slideshow
 * (2 / 3 cards) with "View More" and arrows above its right edge.
 */
export function ProductCarousel({
  title,
  products,
  viewMoreHref,
  section = "New Arrivals",
  loop = true,
  showNew = false,
  showMeta = true,
}: {
  title: string;
  products: Product[];
  viewMoreHref?: string;
  section?: string;
  loop?: boolean;
  showNew?: boolean;
  showMeta?: boolean;
}) {
  const [ref, inView] = useInViewOnce<HTMLDivElement>();
  const viewMore = viewMoreHref && (
    <Link href={viewMoreHref} className="text-[14px] leading-[1.2] font-medium tracking-[-0.02em] text-muted">
      View More
    </Link>
  );
  return (
    <section data-section={section} className="container-site section-y md:pb-[68px] lg:pb-[84px]">
      <Reveal as="h2" className="h-section">
        {title}
      </Reveal>

      {/* phone */}
      <div className="mt-[26px] flex flex-col items-end gap-4 px-1 pb-1 md:hidden">
        {viewMore}
        <div className="flex w-full flex-col gap-5">
          {products.slice(0, 4).map((p, i) => (
            <Reveal key={p.slug} y={30} delay={i * 0.05}>
              <ProductCard product={p} showNew={showNew} showMeta={showMeta} showDiscount={showMeta} imageClassName="aspect-[342/391]" sizes="90vw" />
            </Reveal>
          ))}
        </div>
      </div>

      {/* tablet + desktop */}
      <div ref={ref} className="hidden md:block">
        <Slider
          loop={loop}
          gap={24}
          className="mt-6"
          viewportClassName="mx-1 mb-1"
          controls={(api) => (
            <div className="mx-1 mb-5 mt-0.5 flex h-[34px] items-center justify-end gap-2">
              {viewMore}
              <SliderArrows {...api} />
            </div>
          )}
        >
          {products.map((p, i) => (
            <div key={p.slug} style={revealStyle(inView, 30, (i % 3) * 0.1)} className="w-[calc((100%-24px)/2)] shrink-0 lg:w-[calc((100%-48px)/3)]">
              <ProductCard product={p} className="h-full" showNew={showNew} showMeta={showMeta} showDiscount={showMeta} imageClassName="aspect-[454/394] lg:aspect-[401/393]" />
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}
