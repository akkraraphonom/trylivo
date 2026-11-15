"use client";

import { useEffect, useRef, useState } from "react";
import { lockScroll } from "@/components/motion/SmoothScroll";

/** A short opening sequence. The mounted layout survives internal navigation. */
export function EntryLoader({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<"loading" | "leaving" | "done">("loading");
  const content = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let disposed = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const delay = (ms: number) => new Promise<void>((resolve) => {
      timers.push(setTimeout(resolve, ms));
    });
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const page = content.current;
    if (page) page.inert = true;
    lockScroll(true);

    // Warm the real rendered URLs (including Next's responsive candidates),
    // not another full-resolution copy. Never preload the entire catalogue.
    const images = Array.from(page?.querySelectorAll<HTMLImageElement>("main img") ?? []).slice(0, 8);
    const ready = Promise.allSettled(images.map((image) => {
      image.loading = "eager";
      return image.decode();
    }));
    void Promise.all([
      delay(reduced ? 0 : 1750),
      Promise.race([ready, delay(2400)]),
    ]).then(async () => {
      if (disposed) return;
      setPhase("leaving");
      await delay(reduced ? 0 : 850);
      if (disposed) return;
      if (page) page.inert = false;
      lockScroll(false);
      setPhase("done");
    });

    return () => {
      disposed = true;
      timers.forEach(clearTimeout);
      if (page?.inert) {
        page.inert = false;
        lockScroll(false);
      }
    };
  }, []);

  return (
    <>
      <div ref={content}>{children}</div>
      {phase !== "done" && (
        <div className="entry-loader" data-phase={phase} role="status" aria-label="Loading TRYLIVO">
          <div className="entry-loader-center" aria-hidden="true">
            <div className="entry-loader-brand">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/trylivo-mark.png" alt="" width="36" height="34" />
              <span className="entry-loader-wordmark">
                {"TRYLIVO".split("").map((_, index) => (
                  <span className="entry-loader-letter-mask" key={index}>
                    <span style={{ animationDelay: `${480 + index * 65}ms`, backgroundPosition: `${index * (100 / 6)}% center` }} />
                  </span>
                ))}
              </span>
            </div>
            <div className="entry-loader-track"><span /></div>
          </div>
        </div>
      )}
      <noscript><style>{`.entry-loader { display: none !important; }`}</style></noscript>
    </>
  );
}
