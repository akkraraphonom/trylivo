"use client";

import { useState } from "react";
import type { JournalPost } from "@/lib/types";
import { cn } from "@/lib/format";
import { JournalCard } from "./JournalCards";
import { Reveal } from "@/components/motion/Reveal";

/** Category tabs in the template's order */
const TABS = ["All", "Buying Guide", "Style Guide", "Fashion"];

export function JournalGrid({ posts }: { posts: JournalPost[] }) {
  const [cat, setCat] = useState("All");
  const list = cat === "All" ? posts : posts.filter((p) => p.category === cat);

  return (
    <section data-section="Content" className="mx-auto max-w-site px-[30px] pt-[54px] pb-32 lg:px-[50px]">
      <Reveal as="h2" className="h-section">
        From the Journal
      </Reveal>
      <div className="mt-10 flex flex-wrap gap-x-2.5 gap-y-[13px] lg:mt-12" role="tablist">
        {TABS.map((c) => (
          <button
            key={c}
            type="button"
            role="tab"
            aria-selected={cat === c}
            onClick={() => setCat(c)}
            className={cn(
              "shrink-0 rounded-full px-3 py-[3px] text-[16px] leading-[1.2] transition-colors duration-200 md:px-5 md:py-[5px]",
              cat === c ? "bg-ink text-white" : "bg-surface",
            )}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="mt-7 grid gap-x-5 gap-y-[30px] md:grid-cols-2 lg:grid-cols-3 pb-20 lg:gap-y-10 lg:pb-[53px]">
        {list.map((p, i) => (
          <Reveal key={`${cat}-${p.slug}`} y={30} delay={(i % 3) * 0.1}>
            <JournalCard post={p} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
