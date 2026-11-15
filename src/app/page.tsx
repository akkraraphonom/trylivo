import Link from "next/link";
import { getProduct } from "@/lib/data";
import { newArrivalsOrder } from "@/lib/site";
import { Hero } from "@/components/home/Hero";
import { SeasonalDrop } from "@/components/home/SeasonalDrop";
import { ShopByCategory } from "@/components/home/ShopByCategory";
import { VideoShowcase } from "@/components/home/VideoShowcase";
import { BestSellers } from "@/components/home/BestSellers";
import { Testimonials } from "@/components/home/Testimonials";
import { ProductCarousel } from "@/components/product/ProductCarousel";
import { Confidence } from "@/components/sections/Confidence";

export default function HomePage() {
  const newArrivals = newArrivalsOrder.map(getProduct).filter((product) => product !== undefined).map((product) => product.slug === "kids-puffer-jacket" ? ({
    ...product,
    images: [
      { src: `/images/new-arrival-${product.slug}-2x.webp`, width: 2508, height: 2508 },
      { src: `/images/new-arrival-${product.slug}-hover-2x-v2.webp`, width: 2508, height: 2508 },
      ...product.images.slice(2),
    ],
  }) : product);
  return (
    <>
      <Hero />
      <ProductCarousel title="New Arrival is here" products={newArrivals} viewMoreHref="/shop/collection/new-arrivals" showNew showMeta />
      <SeasonalDrop />
      <ShopByCategory />
      <VideoShowcase />
      <BestSellers />
      <Confidence />
      <Testimonials />
      <section className="container-site section-y">
        <div className="flex flex-wrap items-center justify-between gap-5 rounded-xl bg-surface p-6 md:p-10">
          <div>
            <h2 className="h-section">Compare</h2>
            <p className="mt-2 text-muted">See two pieces side by side before you choose.</p>
          </div>
          <Link href="/compare" className="btn-dark">Compare products</Link>
        </div>
      </section>
    </>
  );
}
