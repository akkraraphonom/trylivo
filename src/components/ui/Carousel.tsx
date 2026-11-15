"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "./Icons";
import { cn } from "@/lib/format";

/**
 * Scroll-snap carousel. Arrows can be rendered by the parent via the
 * `controls` render prop (so they can sit in a section header) or inline.
 */
export function Carousel({
  children,
  className,
  trackClassName,
  controls,
}: {
  children: React.ReactNode;
  className?: string;
  trackClassName?: string;
  controls?: (api: { prev: () => void; next: () => void; canPrev: boolean; canNext: boolean }) => React.ReactNode;
}) {
  const track = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    update();
    const el = track.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const scrollBy = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const first = el.firstElementChild as HTMLElement | null;
    const step = first ? first.offsetWidth + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const api = { prev: () => scrollBy(-1), next: () => scrollBy(1), canPrev, canNext };

  return (
    <div className={className}>
      {controls?.(api)}
      <div
        ref={track}
        className={cn("no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth", trackClassName)}
      >
        {children}
      </div>
    </div>
  );
}

export function CarouselArrows({
  prev,
  next,
  canPrev,
  canNext,
  className,
}: {
  prev: () => void;
  next: () => void;
  canPrev: boolean;
  canNext: boolean;
  className?: string;
}) {
  const btn =
    "grid size-8 place-items-center rounded-full border border-line bg-white transition hover:border-ink disabled:opacity-40 disabled:hover:border-line";
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <button type="button" className={btn} onClick={prev} disabled={!canPrev} aria-label="Previous">
        <ChevronLeft size={16} />
      </button>
      <button type="button" className={btn} onClick={next} disabled={!canNext} aria-label="Next">
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
