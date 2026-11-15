"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { getProduct } from "@/lib/data";
import { bestSellerTabs, bestSellersOrder, newArrivalsOrder, seasonalDrop } from "@/lib/site";
import { cn } from "@/lib/format";
import { Slider, SliderArrows } from "@/components/ui/Slider";
import { ProductCard } from "@/components/product/ProductCard";
import { Reveal, revealStyle, useInViewOnce } from "@/components/motion/Reveal";

const best = bestSellersOrder.map(getProduct).filter((product) => product !== undefined).map((product) => {
  const { slug } = product;
  const fromNewArrivals = newArrivalsOrder.includes(slug);
  const prefix = fromNewArrivals ? "new-arrival" : seasonalDrop.products.includes(slug) ? "seasonal" : "best-seller";
  const image = `/images/${prefix}-${slug}`;
  return {
    ...product,
    images: [
      { src: `${image}-2x.webp`, width: 2508, height: 2508 },
      { src: `${image}-hover-2x${fromNewArrivals ? "-v2" : ""}.webp`, width: 2508, height: 2508 },
      ...product.images.slice(2),
    ],
  };
});

export function BestSellers() {
  const [tab, setTab] = useState("All");
  const [ref, inView] = useInViewOnce<HTMLDivElement>();
  const list = useMemo(() => (tab === "All" ? best : best.filter((p) => p.type === tab)), [tab]);
  const viewMore = tab === "All" ? "/shop/collection/best-sellers" : `/shop/category/${tab.toLowerCase()}`;

  return (
    <section data-section="Best Sellers" className="container-site section-y">
      <Reveal as="h2" className="h-section">
        Best Sellers
      </Reveal>
      <div ref={ref} className="mt-9 md:mt-10 lg:mt-12">
        <div className="no-scrollbar flex gap-2.5 overflow-x-auto" role="tablist">
          {bestSellerTabs.map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={cn(
                "shrink-0 rounded-full px-3 py-[3px] text-[16px] leading-[1.2] transition-colors duration-200 md:px-5 md:py-[5px]",
                tab === t ? "bg-ink text-white" : "bg-surface text-ink",
              )}
            >
              {t}
            </button>
          ))}
        </div>
        <Slider
          key={tab}
          gap={16}
          className="mt-[27px] md:mt-[25px] lg:mt-px"
          viewportClassName="mx-1 mt-1 mb-1 md:mt-[25px]"
          controls={(api) => (
            <div className="hidden h-[34px] items-center justify-end gap-2 md:flex">
              <Link href={viewMore} className="text-[14px] leading-[1.2] font-medium tracking-[-0.02em] text-muted">
                View More
              </Link>
              <SliderArrows {...api} tone="white" />
            </div>
          )}
          footer={(api) => <SliderArrows {...api} tone="white" size={38} className="mt-4 mb-[5px] justify-center md:hidden" />}
        >
          {list.map((p, i) => (
            <div
              key={p.slug}
              style={revealStyle(inView, 30, Math.min(i, 3) * 0.1)}
              className="w-full shrink-0 md:w-[calc((100%-16px)/2)] lg:w-[calc((100%-48px)/4)]"
            >
              <ProductCard product={p} className="h-full" imageQuality={85} imageClassName="aspect-[342/369] md:aspect-[458/514] lg:aspect-[301/317]" sizes="(min-width: 1200px) 300px, (min-width: 810px) 460px, 90vw" />
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}
