import Image from "next/image";
import Link from "next/link";
import { shopByCategory } from "@/lib/site";
import { cn } from "@/lib/format";
import { Reveal } from "@/components/motion/Reveal";

export function ShopByCategory() {
  return (
    <section data-section="Shop by Categories" className="container-site section-y">
      <Reveal as="h2" className="h-section">
        Shop by Categories
      </Reveal>
      <Reveal
        y={40}
        duration={1.2}
        className="mt-14 grid gap-4 md:mt-16 md:max-w-[810px] lg:mt-[72px] lg:h-[730px] lg:max-w-none lg:grid-cols-[563fr_688fr] lg:grid-rows-2 lg:gap-2.5"
      >
        {shopByCategory.map((c, i) => (
          <Link
            key={c.href}
            href={c.href}
            className={cn(
              "group relative isolate flex h-[470px] flex-col items-start overflow-hidden rounded-xl bg-surface p-6 md:h-[362px] md:p-9 lg:h-auto",
              i === 0 && "lg:row-span-2",
            )}
          >
            <span className={cn("absolute bottom-0 right-0 top-[35%] -z-10 w-[70%] md:top-3 md:w-[54%]", i === 0 && "lg:w-[57%]")}>
              <Image src={c.image} alt="" fill sizes="(min-width: 1200px) 370px, 54vw" className="object-contain object-right-bottom" />
            </span>
            <p className="text-[16px] leading-[1.2] font-medium tracking-[-0.02em] text-muted lg:text-[18px]">{c.eyebrow}</p>
            <h3 className="mt-[22px] max-w-[292px] text-[34px] md:max-w-[46%] md:text-[40px] leading-[1.1] tracking-[-0.03em]">{c.title}</h3>
            <span className="btn-dark mt-[38px] md:mt-11 lg:mt-14">Shop Now</span>
          </Link>
        ))}
      </Reveal>
    </section>
  );
}
