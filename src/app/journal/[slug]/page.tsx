import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPost, journal } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { PageHero } from "@/components/sections/PageHero";
import { RichText } from "@/components/ui/RichText";
import { JournalFeature } from "@/components/journal/JournalCards";
import { Reveal } from "@/components/motion/Reveal";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return journal.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { type: "article", images: post.image ? [post.image.src] : [] },
  };
}

export default async function JournalPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = journal.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      <PageHero
        image={post.image?.src ?? "/images/ZKB4fWu4waKQDEeUJuY7xYwOsY0.png"}
        position={post.image?.position}
        eyebrow={post.category}
        title={post.title}
        text={post.excerpt}
      />
      <Reveal
        as="article"
        section="Content"
        y={40}
        className="mx-auto flex max-w-[900px] flex-col gap-5 px-5 pt-14 pb-20 md:px-[30px] lg:px-[50px] lg:pt-[72px] lg:pb-32"
      >
        <time dateTime={post.date ?? undefined} className="text-[16px] leading-[1.4] tracking-[-0.03em] text-muted lg:text-[20px]">
          Date: {formatDate(post.date)}
        </time>
        <RichText nodes={post.content} className="prose-post" />
      </Reveal>
      <JournalFeature
        title="Related Journals"
        description="Discover more articles to help you refine your personal style."
        posts={related}
      />
    </>
  );
}
