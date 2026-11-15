"use client";

import Image from "next/image";
import { Children, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/format";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;
const EASE = "cubic-bezier(.5,0,.25,1)";
const DURATION = 500;

export type SliderApi = { prev: () => void; next: () => void; canPrev: boolean; canNext: boolean };

/**
 * Framer-style slideshow: moves one item per arrow click with a 0.5s ease,
 * supports drag/swipe, and can loop infinitely (items are rendered three
 * times and the track silently re-centres after each move).
 *
 * Item widths come from the children's own classes; `gap` is in px.
 */
export function Slider({
  children,
  gap = 24,
  loop = false,
  className,
  trackClassName,
  viewportClassName,
  controls,
  footer,
}: {
  children: React.ReactNode;
  gap?: number;
  loop?: boolean;
  className?: string;
  trackClassName?: string;
  viewportClassName?: string;
  controls?: (api: SliderApi) => React.ReactNode;
  /** rendered under the track (e.g. phone arrows) */
  footer?: (api: SliderApi) => React.ReactNode;
}) {
  const items = Children.toArray(children);
  const n = items.length;
  const copies = loop && n > 1 ? 3 : 1;
  const start = copies === 3 ? n : 0;

  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(start);
  const [animate, setAnimate] = useState(false);
  const [step, setStep] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);
  const drag = useRef<{ x: number; dx: number; id: number } | null>(null);
  const [dragX, setDragX] = useState(0);

  const measure = useCallback(() => {
    const t = track.current;
    const v = viewport.current;
    if (!t || !v) return;
    const first = (t.children[0]?.firstElementChild ?? t.children[0]) as HTMLElement | undefined;
    if (!first) return;
    const s = first.offsetWidth + gap;
    setStep(s);
    if (copies === 1) {
      const visible = Math.max(1, Math.floor((v.clientWidth + gap + 1) / s));
      setMaxIndex(Math.max(0, n - visible));
    }
  }, [gap, n, copies]);

  useIsoLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (viewport.current) ro.observe(viewport.current);
    return () => ro.disconnect();
  }, [measure]);

  // reset when the item set changes (e.g. Best Sellers tabs)
  useEffect(() => {
    setAnimate(false);
    setIndex(start);
  }, [n, start]);

  const go = (d: number) => {
    setAnimate(true);
    setIndex((i) => (copies === 3 ? i + d : Math.min(Math.max(i + d, 0), maxIndex)));
  };

  // loop: after the move finishes, jump back into the middle copy without animating
  useEffect(() => {
    if (copies !== 3) return;
    if (index >= start && index < start + n) return;
    const t = setTimeout(() => {
      setAnimate(false);
      setIndex((i) => ((((i - start) % n) + n) % n) + start);
    }, DURATION);
    return () => clearTimeout(t);
  }, [index, copies, n, start]);

  const api: SliderApi = {
    prev: () => go(-1),
    next: () => go(1),
    canPrev: copies === 3 || index > 0,
    canNext: copies === 3 || index < maxIndex,
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    drag.current = { x: e.clientX, dx: 0, id: e.pointerId };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    d.dx = e.clientX - d.x;
    if (Math.abs(d.dx) > 4) {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      setAnimate(false);
      setDragX(d.dx);
    }
  };
  const onPointerUp = () => {
    const d = drag.current;
    drag.current = null;
    if (!d || Math.abs(d.dx) <= 4) return;
    setDragX(0);
    const moved = step ? Math.round(-d.dx / step) || (Math.abs(d.dx) > 40 ? -Math.sign(d.dx) : 0) : 0;
    if (moved) go(moved);
    else setAnimate(true);
  };
  // swallow the click that ends a drag so cards don't navigate
  const onClickCapture = (e: React.MouseEvent) => {
    if (dragX !== 0) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div className={cn("flow-root", className)}>
      {controls?.(api)}
      <div ref={viewport} className={cn("overflow-hidden", viewportClassName)}>
        <div
          ref={track}
          className={cn("flex touch-pan-y select-none", trackClassName)}
          style={{
            gap,
            transform: `translate3d(${-index * step + dragX}px,0,0)`,
            transition: animate ? `transform ${DURATION}ms ${EASE}` : "none",
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onClickCapture={onClickCapture}
          onDragStart={(e) => e.preventDefault()}
        >
          {Array.from({ length: copies }, (_, c) =>
            items.map((child, i) => (
              <div key={`${c}-${i}`} className="contents" aria-hidden={copies === 3 && c !== 1 ? true : undefined}>
                {child}
              </div>
            )),
          )}
        </div>
      </div>
      {footer?.(api)}
    </div>
  );
}

/** The template's round arrow buttons (34px images with a hairline circle). */
export function SliderArrows({ prev, next, canPrev, canNext, className, tone = "grey", size = 34 }: SliderApi & { className?: string; tone?: "grey" | "white"; size?: number }) {
  const btn = cn(
    "relative overflow-hidden rounded-[40px] disabled:cursor-default",
    tone === "grey" ? "bg-[rgba(214,214,214,0.65)]" : "bg-white",
  );
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <button type="button" className={btn} style={{ width: size, height: size }} onClick={prev} disabled={!canPrev} aria-label="Previous">
        <Image src="/images/dC3PnSK42DE1Ed5jx5GxE2F0io.png" alt="" fill sizes="38px" />
      </button>
      <button type="button" className={btn} style={{ width: size, height: size }} onClick={next} disabled={!canNext} aria-label="Next">
        <Image src="/images/qShOc5ZwaKa7q4lE4yTUYyYdZL4.png" alt="" fill sizes="38px" />
      </button>
    </div>
  );
}
