"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useCurrency } from "@/lib/currency";
import { cn } from "@/lib/format";
import { ChevronDown } from "@/components/ui/Icons";

const REGIONS = [
  { code: "US", name: "United States", currency: "USD", symbol: "$" },
  { code: "TH", name: "Thailand", currency: "THB", symbol: "฿" },
] as const;

function Flag({ code, className }: { code: "US" | "TH"; className?: string }) {
  const clipId = useId();
  if (code === "TH") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <rect width="24" height="24" fill="#a51931" />
        <rect y="4" width="24" height="16" fill="#fff" />
        <rect y="8" width="24" height="8" fill="#2d2a4a" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <defs>
        <clipPath id={clipId}>
          <circle cx="12" cy="12" r="12" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <rect width="24" height="24" fill="#fff" />
        {[0, 2, 4, 6, 8, 10, 12].map((i) => (
          <rect key={i} y={i * (24 / 13)} width="24" height={24 / 13} fill="#b22234" />
        ))}
        <rect width="11" height={(24 / 13) * 7} fill="#3c3b6e" />
      </g>
    </svg>
  );
}

export function LocaleSelect({ light, up, className }: { light?: boolean; up?: boolean; className?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { currency, setCurrency } = useCurrency();
  const region = currency === "THB" ? REGIONS[1] : REGIONS[0];

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={`Country / region: ${region.name} (${region.currency})`}
        className="flex items-center gap-1.5"
      >
        <Flag code={region.code} className={cn("size-[22px] rounded-full", light ? "ring-1 ring-white/60" : "ring-1 ring-line")} />
        {up && (
          <>
            <span>
              {region.code} <span className="text-muted">({region.currency})</span>
            </span>
            <ChevronDown size={14} />
          </>
        )}
      </button>
      {open && (
        <ul
          className={cn(
            "absolute right-0 z-50 min-w-52 rounded-xl border border-line bg-white p-1.5 text-sm text-ink shadow-lg animate-fade-in",
            up ? "bottom-full mb-2" : "top-full mt-3",
          )}
        >
          {REGIONS.map((r) => (
            <li key={r.code}>
              <button
                type="button"
                aria-pressed={currency === r.currency}
                onClick={() => {
                  setCurrency(r.currency);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left hover:bg-surface"
              >
                <Flag code={r.code} className="size-4 rounded-full" />
                {r.name}
                <span className="ml-auto text-muted">
                  {r.currency} {r.symbol}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
