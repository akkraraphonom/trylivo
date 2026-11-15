import type { Metadata } from "next";
import { journal } from "@/lib/data";
import { pageHeroes } from "@/lib/site";
import { PageHero } from "@/components/sections/PageHero";
import { JournalGrid } from "@/components/journal/JournalGrid";

export const metadata: Metadata = {
  title: "Journal",
  description: pageHeroes.journal.text,
};

export default function JournalPage() {
  const hero = pageHeroes.journal;
  return (
    <>
      <PageHero image={hero.image} title={hero.title} text={hero.text} />
      <JournalGrid posts={journal} />
    </>
  );
}
