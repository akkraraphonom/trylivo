"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { popup } from "@/lib/site";
import { CloseIcon } from "@/components/ui/Icons";
import { lockScroll } from "@/components/motion/SmoothScroll";
import { cn } from "@/lib/format";

/**
 * "Unlock 30% Off" offer that opens once the visitor has scrolled 25% of a
 * page — same trigger as the template. Dismissal is remembered.
 */
const field = "h-11 w-full rounded-full border border-[#dbdbdb] bg-white px-3.5 text-[15px] text-ink outline-none transition-colors placeholder:text-muted focus:border-ink";

export function NewsletterPopup() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(popup.storageKey)) return;
    } catch {
      /* storage unavailable: still show once per page load */
    }
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY > 0 && window.scrollY >= max * popup.scrollTrigger) {
        setOpen(true);
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    const r = requestAnimationFrame(() => setVisible(true));
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(r);
      lockScroll(false);
      document.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const close = () => {
    setVisible(false);
    try {
      localStorage.setItem(popup.storageKey, "1");
    } catch {}
    setTimeout(() => setOpen(false), 300);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center p-4" role="dialog" aria-modal="true" aria-label={popup.title}>
      <button
        type="button"
        aria-label="Close offer"
        onClick={close}
        className={cn("absolute inset-0 bg-black/40 transition-opacity duration-300", visible ? "opacity-100" : "opacity-0")}
      />
      <div
        className={cn(
          "relative grid w-full max-w-[720px] overflow-hidden rounded-xl bg-white transition-[opacity,transform] duration-500 ease-[cubic-bezier(.44,0,.34,.98)] sm:grid-cols-2",
          visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-6 scale-[.98] opacity-0",
        )}
      >
        <div className="relative hidden min-h-[416px] sm:block">
          <Image src={popup.image} alt="" fill sizes="360px" className="object-cover object-top" />
        </div>
        <div className="flex flex-col justify-center px-[30px] pt-12 pb-[50px]">
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute top-4 right-4 grid size-8 place-items-center rounded-full bg-[rgba(3,6,7,0.08)] transition-colors hover:bg-[rgba(3,6,7,0.14)]"
          >
            <CloseIcon size={16} strokeWidth={2} />
          </button>
          {done ? (
            <div className="text-center" role="status">
              <p className="text-[30px] leading-[1.1] font-medium tracking-[-0.04em]">You&apos;re in!</p>
              <p className="mt-3 text-sm text-muted">Check your inbox for your 30% off code.</p>
              <button type="button" onClick={close} className="btn-dark mt-6 w-full py-3">
                Continue shopping
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-center text-[30px] leading-[1.1] font-medium tracking-[-0.04em] sm:text-[34px]">{popup.title}</h2>
              <p className="mx-auto mt-3 max-w-[270px] text-center text-[14px] leading-[1.2] tracking-[-0.04em] text-muted">{popup.text}</p>
              <form
                className="mt-[37px] flex flex-col gap-2.5"
                onSubmit={(e) => {
                  e.preventDefault();
                  setDone(true);
                  try {
                    localStorage.setItem(popup.storageKey, "1");
                  } catch {}
                }}
              >
                <input name="name" placeholder="Name" aria-label="Name" className={field} />
                <input name="email" type="email" required placeholder="Email address" aria-label="Email address" className={field} />
                <button type="submit" className="mt-1.5 h-11 w-full rounded-full bg-ink text-[15px] leading-[1.2] text-white transition-colors hover:bg-black">
                  {popup.cta}
                </button>
              </form>
              <p className="mt-4 text-[12px] leading-[1.2] tracking-[-0.04em] text-muted">{popup.legal}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
