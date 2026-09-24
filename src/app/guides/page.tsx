import { pageMeta } from "@/lib/meta";
import PageHero, { crumbLd } from "@/components/PageHero";
import JsonLd from "@/components/JsonLd";
import { getGuides } from "@/lib/content";
import GuideCard from "@/components/GuideCard";

export const metadata = pageMeta({
  title: "AI SEO Guides: Step-by-Step Tutorials",
  description: "Free AI SEO guides covering the full workflow: how to use AI for SEO, keyword research, prompts, tool comparisons, and getting cited by AI answers.",
  path: "/guides",
});

export default function Guides() {
  const guides = getGuides();
  const crumbs = [{ name: "Guides", href: "/guides" }];
  return (
    <>
      <PageHero eyebrow="Guides" crumbs={crumbs} title={<>AI SEO guides, written to be <span className="hl">used</span></>} lede="Each guide answers one job in the AI SEO workflow. Start with the first one. The rest link back to it." />
      <section className="band">
        <div className="wrap">
          {guides[0] && <div className="mb-5"><GuideCard g={guides[0]} size="lg" priority /></div>}
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {guides.slice(1).map((g) => <GuideCard key={g.slug} g={g} />)}
          </div>
        </div>
      </section>
      <JsonLd data={crumbLd(crumbs)} />
    </>
  );
}
