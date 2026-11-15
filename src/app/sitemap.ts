import type { MetadataRoute } from "next";
import { categories, collections, journal, legalPages, products } from "@/lib/data";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/about",
    "/account",
    "/contact",
    "/journal",
    "/search",
    "/wishlist",
    ...collections.map((c) => `/shop/collection/${c.slug}`),
    ...categories.map((c) => `/shop/category/${c.slug}`),
    ...products.map((p) => `/product/${p.slug}`),
    ...journal.map((p) => `/journal/${p.slug}`),
    ...legalPages.map((l) => `/${l.slug}`),
  ];
  return paths.map((p) => ({ url: `${BASE}${p}` }));
}
