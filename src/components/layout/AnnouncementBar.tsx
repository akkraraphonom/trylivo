import { announcement } from "@/lib/site";
import { Marquee } from "@/components/ui/Marquee";

export function AnnouncementBar() {
  const items = Array.from({ length: 6 }, () => announcement).flat();
  return (
    <div className="bg-ink text-white">
      <Marquee speed={50} className="h-8 text-[12px] leading-[1.2] tracking-[-0.02em]">
        {items.map((t, i) => (
          <span key={i} className="pr-[75px] md:pr-[118px] whitespace-nowrap">
            {t}
          </span>
        ))}
      </Marquee>
    </div>
  );
}
