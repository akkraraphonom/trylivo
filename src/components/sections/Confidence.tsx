import { usps } from "@/lib/site";
import { uspIcons } from "@/components/ui/Icons";
import { cn } from "@/lib/format";
import { Reveal } from "@/components/motion/Reveal";

/**
 * "Shop With Confidence": four USPs in a grey card — stacked with hairlines on
 * phones, 2×2 on tablets, one row with vertical hairlines on desktop.
 */
const item = [
  "max-md:pb-[31px] md:border-r md:pr-8 lg:pr-8",
  "max-md:pt-[22px] max-md:pb-[31px] md:px-8 lg:border-r",
  "max-md:pt-[22px] max-md:pb-[31px] md:border-r md:pr-8 lg:px-8",
  "max-md:pt-[22px] md:pl-8",
];

export function Confidence() {
  return (
    <section data-section="USP" className="container-site section-y">
      <Reveal
        y={30}
        className="rounded-xl bg-[rgba(241,241,241,0.88)] px-[30px] pt-[30px] pb-[34px] md:pt-8 md:pb-[38px] lg:px-10 lg:pt-[42px] lg:pb-[46px]"
      >
        <h3 className="text-[30px] leading-[1.1] tracking-[-0.03em] md:text-[36px] lg:text-[40px]">Shop With Confidence</h3>
        <div className="mt-11 grid md:grid-cols-2 md:gap-y-[30px] lg:mt-[46px] lg:grid-cols-4 lg:gap-0">
          {usps.map((u, i) => {
            const Icon = uspIcons[u.icon];
            return (
              <div key={u.title} className={cn("border-black/12 max-md:border-b max-md:last:border-b-0", item[i])}>
                <div className="flex flex-col gap-3">
                  <Icon size={36} />
                  <h3 className="text-[18px] leading-[1.2] font-medium tracking-[-0.03em] capitalize">{u.title}</h3>
                  <p className="text-[14px] leading-[1.1] tracking-[-0.03em] text-ink-soft">{u.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}
