import Image from "next/image";
import Link from "next/link";
import type { JournalPost } from "@/lib/types";
import { cn, formatDate } from "@/lib/format";
import { Reveal } from "@/components/motion/Reveal";

/**
 * "From the Journal": desktop = one tall card + two horizontal cards; tablet =
 * three horizontal cards; phone = three stacked vertical cards.
 */
export function JournalFeature({
  title,
  description,
  posts,
}: {
  title: string;
  description: string;
  posts: JournalPost[];
}) {
  const list = posts.slice(0, 3);
  if (!list.length) return null;
  const [main, ...rest] = list;
  return (
    <section data-section="Blog" className="container-site section-y">
      <Reveal className="flex flex-col items-start gap-3">
        <h2 className="h-section">{title}</h2>
        <p className="lead max-w-[280px] md:max-w-[489px]">{description}</p>
      </Reveal>

      <Reveal duration={1.2} className="relative mt-14 flex flex-col gap-6 md:mt-16 md:gap-4 lg:mt-[72px] lg:grid lg:grid-cols-[560fr_684fr]">
        <Link
          href="/journal"
          className="absolute top-[calc(100%+23px)] right-[3px] text-[14px] leading-[1.2] font-medium tracking-[-0.02em] text-muted md:-top-[30px] md:text-[15px] lg:text-[16px]"
        >
          View More
        </Link>
        {/* phone + tablet: every post the same way */}
        <div className="flex flex-col gap-[18px] md:gap-5 lg:hidden">
          {list.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
        {/* desktop: feature + two */}
        <div className="hidden lg:block">
          <PostCard post={main} tall />
        </div>
        <div className="hidden gap-5 lg:grid">
          {rest.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      </Reveal>
    </section>
  );
}

const meta = "text-[14px] leading-[1.2] font-medium tracking-[-0.02em] text-muted md:text-[16px] lg:text-[18px]";

/** Journal teaser. Vertical on phones (and the desktop feature), horizontal from tablet up. */
function PostCard({ post, tall }: { post: JournalPost; tall?: boolean }) {
  return (
    <Link
      href={`/journal/${post.slug}`}
      className={cn(
        "group flex flex-col gap-[22px] bg-[rgba(241,241,241,0.88)] p-4",
        tall ? "h-full rounded-xl lg:p-6" : "rounded-xl md:h-[250px] md:flex-row md:rounded-2xl md:p-6 lg:h-[249px]",
      )}
    >
      <div
        className={cn(
          "relative shrink-0 overflow-hidden rounded-[10px]",
          tall ? "aspect-[512/320]" : "aspect-[318/258] md:aspect-auto md:h-full md:w-[348px] lg:w-[246px]",
        )}
      >
        {post.image && (
          <Image
            src={post.image.src}
            alt={post.title}
            fill
            sizes={tall ? "(min-width: 1200px) 512px, 100vw" : "(min-width: 1200px) 246px, (min-width: 810px) 348px, 100vw"}
            className="object-cover"
            style={{ objectPosition: post.image.position }}
          />
        )}
      </div>
      <div className={cn("flex flex-1 flex-col gap-6", !tall && "md:justify-between md:py-5")}>
        <div className="flex flex-col gap-3">
          <h3 className="text-[20px] leading-[1.15] tracking-[-0.02em] lg:text-[24px]">{post.title}</h3>
          <p className="text-[16px] leading-[1.2] tracking-[-0.02em] text-muted lg:text-[18px]">{post.excerpt}</p>
        </div>
        <div className={cn("flex items-center justify-between", meta)}>
          <time dateTime={post.date ?? undefined}>{formatDate(post.date)}</time>
          <span className={cn(!tall && "md:hidden")}>Read More</span>
        </div>
      </div>
    </Link>
  );
}

/** Journal list card ("Style 3"): photo, title, excerpt, date. */
export function JournalCard({ post }: { post: JournalPost }) {
  return (
    <Link href={`/journal/${post.slug}`} className="group flex flex-col gap-[22px]">
      <div className="relative h-[280px] overflow-hidden rounded-[10px] bg-surface">
        {post.image && (
          <Image
            src={post.image.src}
            alt={post.title}
            fill
            sizes="(min-width: 1200px) 407px, (min-width: 810px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 ease-[cubic-bezier(.44,0,.56,1)] group-hover:scale-[1.03]"
            style={{ objectPosition: post.image.position }}
          />
        )}
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <h3 className="line-clamp-1 text-[20px] leading-[1.15] tracking-[-0.02em] lg:text-[24px]">{post.title}</h3>
          <p className="text-[16px] leading-[1.2] tracking-[-0.02em] text-muted lg:text-[18px]">{post.excerpt}</p>
        </div>
        <time dateTime={post.date ?? undefined} className={meta}>
          {formatDate(post.date)}
        </time>
      </div>
    </Link>
  );
}
