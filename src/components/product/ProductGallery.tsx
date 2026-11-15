"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import detailImagePaths from "@/data/product-detail-images.json";
import type { ImageAsset } from "@/lib/types";
import { cn } from "@/lib/format";
import { ChevronLeft, ChevronRight } from "@/components/ui/Icons";

const detailImages = new Set(detailImagePaths);

/**
 * Product images: thumbnail column + sliding main image with round arrows on
 * tablet/desktop; swipeable main image with a dot pill on phones.
 */
export function ProductGallery({
  images,
  title,
  activeIndex,
  badge,
}: {
  images: ImageAsset[];
  title: string;
  /** Controlled from the colour picker; the user can still browse freely. */
  activeIndex: number;
  badge?: string;
}) {
  const [index, setIndex] = useState(activeIndex);
  useEffect(() => setIndex(activeIndex), [activeIndex]);
  const touch = useRef<number | null>(null);

  const last = images.length - 1;
  const go = (d: number) => setIndex((i) => Math.min(last, Math.max(0, i + d)));
  const arrow =
    "absolute top-1/2 z-[1] grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white inset-ring inset-ring-[rgba(3,6,7,0.08)] transition-opacity disabled:opacity-70 hover:enabled:opacity-80";

  return (
    <div className="flex min-w-0 flex-col-reverse gap-3 lg:flex-row">
      {images.length > 1 && (
        <div className="hidden shrink-0 gap-2 md:flex lg:w-[72px] lg:flex-col">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === index}
              className={cn("relative size-[72px] overflow-hidden rounded-lg border bg-[#f5f5f5]", "transition-colors", i === index ? "border-ink" : "border-transparent hover:border-[#757575]")}
            >
              <Image src={img.src} alt="" fill sizes="72px" className="rounded-[6.75px] object-contain p-px" />
            </button>
          ))}
        </div>
      )}

      <div
        className="relative aspect-[350/360] min-w-0 flex-1 overflow-hidden rounded-lg bg-[#f5f5f5] md:aspect-[462/451] lg:aspect-[644/650]"
        onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touch.current === null) return;
          const dx = e.changedTouches[0].clientX - touch.current;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
          touch.current = null;
        }}
      >
        <div
          className="flex h-full gap-1 transition-transform duration-500 ease-[cubic-bezier(.44,0,.56,1)]"
          style={{ transform: `translateX(calc(${-index} * (100% + 4px)))` }}
        >
          {images.map((img, i) => (
            <div key={img.src} className="relative h-full w-full shrink-0">
              <Image
                src={detailImages.has(img.src) ? img.src.replace("/images/", "/images/detail/") : img.src}
                alt={i === 0 ? title : ""}
                fill
                priority={i === 0}
                unoptimized={detailImages.has(img.src)}
                quality={85}
                sizes="(min-width: 1200px) 644px, (min-width: 810px) 60vw, 100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {badge && (
          <span className="absolute top-5 right-5 rounded-full bg-white px-2.5 py-1 text-[12px] leading-[1.2] font-medium tracking-[-0.02em] inset-ring inset-ring-[#ece9e7]">
            {badge}
          </span>
        )}

        {images.length > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} disabled={index === 0} aria-label="Previous image" className={cn(arrow, "left-5 hidden md:grid")}>
              <ChevronLeft size={18} />
            </button>
            <button type="button" onClick={() => go(1)} disabled={index === last} aria-label="Next image" className={cn(arrow, "right-5 hidden md:grid")}>
              <ChevronRight size={18} />
            </button>
            <div className="absolute bottom-3 left-1/2 flex h-5 -translate-x-1/2 items-center gap-1.5 rounded-full bg-white px-2 md:hidden">
              {images.map((img, i) => (
                <button
                  key={img.src}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show image ${i + 1}`}
                  className={cn("size-1.5 rounded-full transition-colors", i === index ? "bg-ink" : "bg-ink/25")}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
