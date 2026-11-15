"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { heroSlides } from "@/lib/site";
import { ArrowUpRight } from "@/components/ui/Icons";
import { SplitText } from "@/components/motion/SplitText";
import { cn } from "@/lib/format";

/** Each slide stays up ~9s in the template, with a 1s cross-fade. */
const INTERVAL = 9000;
const appear = (mounted: boolean, delay = 1.2): React.CSSProperties => ({
  opacity: mounted ? 1 : 0.001,
  transform: mounted ? "none" : "translateY(20px)",
  transition: `opacity .4s cubic-bezier(.12,.23,.5,1) ${delay}s, transform .4s cubic-bezier(.12,.23,.5,1) ${delay}s`,
});

export function Hero() {
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (heroSlides.length < 2) return;
    const t = setTimeout(() => setActive((i) => (i + 1) % heroSlides.length), INTERVAL);
    return () => clearTimeout(t);
  }, [active]);

  return (
    <section
      data-section="Hero"
      className="relative isolate -mt-[var(--hdr)] h-[min(65vh,550px)] overflow-hidden text-white md:h-[70vh] lg:h-[90vh]"
      aria-roledescription="carousel"
    >
      {heroSlides.map((s, i) => (
        <div
          key={s.image}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-[cubic-bezier(.44,0,.56,1)]",
            i === active ? "z-[1] opacity-100" : "pointer-events-none z-0 opacity-0",
          )}
          aria-hidden={i !== active}
        >
          <Image
            src={s.image}
            alt=""
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: s.position }}
          />

          <div className="absolute inset-x-0 bottom-0 mx-auto max-w-site px-5 pt-[60px] pb-[51px] md:px-[30px] md:pb-[68px] lg:px-[50px] lg:pt-20">
            <SplitText
              as="h1"
              text={s.title}
              play={i === active}
              className="block text-[44px] leading-none font-medium tracking-[-0.03em] md:text-[62px] lg:text-[80px]"
              from="x"
              stagger={0.05}
              duration={0.4}
            />
            <SplitText
              as="p"
              text={s.text}
              play={i === active}
              className="mt-2 block max-w-[300px] text-[16px] leading-[1.2] font-[400] tracking-[-0.03em] md:max-w-[600px] md:text-[20px] lg:text-[24px]"
              from="y"
              stagger={0.01}
              startDelay={0.6}
              duration={0.4}
            />
            <div className="mt-7" style={appear(mounted && i === active, i === 0 ? 1.2 : 0.8)}>
              <Link href={s.href} className="btn-light">
                Shop Now
              </Link>
            </div>
          </div>

          <div className="absolute right-[30px] bottom-[30px] hidden md:block" style={appear(mounted && i === active, i === 0 ? 1.2 : 0.8)}>
            <Link
              href={s.card.href}
              className="group flex w-[276px] items-center gap-3 rounded-lg bg-white p-2.5 text-ink inset-ring inset-ring-[#dbdbdb]"
            >
              <span className="relative size-20 shrink-0 overflow-hidden rounded-[5px] bg-surface">
                <Image src={s.card.image} alt="" fill sizes="80px" className="object-cover transition-transform duration-500 ease-[cubic-bezier(.44,0,.56,1)] group-hover:scale-[1.08]" />
              </span>
              <span className="flex flex-col gap-[18px]">
                <span className="text-[16px] leading-none tracking-[-0.03em]">{s.card.title}</span>
                <span className="flex items-center gap-2.5 text-[14.73px] leading-[0.96] font-medium tracking-[-0.03em] text-[#6f6f6f]">
                  Shop now <ArrowUpRight size={10} className="mt-0.5" />
                </span>
              </span>
            </Link>
          </div>
        </div>
      ))}

      {/* progress indicators */}
      <div className="absolute inset-x-0 bottom-6 z-[2] flex justify-center gap-2.5 md:bottom-10">
        {heroSlides.map((s, i) => (
          <button
            key={s.image}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === active}
            className="relative h-[3px] w-[34px] overflow-hidden rounded-full bg-white/45 md:h-1 md:w-11"
          >
            {i === active && (
              <span
                key={active}
                className="absolute inset-y-0 left-0 rounded-full bg-white"
                style={{ animation: `hero-progress ${INTERVAL}ms linear forwards` }}
              />
            )}
          </button>
        ))}
      </div>

      <style>{`@keyframes hero-progress { from { width: 0 } to { width: 100% } }`}</style>
    </section>
  );
}
