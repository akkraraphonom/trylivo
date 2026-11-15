"use client";

import { useState } from "react";
import { cn } from "@/lib/format";
import { ChevronDown } from "@/components/ui/Icons";

/** FAQ list: 20px questions, chevron flips when open, 2px rule under each. */
export function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="flex flex-col gap-[18px]">
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q} className="flex flex-col gap-[18px]">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              className="flex w-full flex-col text-left"
            >
              <span className="flex w-full items-center justify-between">
                <span className="text-[20px] leading-[1.2]">{f.q}</span>
                <ChevronDown size={18} strokeWidth={1.4} className={cn("ml-2.5 shrink-0 text-[#080a10] transition-transform duration-300", isOpen && "rotate-180")} />
              </span>
              <span
                className={cn(
                  "grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(.44,0,.56,1)]",
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                )}
              >
                <span className="min-h-0 overflow-hidden">
                  <span className="block pt-2.5 text-[15px] leading-[1.2] font-[400]">{f.a}</span>
                </span>
              </span>
            </button>
            <span className={cn("h-0.5 w-full", isOpen ? "bg-[#dbdbdb]" : "bg-[#e3e3e3]")} />
          </div>
        );
      })}
    </div>
  );
}
