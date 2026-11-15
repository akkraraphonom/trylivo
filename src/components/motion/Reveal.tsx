"use client";

import { createElement, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/format";

/**
 * Scroll-reveal matching the Framer template's "appear" effects:
 * opacity 0 → 1 (+ optional translateY), ease [.44,0,.34,.98], plays once
 * when any part of the element enters the viewport (threshold 0).
 */
export const EASE_OUT = "cubic-bezier(.44,0,.34,.98)";

type Props = {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** px to travel up from (0 = fade only). Template uses 30 or 40. */
  y?: number;
  /** seconds */
  delay?: number;
  /** seconds — template uses .8 (default) and 1.2 */
  duration?: number;
  as?: keyof React.JSX.IntrinsicElements;
  id?: string;
  /** section name (mirrors the template's layer names; handy for QA) */
  section?: string;
};

export function useInViewOnce<T extends Element>(rootMargin = "0px 0px -40px 0px") {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);
  return [ref, inView] as const;
}

/** Inline style for a reveal driven by an external `inView` (e.g. slider items revealed together). */
export function revealStyle(inView: boolean, y = 0, delay = 0, duration = 0.8): React.CSSProperties {
  return {
    opacity: inView ? 1 : 0,
    transform: inView ? "none" : `translate3d(0, ${y}px, 0)`,
    transition: `opacity ${duration}s ${EASE_OUT} ${delay}s, transform ${duration}s ${EASE_OUT} ${delay}s`,
  };
}

export function Reveal({ children, className, style, y = 0, delay = 0, duration = 0.8, as = "div", id, section }: Props) {
  const [ref, inView] = useInViewOnce<HTMLElement>();
  return createElement(
    as,
    {
      ref,
      id,
      "data-section": section,
      className: cn("motion-reduce:!transform-none motion-reduce:!opacity-100", className),
      style: {
        ...style,
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : `translate3d(0, ${y}px, 0)`,
        transition: `opacity ${duration}s ${EASE_OUT} ${delay}s, transform ${duration}s ${EASE_OUT} ${delay}s`,
        willChange: inView ? undefined : "opacity, transform",
      },
    },
    children,
  );
}
