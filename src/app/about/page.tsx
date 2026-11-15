import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";

export const metadata: Metadata = {
  title: "About",
  description: "Meet TRYLIVO. Explore everyday layers, expressive silhouettes, and the looks behind The Artist Edit.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        variant="bottom"
        image="/images/trylivo-about-hero-v3.webp"
        mobileImage="/images/trylivo-about-mobile.webp"
        imageQuality={85}
        position="72% top"
        title="About TRYLIVO"
        text="Everyday layers with room for your own style."
        className="bg-ink before:pointer-events-none before:absolute before:inset-0 before:-z-[1] before:bg-linear-to-t before:from-black/75 before:via-transparent before:to-black/30"
      />

      <section aria-labelledby="our-approach" className="container-site section-y">
        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-14 lg:gap-20">
          <div>
            <h2 id="our-approach" className="h-section max-w-md">Clothes you can make your own.</h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted md:text-lg">
              TRYLIVO brings together easy layers and expressive shapes. Start with a graphic tee, add a roomy jacket, or build a look around a sculpted knit. The same piece can feel different depending on how you wear it.
            </p>
            <Link href="/shop/collection/all" className="btn-dark mt-7">Explore the collection</Link>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-surface md:aspect-square">
            <Image
              src="/images/editorial-vermilion-sculpted-knit-2x.webp"
              alt="Vermilion sculpted knit styled with silver jewelry from The Artist Edit"
              fill
              quality={85}
              sizes="(min-width: 1360px) 590px, (min-width: 768px) 48vw, 100vw"
              className="object-cover object-top"
            />
          </div>
        </div>
      </section>

      <section aria-labelledby="compare-fits" className="container-site pb-12 md:pb-20">
        <div className="flex flex-wrap items-center justify-between gap-5 rounded-xl bg-surface p-6 md:p-10">
          <div>
            <h2 id="compare-fits" className="text-2xl tracking-tight md:text-4xl">See the two pieces side by side.</h2>
            <p className="mt-2 text-muted">Compare photos, sizes, colors, and prices before you choose.</p>
          </div>
          <Link href="/compare" className="btn-dark">Compare products</Link>
        </div>
      </section>
    </>
  );
}
