"use client";

import { useId, useState } from "react";
import { ChevronDown } from "./Icons";
import { cn } from "@/lib/format";

export type AccordionItem = { title: string; content: React.ReactNode };

export function Accordion({
  items,
  defaultOpen = -1,
  className,
  titleClassName,
}: {
  items: AccordionItem[];
  defaultOpen?: number;
  className?: string;
  titleClassName?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <div className={cn("divide-y divide-line border-b border-line", className)}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.title}>
            <button
              type="button"
              className={cn("flex w-full items-center justify-between gap-4 py-4 text-left", titleClassName)}
              aria-expanded={isOpen}
              aria-controls={`${id}-${i}`}
              onClick={() => setOpen(isOpen ? -1 : i)}
            >
              <span>{item.title}</span>
              <ChevronDown size={18} className={cn("shrink-0 transition-transform duration-300", isOpen && "rotate-180")} />
            </button>
            <div
              id={`${id}-${i}`}
              role="region"
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-out",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <div className="pb-4 text-sm leading-relaxed text-muted">{item.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
