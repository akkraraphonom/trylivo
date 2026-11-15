import type { Metadata } from "next";
import { products } from "@/lib/data";
import { Catalog } from "@/components/shop/Catalog";

export const metadata: Metadata = {
  title: "Search - Find Your Next Favorite Style",
  description: "Find TRYLIVO clothing by product name, type, or color.",
};

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const { q } = await searchParams;
  const query = (Array.isArray(q) ? q[0] : q)?.trim() ?? "";
  return <Catalog key={query} products={products} initialQuery={query} showCollectionFilter isSearchPage />;
}
