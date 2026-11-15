"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/format";

/**
 * Infinite horizontal ticker (Framer "Ticker" component).
 *
 * Content is rendered twice and moved with requestAnimationFrame at a fixed
 * speed in px/s, wrapping after one copy so the loop is seamless.
 * `followScroll` mirrors the template's home ticker: it runs left while the
 * page scrolls down, right after scrolling up, and speeds up while scrolling.
 */
export function Marquee({
  children,
  speed = 60,
  className,
  reverse,
  followScroll,
  pauseOnInteraction = false,
}: {
  children: React.ReactNode;
  /** px per second */
  speed?: number;
  className?: string;
  reverse?: boolean;
  followScroll?: boolean;
  pauseOnInteraction?: boolean;
}) {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let x = 0;
    let last = performance.now();
    let dir = reverse ? 1 : -1;
    let boost = 0;
    let lastY = window.scrollY;
    let visible = true;
    let raf = 0;

    const onScroll = () => {
      const y = window.scrollY;
      const d = y - lastY;
      lastY = y;
      if (!followScroll || d === 0) return;
      dir = d > 0 ? -1 : 1;
      boost = Math.min(Math.abs(d) * 4, speed * 2);
    };
    if (followScroll) window.addEventListener("scroll", onScroll, { passive: true });

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      if (visible && !(pauseOnInteraction && el.matches(":hover, :focus-within"))) {
        const half = el.scrollWidth / 2;
        x += dir * (speed + boost) * dt;
        boost *= Math.pow(0.02, dt); // ease back to base speed
        if (half > 0) {
          if (x <= -half) x += half;
          if (x > 0) x -= half;
        }
        el.style.transform = `translate3d(${x}px,0,0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      if (followScroll) window.removeEventListener("scroll", onScroll);
    };
  }, [speed, reverse, followScroll, pauseOnInteraction]);

  return (
    <div className={cn("relative flex overflow-x-clip", className)}>
      <div ref={track} className="flex w-max shrink-0 will-change-transform">
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
