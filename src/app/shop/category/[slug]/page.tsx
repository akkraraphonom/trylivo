import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories, getCategory, productsInCategory } from "@/lib/data";
import { PageHero } from "@/components/sections/PageHero";
import { Catalog } from "@/components/shop/Catalog";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = getCategory(slug);
  return c ? { title: `Explore ${c.title}`, description: c.description } : {};
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  return (
    <>
      <PageHero
        image={category.image?.src ?? "/images/gQGVzoCqL2xI7HO2kZG157t7gY.png"}
        position={category.image?.position}
        unoptimized={slug === "all" || ["jacket", "t-shirt", "hoodie", "sweater"].includes(slug) ? true : undefined}
        title={`Explore ${category.title}`}
        text={category.description}
      />
      <Catalog
        products={productsInCategory(slug)}
        showTypeFilter={false}
        showCollectionFilter
      />
    </>
  );
}
