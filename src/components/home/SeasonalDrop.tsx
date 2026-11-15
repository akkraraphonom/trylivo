import Image from "next/image";
import Link from "next/link";
import { getProduct } from "@/lib/data";
import { seasonalDrop } from "@/lib/site";
import { ProductCard } from "@/components/product/ProductCard";
import { Reveal } from "@/components/motion/Reveal";
export function SeasonalDrop() {
  const items = seasonalDrop.products.map(getProduct).filter((product) => product !== undefined);
  return (
    <section data-section="Collection" className="mx-auto max-w-site section-y px-5 md:px-0">
      <Reveal className="grid border border-line bg-line md:grid-cols-[minmax(0,45fr)_minmax(0,55fr)]">
        <div className="relative isolate flex min-h-[360px] flex-col items-start gap-7 p-6 md:min-h-0">
          <Image src={seasonalDrop.image} alt="" fill quality={95} sizes="(min-width: 1360px) 1224px, (min-width: 768px) 90vw, 200vw" className="-z-10 object-cover object-top md:object-center" />
          <h2 className="max-w-[300px] text-[40px] leading-none tracking-[-0.03em] text-white md:text-[52px] lg:text-[64px]">{seasonalDrop.title}</h2>
          <Link href={seasonalDrop.href} className="btn-light">
            Shop Now
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-px border-t border-line md:border-t-0 md:border-l">
          {items.map((p) => (
            <ProductCard
              key={p.slug}
              product={p}
              className="min-w-0 rounded-none! shadow-none!"
              imageClassName="aspect-[374/398]"
              compact
              showMeta
              showDiscount
              imageQuality={95}
              highResolution
              sizes="(min-width: 1360px) 796px, (min-width: 768px) 60vw, 104vw"
            />
          ))}
        </div>
      </Reveal>
    </section>
  );
}
