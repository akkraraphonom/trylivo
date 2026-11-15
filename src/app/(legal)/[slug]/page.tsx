import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLegal, legalPages } from "@/lib/data";
import { RichText } from "@/components/ui/RichText";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";

type Props = { params: Promise<{ slug: string }> };

// Only the 5 legal slugs exist; anything else at the root 404s.
export const dynamicParams = false;

export function generateStaticParams() {
  return legalPages.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getLegal(slug);
  return page ? { title: page.title, description: page.excerpt } : {};
}

export default async function LegalPage({ params }: Props) {
  const { slug } = await params;
  const page = getLegal(slug);
  if (!page) notFound();

  return (
    <>
      <section data-section="Hero" className="-mt-[var(--hdr)] pt-[98px] md:pt-[108px]">
        <div className="mx-auto flex max-w-[900px] flex-col items-start gap-6 px-5 pt-[60px] pb-10 md:px-[30px] lg:gap-8 lg:px-[50px]">
          <SplitText as="h1" text={page.title} className="block text-[44px] leading-[1.01] font-medium tracking-[-0.03em] md:text-[64px] lg:text-[80px]" from="x" stagger={0.04} />
          <SplitText
            as="p"
            text={page.excerpt}
            className="block max-w-[600px] text-[16px] leading-[1.2] tracking-[-0.02em] text-muted md:text-[18px] lg:text-[20px]"
            from="y"
            stagger={0.006}
            startDelay={0.4}
          />
        </div>
      </section>
      <Reveal as="section" section="Content" y={30} delay={0.3} className="mx-auto max-w-[900px] px-5 pt-10 pb-[68px] md:px-[30px] lg:px-[50px] lg:pb-[84px]">
        <RichText nodes={page.content} className="prose-legal" />
      </Reveal>
    </>
  );
}
