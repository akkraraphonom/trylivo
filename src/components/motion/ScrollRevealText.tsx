"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll-linked text: every character starts at 20% opacity and fills in as
 * the paragraph travels up the viewport (the template's "Animated Text").
 */
export function ScrollRevealText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const chars = Array.from(el.querySelectorAll<HTMLElement>("[data-c]"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      chars.forEach((c) => (c.style.opacity = "1"));
      return;
    }
    let raf = 0;
    const update = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the top reaches 90% of the viewport, 1 when the bottom reaches 55%
      const start = vh * 0.9;
      const end = vh * 0.55 - r.height;
      const p = Math.min(1, Math.max(0, (start - r.top) / (start - end)));
      const lit = p * chars.length;
      chars.forEach((c, i) => {
        const o = Math.min(1, Math.max(0, lit - i));
        c.style.opacity = String(0.2 + 0.8 * o);
      });
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [text]);

  return (
    <p ref={ref} className={className} aria-label={text}>
      {text.split(" ").map((word, wi, arr) => (
        <span key={wi} aria-hidden="true" className="inline-block whitespace-nowrap">
          {Array.from(word).map((ch, ci) => (
            <span key={ci} data-c="" style={{ opacity: 0.2 }}>
              {ch}
            </span>
          ))}
          {wi < arr.length - 1 && " "}
        </span>
      ))}
    </p>
  );
}
