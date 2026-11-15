import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { collections, getCollection, productsInCollection } from "@/lib/data";
import { PageHero } from "@/components/sections/PageHero";
import { Catalog } from "@/components/shop/Catalog";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

/** Hero title, as the template words it ("Men's Collection", "All Collection") */
const heading = (title: string, slug: string) => (slug === "all" ? "All Collection" : `${title}'s Collection`);
/** Title above the grid */
const subheading = (title: string, slug: string) =>
  slug === "all" ? "All Products" : ["men", "women", "kid"].includes(slug) ? `For ${title}` : title;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = getCollection(slug);
  return c ? { title: heading(c.title, c.slug), description: c.description } : {};
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();

  return (
    <>
      <PageHero
        variant="bottom"
        image={collection.image?.src ?? "/images/2hbUN61Rj3aqIA7WfQeLi4fhM.png"}
        position={collection.image?.position}
        title={heading(collection.title, collection.slug)}
      />
      <Catalog
        products={productsInCollection(slug)}
        heading={{ crumb: collection.title, title: subheading(collection.title, collection.slug), text: collection.description }}
      />
    </>
  );
}
