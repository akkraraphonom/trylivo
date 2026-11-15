export type ImageAsset = {
  src: string;
  width?: number;
  height?: number;
  /** CSS object-position, e.g. "24.3% 0%" */
  position?: string;
  alt?: string;
};

/** Rich text tree converted from Framer CMS: a string or an element node. */
export type RichNode = string | { t: string; a?: Record<string, string | number>; c: RichNode[] };

export type ProductOption = { name: string; values: string[] };

export type ProductVariant = {
  id: string;
  /** e.g. "Black / M" */
  title: string;
  /** 1-based index into product.images for this variant's colour */
  image: number | null;
};

export type Product = {
  id: string;
  title: string;
  slug: string;
  price: number;
  comparePrice: number | null;
  images: ImageAsset[];
  options: ProductOption[];
  variants: ProductVariant[];
  description: RichNode[];
  excerpt: string;
  /** Collection titles: "Men", "Women", "Kid", "New Arrivals", "Best Sellers", "Seasonal Drop" */
  collections: string[];
  /** Product type / category title: "Jacket", "Hoodie", ... */
  type: string;
  tags: string[];
  createdAt: string | null;
};

export type Collection = {
  title: string;
  slug: string;
  description: string;
  image: ImageAsset | null;
};

export type JournalPost = {
  title: string;
  slug: string;
  image: ImageAsset | null;
  excerpt: string;
  date: string | null;
  category: string;
  content: RichNode[];
};

export type LegalPage = {
  title: string;
  slug: string;
  excerpt: string;
  content: RichNode[];
};
