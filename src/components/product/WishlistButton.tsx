"use client";

import { useStore } from "@/lib/store";
import { cn } from "@/lib/format";
import { HeartIcon } from "@/components/ui/Icons";

/**
 * `reveal`: the round button stays hidden until the card is hovered (on devices with a
 * mouse); it stays visible once the product is saved, and on touch screens.
 */
export function WishlistButton({
  slug,
  className,
  withLabel,
  reveal,
}: {
  slug: string;
  className?: string;
  withLabel?: boolean;
  reveal?: boolean;
}) {
  const { inWishlist, toggleWishlist } = useStore();
  const active = inWishlist(slug);

  if (withLabel) {
    return (
      <button
        type="button"
        onClick={() => toggleWishlist(slug)}
        aria-pressed={active}
        className={cn("inline-flex items-center gap-2 text-[16px] leading-[1.2] font-medium tracking-[-0.02em]", className)}
      >
        <HeartIcon size={20} filled={active} className={cn(active && "text-sale")} />
        {active ? "Saved to wishlist" : "Add to wishlist"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => toggleWishlist(slug)}
      aria-pressed={active}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      className={cn(
        "grid size-9 place-items-center rounded-full border-[0.9px] border-[#ece9e7] bg-white transition-[transform,opacity] duration-200 hover:scale-105",
        reveal &&
          !active &&
          "[@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:focus-visible:opacity-100",
        className,
      )}
    >
      <HeartIcon size={18} filled={active} className={cn(active ? "text-sale" : "text-ink-soft")} />
    </button>
  );
}
