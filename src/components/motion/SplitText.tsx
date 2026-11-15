"use client";

import { createElement, useEffect, useState } from "react";

/**
 * Character-by-character "appear" text effect used by the template's hero
 * titles (from x:20) and subtitles (from y:20), triggered on mount.
 *
 * Words are kept in nowrap wrappers so lines still break naturally. The
 * full string is exposed to assistive tech via aria-label.
 */
export function SplitText({
  text,
  as = "span",
  className,
  from = "x",
  distance = 20,
  stagger = 0.05,
  startDelay = 0,
  duration = 0.4,
  play = true,
}: {
  text: string;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  from?: "x" | "y";
  distance?: number;
  /** delay between characters (s) */
  stagger?: number;
  /** delay before the first character (s) */
  startDelay?: number;
  duration?: number;
  /** set false to hold the initial state */
  play?: boolean;
}) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!play) {
      setShown(false);
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    // two frames so the initial state is painted before transitioning
    let r2 = 0;
    const r1 = requestAnimationFrame(() => {
      r2 = requestAnimationFrame(() => setShown(true));
    });
    return () => {
      cancelAnimationFrame(r1);
      cancelAnimationFrame(r2);
    };
  }, [play, text]);

  let i = 0;
  const words = text.split(" ");
  const offset = from === "x" ? `translate3d(${distance}px,0,0)` : `translate3d(0,${distance}px,0)`;

  return createElement(
    as,
    { className, "aria-label": text },
    words.map((word, wi) => (
      <span key={wi} aria-hidden="true" className="inline-block whitespace-nowrap">
        {Array.from(word).map((ch) => {
          const d = startDelay + i++ * stagger;
          return (
            <span
              key={d}
              className="inline-block"
              style={{
                opacity: shown ? 1 : 0.001,
                transform: shown ? "none" : offset,
                transition: `opacity ${duration}s cubic-bezier(.44,0,.56,1) ${d}s, transform ${duration}s cubic-bezier(.44,0,.56,1) ${d}s`,
              }}
            >
              {ch}
            </span>
          );
        })}
        {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
      </span>
    )),
  );
}
