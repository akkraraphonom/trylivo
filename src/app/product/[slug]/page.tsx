import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, products, sizeGuide } from "@/lib/data";
import { productPreviewImages } from "@/lib/product-preview";
import type { Product } from "@/lib/types";
import { ProductView } from "@/components/product/ProductView";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { bestSellersOrder, site } from "@/lib/site";
import { Confidence } from "@/components/sections/Confidence";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  const preview = productPreviewImages(p)[0];
  return {
    title: p.title,
    description: p.excerpt,
    openGraph: { images: preview ? [preview.src] : [] },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  // the template's "You May Also Like": best-seller order, minus this product, 10 slides
  const related = bestSellersOrder
    .filter((s) => s !== product.slug)
    .map(getProduct)
    .filter(Boolean)
    .slice(0, 10) as Product[];

  const previews = productPreviewImages(product);
  

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.excerpt,
    image: previews.map((i) => i.src),
    brand: { "@type": "Brand", name: site.name },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: product.price.toFixed(2),
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductView product={product} sizeGuide={sizeGuide} />
      <Confidence />
      <RelatedProducts products={related} />
    </>
  );
}
