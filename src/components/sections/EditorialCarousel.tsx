"use client";

import { useCurrency } from "@/lib/currency";

import Image from "next/image";
import { useRef, useState } from "react";
import { BagIcon, CloseIcon } from "@/components/ui/Icons";
import { Marquee } from "@/components/ui/Marquee";
import { editorialProducts } from "@/lib/data";
import { useStore } from "@/lib/store";

export function EditorialCarousel() {
  const { formatPrice } = useCurrency();
  const dialog = useRef<HTMLDialogElement>(null);
  const [product, setProduct] = useState<(typeof editorialProducts)[number]>();
  const { addToCart } = useStore();

  return (
    <section aria-label="The Artist Edit" className="section-y">
      <h2 className="h-section mb-8 px-4 text-center">The Artist Edit</h2>
      <Marquee speed={36} pauseOnInteraction className="w-full">
        {editorialProducts.map((look) => (
          <button
            key={look.slug}
            type="button"
            aria-label={`Choose a size for ${look.title}`}
            className="group relative mr-4 block h-[346px] w-[260px] shrink-0 overflow-hidden rounded-xl bg-surface focus-visible:outline-2 focus-visible:-outline-offset-4 md:mr-5 md:h-[450px] md:w-[300px]"
            onClick={() => {
              setProduct(look);
              dialog.current?.showModal();
            }}
          >
            <Image src={look.editorialImage} alt="" fill unoptimized className="object-cover object-top" />
            <span className="absolute right-3 bottom-3 grid size-11 place-items-center rounded-full bg-black/65 text-white transition-colors group-hover:bg-black" aria-hidden>
              <BagIcon size={20} />
            </span>
          </button>
        ))}
      </Marquee>

      <dialog ref={dialog} aria-labelledby="editorial-product-title" className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-md rounded-xl bg-white p-6 text-ink shadow-xl backdrop:bg-black/50" onClose={() => setProduct(undefined)}>
        {product && (
          <>
            <div className="flex items-start justify-between gap-4">
              <h3 id="editorial-product-title" className="text-xl font-medium">{product.title}</h3>
              <button type="button" aria-label="Close" onClick={() => dialog.current?.close()}><CloseIcon size={22} /></button>
            </div>
            <p className="mt-2">{formatPrice(product.price)}</p>
            <p className="mt-5 mb-2 text-sm">Select a size to add to bag</p>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((variant) => (
                <button
                  key={variant.id}
                  type="button"
                  className="min-w-12 rounded-full border border-line px-4 py-2 hover:bg-ink hover:text-white"
                  onClick={() => {
                    dialog.current?.close();
                    addToCart({ slug: product.slug, variantId: variant.id, variantTitle: variant.title, qty: 1 });
                  }}
                >
                  {variant.title.split(" / ")[1]}
                </button>
              ))}
            </div>
          </>
        )}
      </dialog>
    </section>
  );
}
