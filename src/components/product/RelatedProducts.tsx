"use client";

import type { Product } from "@/lib/types";
import { Slider, SliderArrows } from "@/components/ui/Slider";
import { ProductCard } from "./ProductCard";
import { Reveal, revealStyle, useInViewOnce } from "@/components/motion/Reveal";

/** "You May Also Like": heading + text, then a 4-up slider (arrows above on desktop, below on phones). */
export function RelatedProducts({ products }: { products: Product[] }) {
  const [ref, inView] = useInViewOnce<HTMLDivElement>();
  return (
    <section data-section="Related Prodct" className="container-site section-y">
      <Reveal className="flex flex-col gap-3">
        <h2 className="h-section">You May Also Like</h2>
        <p className="lead max-w-[489px]">Discover more styles curated just for you based on your interests and recent favorites.</p>
      </Reveal>
      <div ref={ref} className="mt-2">
        <Slider
          gap={16}
          className="mt-6 md:mt-px"
          viewportClassName="mx-1 mt-1 mb-1 md:mt-[25px]"
          controls={(api) => (
            <div className="hidden h-[34px] items-center justify-end md:flex">
              <SliderArrows {...api} tone="white" />
            </div>
          )}
          footer={(api) => <SliderArrows {...api} tone="white" size={38} className="mt-4 justify-center md:hidden" />}
        >
          {products.map((p, i) => (
            <div key={p.slug} style={revealStyle(inView, 30, Math.min(i, 3) * 0.1)} className="w-full shrink-0 md:w-[calc((100%-16px)/2)] lg:w-[calc((100%-48px)/4)]">
              <ProductCard product={p} className="h-full" imageClassName="aspect-[342/369] md:aspect-[458/514] lg:aspect-[301/317]" sizes="(min-width: 1200px) 300px, (min-width: 810px) 460px, 90vw" />
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}
