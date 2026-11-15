import Image from "next/image";
import { instagramImages, site } from "@/lib/site";
import { InstagramIcon } from "@/components/ui/Icons";
import { Marquee } from "@/components/ui/Marquee";
import { Reveal } from "@/components/motion/Reveal";

const fade = "linear-gradient(90deg, transparent 0%, #000 7.9%, #000 91.6%, transparent 100%)";

export function InstagramFeed() {
  return (
    <section data-section="Social" className="section-y">
      <Reveal className="flex flex-col items-center gap-2.5 px-4 text-center md:gap-3 lg:gap-3.5">
        <h2 className="h-section max-md:text-[32px]">Follow us on Instagram</h2>
        <p className="lead max-w-[320px] md:max-w-[489px]">See how our community styles their favorite pieces, from everyday essentials to new arrivals.</p>
      </Reveal>

      <div className="mt-14 flex flex-col items-center gap-9 md:mt-16 lg:mt-[72px]">
        <Reveal y={40} className="flex h-[353px] w-full items-center md:h-[384px]" style={{ maskImage: fade, WebkitMaskImage: fade }}>
          <Marquee speed={60} className="w-full">
            {instagramImages.map((src) => (
              <a
                key={src}
                href={site.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="group relative mr-3 block h-[346px] w-[260px] shrink-0 overflow-hidden rounded-xl bg-surface md:mr-5 md:h-[386px] md:w-[335px]"
              >
                <Image src={src} alt="" fill sizes="335px" className="object-cover" />
                <span className="absolute inset-0 grid place-items-center bg-black/[0.14] text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <InstagramIcon size={38} />
                </span>
              </a>
            ))}
          </Marquee>
        </Reveal>
        <a
          href={site.instagramUrl}
          target="_blank"
          rel="noreferrer"
          className="btn-outline"
        >
          {site.instagram}
        </a>
      </div>
    </section>
  );
}
