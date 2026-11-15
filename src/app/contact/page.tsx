import type { Metadata } from "next";
import Image from "next/image";
import { contact, faqs, site } from "@/lib/site";
import { ContactForm } from "@/components/sections/ContactForm";
import { Faq } from "@/components/sections/Faq";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Have a question about your order, products, or partnership? Contact our team and we'll be happy to help with any inquiries.",
};

export default function ContactPage() {
  return (
    <>
      {/* plain (white) hero: the header stays dark over it */}
      <section data-section="Hero" className="-mt-[var(--hdr)] pt-[98px] md:pt-[108px]">
        <div className="container-site flex flex-col items-start gap-8 pt-[60px] pb-5 md:pb-10">
          <SplitText as="h1" text={contact.title} className="block text-[44px] leading-[1.01] font-medium tracking-[-0.03em] md:text-[64px] lg:text-[80px]" from="x" stagger={0.05} />
          <SplitText
            as="p"
            text={contact.text}
            className="block max-w-[600px] text-[16px] leading-[1.2] tracking-[-0.02em] text-muted md:text-[18px] lg:text-[20px]"
            from="y"
            stagger={0.01}
            startDelay={0.4}
          />
        </div>
      </section>

      <Reveal as="section" section="Content" y={40} duration={1.2} className="container-site pt-5 pb-[68px] md:pt-9 md:pb-[84px] lg:pt-10">
        <div className="grid gap-[60px] md:grid-cols-2 md:gap-10">
          <div className="order-last flex flex-col gap-[30px] md:order-none lg:gap-9">
            <div className="relative aspect-[350/309] overflow-hidden rounded-lg md:aspect-[450/517] md:rounded-[10px] lg:aspect-[610/614] lg:rounded-xl">
              <Image src={contact.image} alt="" fill unoptimized className="object-cover" priority />
            </div>
            <dl className="grid grid-cols-2 gap-x-5 gap-y-6 text-[14px] leading-[1.2] tracking-[-0.02em] lg:grid-cols-3 md:text-[15px] lg:text-[16px]">
              {[
                ["Phone number", site.phone, `tel:${site.phone.replace(/\D/g, "")}`],
                ["Location", site.location, undefined],
              ].map(([k, v, href]) => (
                <div key={k} className="flex flex-col gap-0.5">
                  <dt className="text-muted">{k}</dt>
                  <dd className="font-medium">{href ? <a href={href}>{v}</a> : v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <ContactForm />
        </div>
      </Reveal>

      <section id="faq" data-section="FAQ" className="container-site scroll-mt-28 section-y md:pb-[76px] lg:pb-32">
        <Reveal className="flex flex-col gap-5">
          <h2 className="text-[40px] leading-none tracking-[-0.03em] md:text-[56px] lg:text-[64px]">FAQs</h2>
          <p className="max-w-[400px] text-[16px] leading-[1.2] tracking-[-0.02em] text-muted lg:text-[20px]">
            Find answers to common questions about orders, shipping, returns, sizing, and more.
          </p>
        </Reveal>
        <Reveal y={30} delay={0.1} className="mt-[66px]">
          <Faq items={faqs} />
        </Reveal>
      </section>
    </>
  );
}
