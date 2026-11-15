import type { Metadata } from "next";
import Link from "next/link";
import { products } from "@/lib/data";
import { productPreviewImages } from "@/lib/product-preview";
import { CompareProducts } from "./CompareProducts";

export const metadata: Metadata = { title: "Compare" };

export default function ComparePage() {
  const options = products.map(({ slug, title, price, type, options }, index) => ({
    slug, title, price, type, options,
    image: productPreviewImages(products[index])[0]?.src,
  }));

  return (
    <section className="container-site py-12 md:py-20">
      <Link href="/shop/collection/all" className="text-sm text-muted hover:underline">Back to shop</Link>
      <h1 className="h-section mt-4">Compare</h1>
      <CompareProducts products={options} />
    </section>
  );
}
