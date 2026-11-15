import type { Metadata } from "next";
import { pageHeroes } from "@/lib/site";
import { PageHero } from "@/components/sections/PageHero";
import { WishlistGrid } from "@/components/shop/WishlistGrid";

export const metadata: Metadata = { title: "Wishlist" };

export default function WishlistPage() {
  const hero = pageHeroes.wishlist;
  return (
    <>
      <PageHero
        image={hero.image}
        mobileImage="/images/trylivo-wishlist-mobile-retouched.webp"
        unoptimized
        position="76% 26%"
        title={hero.title}
        text={hero.text}
        className="max-md:[&>div:first-child]:after:absolute max-md:[&>div:first-child]:after:inset-0 max-md:[&>div:first-child]:after:bg-gradient-to-t max-md:[&>div:first-child]:after:from-black/55 max-md:[&>div:first-child]:after:via-black/30 max-md:[&>div:first-child]:after:to-transparent"
      />
      <WishlistGrid />
    </>
  );
}
