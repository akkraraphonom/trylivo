import Image from "next/image";
import { testimonials } from "@/lib/site";
import { StarIcon } from "@/components/ui/Icons";
import { Marquee } from "@/components/ui/Marquee";
import { Reveal } from "@/components/motion/Reveal";

/** Marquee of video / photo reviews, faded out at both edges. */
export function Testimonials() {
  return (
    <section data-section="Testimonial" className="section-y">
      <Reveal className="flex flex-col items-center gap-2.5 text-center md:gap-3 lg:gap-3.5">
        <h2 className="h-section">Style loved by Thousands</h2>
        <p className="lead max-w-[340px] md:max-w-[370px] lg:max-w-[489px]">See why customers keep coming back for timeless style, premium comfort, and everyday confidence.</p>
      </Reveal>
      <Reveal
        y={40}
        className="mt-14 md:mt-16 lg:mt-[72px]"
        style={{
          maskImage: "linear-gradient(90deg, transparent 0%, #000 7%, #000 92%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(90deg, transparent 0%, #000 7%, #000 92%, transparent 100%)",
        }}
      >
        <Marquee speed={60}>
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="relative mr-3 h-[346px] w-[260px] shrink-0 md:h-[386px] md:w-[300px] overflow-hidden rounded-[11.8px] bg-ink after:pointer-events-none after:absolute after:inset-0 after:rounded-[11.8px] after:border after:border-[#e4e4e4]"
            >
              {"video" in t ? (
                <video className="absolute inset-0 h-full w-full object-cover" src={t.video} autoPlay muted loop playsInline preload="metadata" />
              ) : (
                <Image src={t.image} alt="" fill sizes="300px" className="object-cover" />
              )}
              <figcaption className="absolute inset-x-0 bottom-0 flex h-[139px] flex-col justify-end gap-3 bg-[linear-gradient(182deg,rgba(255,255,255,0)_11.08%,rgba(30,30,30,0.5)_41.57%,rgb(31,31,31)_100%)] p-6 text-white max-md:p-5">
                <blockquote className="text-[16px] leading-[1.1] font-medium tracking-[-0.03em]">“{t.quote}”</blockquote>
                <div className="flex items-center justify-between gap-2.5">
                  <span className="text-[12px] leading-none font-medium tracking-[-0.03em] text-[#d3d3d3]">By {t.name}</span>
                  <span className="flex gap-0.5" aria-label="5 out of 5 stars">
                    {Array.from({ length: 5 }, (_, i) => (
                      <StarIcon key={i} size={13} />
                    ))}
                  </span>
                </div>
              </figcaption>
            </figure>
          ))}
        </Marquee>
      </Reveal>
    </section>
  );
}
