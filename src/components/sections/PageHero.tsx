"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/format";
import { SplitText } from "@/components/motion/SplitText";

/**
 * Full-bleed banner under the transparent header (shop, journal, about,
 * search, wishlist, posts). The photo drifts at 40% of the scroll speed like
 * the template's parallax "BG" layer; titles use the per-character appear.
 *
 * variant:
 *  - "bottom": title (and optional text) bottom-left — collections, about
 *  - "center": centred title + text — category, journal, wishlist, search, posts
 */
export function PageHero({
  image,
  imageQuality,
  unoptimized,
  mobileImage,
  title,
  text,
  eyebrow,
  position,
  variant = "center",
  tall,
  className,
}: {
  image: string;
  imageQuality?: number;
  unoptimized?: boolean;
  mobileImage?: string;
  title: string;
  text?: string;
  eyebrow?: string;
  position?: string;
  variant?: "bottom" | "center";
  /** 100vh (About) instead of 80vh */
  tall?: boolean;
  className?: string;
}) {
  const bg = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bg.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, el.parentElement?.offsetHeight ?? 1000);
        el.style.transform = `translate3d(0,${y * 0.4}px,0)`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const titleCls = "block text-[44px] leading-[1.01] font-medium tracking-[-0.03em] md:text-[64px] lg:text-[80px]";

  return (
    <section
      data-section="Hero"
      className={cn(
        "relative isolate -mt-[var(--hdr)] flex overflow-hidden text-white",
        tall ? "h-[min(65vh,550px)] md:h-[100svh] md:min-h-[560px]" : "h-[min(65vh,550px)] md:h-[70vh] lg:h-[80vh]",
        className,
      )}
    >
      <div ref={bg} className="absolute inset-0 -z-10 will-change-transform">
        <picture>
          {mobileImage && <source media="(max-width: 767px)" srcSet={mobileImage} />}
          <Image
            src={image}
            alt=""
            fill
            priority={!mobileImage}
            fetchPriority={mobileImage ? "high" : undefined}
            loading={mobileImage ? "eager" : undefined}
            sizes="100vw"
            quality={imageQuality}
            unoptimized={unoptimized}
            className={cn("object-cover", mobileImage && "max-md:!object-center")}
            style={{ objectPosition: position ?? "50% 50%" }}
          />
        </picture>
      </div>

      {variant === "bottom" ? (
        <div className="mx-auto flex w-full max-w-site flex-col justify-end gap-7 px-5 pt-[94px] pb-11 md:px-[30px] md:pb-16 lg:gap-8 lg:px-[50px] lg:pb-[90px]">
          <SplitText as="h1" text={title} className={cn(titleCls, "max-w-[653px]")} from="x" stagger={0.05} />
          {text && (
            <SplitText
              as="p"
              text={text}
              className="block max-w-[585px] text-[20px] leading-[1.2] font-medium tracking-[-0.02em] lg:text-[24px]"
              from="y"
              stagger={0.01}
              startDelay={0.4}
            />
          )}
        </div>
      ) : (
        <div className="flex w-full flex-col items-center justify-center gap-6 px-5 pt-[94px] pb-11 text-center md:px-[30px] md:pt-[110px] md:pb-16 lg:px-[50px] lg:pt-[138px] lg:pb-[108px]">
          <div className="flex flex-col items-center gap-1.5">
            {eyebrow && <p className="text-[16px] leading-[1.2] font-medium tracking-[-0.02em] md:text-[20px]">{eyebrow}</p>}
            <SplitText as="h1" text={title} className={cn(titleCls, "max-w-[800px]")} from="x" stagger={0.05} />
          </div>
          {text && (
            <SplitText
              as="p"
              text={text}
              className={cn(
                "block max-w-[473px] text-[16px] leading-[1.2] tracking-[-0.02em] md:text-[18px] lg:text-[20px]",
                eyebrow ? "font-medium" : "font-normal",
              )}
              from="y"
              stagger={0.01}
              startDelay={0.4}
            />
          )}
        </div>
      )}
    </section>
  );
}
