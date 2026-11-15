"use client";

import Lenis from "lenis";
import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";

let locks = 0;
let scroller: Lenis | null = null;

export function lockScroll(lock: boolean) {
  locks = Math.max(0, locks + (lock ? 1 : -1));
  document.documentElement.style.overflow = locks > 0 ? "hidden" : "";
  if (locks > 0) scroller?.stop();
  else scroller?.start();
}

export function SmoothScroll() {
  const pathname = usePathname();
  const previousPath = useRef(pathname);
  const historyNavigation = useRef(false);

  useEffect(() => {
    const onPopState = () => {
      historyNavigation.current = true;
      // Stop outstanding wheel inertia before the router restores history.
      scroller?.scrollTo(window.scrollY, { immediate: true, force: true });
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useLayoutEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    const restoreHistory = historyNavigation.current;
    historyNavigation.current = false;
    scroller?.scrollTo(window.scrollY, { immediate: true, force: true });
    // Let Next handle Back/Forward and anchor links, then sync Lenis to it.
    if (restoreHistory || window.location.hash) {
      const frame = requestAnimationFrame(() => scroller?.scrollTo(window.scrollY, { immediate: true, force: true }));
      return () => cancelAnimationFrame(frame);
    }
    const toTop = () => {
      if (scroller) scroller.scrollTo(0, { immediate: true, force: true });
      else window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    };
    toTop();
    const frame = requestAnimationFrame(toTop);
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    const instance = new Lenis({ autoRaf: true, smoothWheel: true, lerp: 0.1 });
    scroller = instance;
    if (locks > 0) instance.stop();
    return () => {
      instance.destroy();
      if (scroller === instance) scroller = null;
    };
  }, []);
  return null;
}
