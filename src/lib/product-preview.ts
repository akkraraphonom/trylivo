import colorImages from "@/data/product-color-images.json";
import { colorOptions, imageIndexForColor } from "./data";
import type { Product } from "./types";

const productPortraits: Record<string, string> = {
  "everyday-hoodie": "new-arrival-everyday-hoodie-2x.webp",
  "oversized-graphic-tee": "new-arrival-oversized-graphic-tee-2x.webp",
  "zipper-jacket": "seasonal-zipper-jacket-2x.webp",
  "relaxed-fit-cardigan": "seasonal-relaxed-fit-cardigan-2x.webp",
  "kids-puffer-jacket": "seasonal-kids-puffer-jacket-2x-v2.webp",
  "kids-graphic-t-shirt": "best-seller-kids-graphic-t-shirt-2x.webp",
  "classic-hoodie": "best-seller-classic-hoodie-2x.webp",
  "soft-knit-sweater": "best-seller-soft-knit-sweater-2x.webp",
};

const previewPairs: Partial<Record<string, [string, string]>> = {
  "kids-everyday-hoodie": ["seasonal-kids-everyday-hoodie-smooth-hem-2x.webp", "seasonal-kids-everyday-hoodie-garment-smooth-trim.webp"],
  "lightweight-jacket": ["new-arrival-lightweight-jacket-hem-retouched.webp", "new-arrival-lightweight-jacket-hover-2x-v2.webp"],
  "graphic-sweatshirt": ["best-seller-graphic-sweatshirt-model-smooth-trim.webp", "best-seller-graphic-sweatshirt-garment-smooth-trim.webp"],
};

export function productPreviewImages(product: Product) {
  const pair = previewPairs[product.slug];
  if (pair) return pair.map((file) => ({ src: `/images/${file}` }));
  const portrait = productPortraits[product.slug];
  if (!portrait) return product.images;

  const hover = portrait
    .replace("-2x", "-hover-2x")
    .replace(/^(new-arrival-.*)-2x\.webp$/, "$1-2x-v2.webp");

  return [{ src: `/images/${portrait}` }, { src: `/images/${hover}` }];
}

const imagesByColor: Record<string, Record<string, Product["images"]>> = colorImages;

export function productImagesForColor(product: Product, color?: string) {
  const colors = colorOptions(product);
  if (!color || color === colors[0]) {
    if (product.images[0]?.src.endsWith(".webp")) return product.images.slice(0, 2);
    return productPreviewImages(product);
  }

  const updated = imagesByColor[product.slug]?.[color];
  if (updated) return updated;

  const start = imageIndexForColor(product, color);
  const next = colors
    .map((option) => imageIndexForColor(product, option))
    .filter((index) => index > start)
    .sort((a, b) => a - b)[0];
  return product.images.slice(start, next);
}
