"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { productPreviewImages } from "@/lib/product-preview";
import { getProduct } from "@/lib/data";
import { videoShowcase } from "@/lib/site";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/format";
import { ArrowUpRight } from "@/components/ui/Icons";
import { useInViewOnce } from "@/components/motion/Reveal";

/** Original TRYLIVO film with category links and floating product cards. */
export function VideoShowcase() {
  const video = useRef<HTMLVideoElement>(null);
  const [sectionRef, inView] = useInViewOnce<HTMLElement>("200px 0px");
  const featured = videoShowcase.featured.map(getProduct).filter(Boolean) as Product[];

  useEffect(() => {
    if (inView) video.current?.play().catch(() => {});
  }, [inView]);

  return (
    <section ref={sectionRef} data-section="Video" className="section-y">
      <div className="video-showcase-frame relative isolate overflow-hidden bg-ink text-white">
        <video
          ref={video}
          className="absolute inset-0 -z-10 h-full w-full object-contain"
          src={inView ? videoShowcase.video : undefined}
          poster={videoShowcase.poster}
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          aria-hidden="true"
        />

        <nav className="flex flex-wrap justify-center gap-x-4 gap-y-px px-2.5 pt-[34px] md:gap-x-[26px] md:gap-y-1 md:px-5 md:pt-16 lg:gap-x-7" aria-label="Shop by category">
          {videoShowcase.tabs.map((t) => (
            <Link
              key={t.label}
              href={t.href}
              className="relative pb-2 text-[24px] leading-[0.9] font-semibold tracking-[-0.03em] text-white/80 transition-colors hover:text-white focus-visible:text-white md:text-[48px] lg:text-[56px]"
            >
              {t.label}
            </Link>
          ))}
        </nav>

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-end px-6 pb-6 md:justify-between md:px-[30px] md:pb-[30px] lg:px-10 lg:pb-10">
          {featured.map((p, i) => (
            <FloatCard key={p.slug} product={p} className={i === 0 ? "max-md:hidden" : undefined} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FloatCard({ product, className }: { product: Product; className?: string }) {
  const [a, b] = productPreviewImages(product);
  return (
    <Link
      href={`/product/${product.slug}`}
      className={cn("group relative flex w-[135px] flex-col overflow-hidden rounded-[4px] bg-white text-ink md:w-[233px] md:rounded-lg", className)}
      style={{
        maskImage: "linear-gradient(to right, transparent, #000 3px, #000 calc(100% - 3px), transparent), linear-gradient(to bottom, transparent, #000 3px, #000 calc(100% - 3px), transparent)",
        maskComposite: "intersect",
      }}
    >
      <span className="relative block aspect-[135/131] bg-[#f5f5f5] md:aspect-[233/222]">
        {a && <Image src={a.src} alt={product.title} fill sizes="233px" className="object-cover transition-opacity duration-500 group-hover:opacity-0" />}
        {b && <Image src={b.src} alt="" aria-hidden fill sizes="233px" className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100" />}
      </span>
      <span className="flex flex-col gap-0.5 px-2 py-1.5 md:px-4 md:py-2.5">
        <span className="text-[12px] leading-[1.1] font-medium md:text-[16px]">{product.title}</span>
        {/* the template keeps an (empty) price row under the title */}
        <span className="h-3.5 md:h-[18px]" aria-hidden />
      </span>
      <span className="absolute right-2.5 bottom-2.5 hidden size-[30px] place-items-center overflow-hidden rounded-full border border-[#ece9e7] bg-white text-[#5e5e5e] md:grid">
        <ArrowUpRight size={12} className="transition-transform duration-300 group-hover:translate-x-5 group-hover:-translate-y-5" />
        <ArrowUpRight size={12} className="absolute -translate-x-5 translate-y-5 transition-transform duration-300 group-hover:translate-x-0 group-hover:translate-y-0" />
      </span>
    </Link>
  );
}
