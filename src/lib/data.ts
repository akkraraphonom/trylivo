import editorialProductsJson from "@/data/editorial-products.json";
import productsJson from "@/data/products.json";
import collectionsJson from "@/data/collections.json";
import categoriesJson from "@/data/categories.json";
import journalJson from "@/data/journal.json";
import legalJson from "@/data/legal.json";
import sizeGuideJson from "@/data/size-guide.json";
import type { Collection, JournalPost, LegalPage, Product, RichNode } from "./types";

export const editorialProducts = editorialProductsJson;
export const products: Product[] = [...productsJson as Product[], ...editorialProducts];
export const collections = collectionsJson as Collection[];
export const categories = categoriesJson as Collection[];
export const journal = (journalJson as JournalPost[])
  .slice()
  .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
export const legalPages = legalJson as LegalPage[];
export const sizeGuide = sizeGuideJson as RichNode[];

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const isNew = (p: Product) => p.collections.includes("New Arrivals");

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getCollection = (slug: string) => collections.find((c) => c.slug === slug);
export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const getPost = (slug: string) => journal.find((j) => j.slug === slug);
export const getLegal = (slug: string) => legalPages.find((l) => l.slug === slug);

export function productsInCollection(slug: string) {
  if (slug === "all") return products;
  return products.filter((p) => p.collections.some((c) => slugify(c) === slug));
}

export function productsInCategory(slug: string) {
  if (slug === "all") return products;
  return products.filter((p) => slugify(p.type) === slug);
}

export function relatedProducts(product: Product, limit = 8) {
  const same = products.filter((p) => p.slug !== product.slug && p.type === product.type);
  const rest = products.filter((p) => p.slug !== product.slug && p.type !== product.type);
  return [...same, ...rest].slice(0, limit);
}

/** Product types in the order shown on the home "Best Sellers" tabs. */
export const productTypes = ["Jacket", "Sweater", "Hoodie", "T-Shirt", "Cardigan"];

/** Index (0-based) of the first image for a colour value. */
export function imageIndexForColor(p: Product, color: string | undefined) {
  if (!color) return 0;
  const v = p.variants.find((v) => v.title.split(" / ")[0] === color && v.image);
  return v?.image ? Math.min(v.image - 1, p.images.length - 1) : 0;
}

export function colorOptions(p: Product) {
  return p.options.find((o) => o.name.toLowerCase() === "color")?.values ?? [];
}

export function sizeOptions(p: Product) {
  return p.options.find((o) => o.name.toLowerCase() === "size")?.values ?? [];
}

export function richToText(nodes: RichNode[]): string {
  return nodes.map((n) => (typeof n === "string" ? n : richToText(n.c))).join(" ");
}
