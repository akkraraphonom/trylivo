import Image from "next/image";
import { newsletter } from "@/lib/site";
import { NewsletterForm } from "./NewsletterForm";
import { Reveal } from "@/components/motion/Reveal";

export function Newsletter() {
  return (
    <section data-section="Newsletter" className="section-y lg:pb-[168px]">
      <div className="container-site">
        <Reveal y={30} className="relative isolate flex h-[450px] flex-col items-start justify-end overflow-hidden rounded-xl bg-[#783b24] px-[22px] pb-7 md:h-[360px] md:justify-center md:pb-0 md:px-[42px] lg:h-[620px] lg:px-[50px]">
          <Image src={newsletter.image} alt="" fill sizes="(min-width: 1360px) 1260px, 100vw" className="-z-10 object-cover object-[83%_center] md:object-center" />
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-t from-black/80 via-black/25 to-transparent md:bg-none" />
          <div className="flex w-full max-w-[486px] flex-col gap-7 text-white md:gap-11">
            <div className="flex flex-col gap-4">
              <h2 className="text-[36px] leading-[1.1] tracking-[-0.03em] md:text-[48px] lg:text-[56px]">{newsletter.title}</h2>
              <p className="text-[14px] leading-[1.2] tracking-[-0.02em] md:text-[16px] md:font-medium lg:text-[18px]">{newsletter.text}</p>
            </div>
            <NewsletterForm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
