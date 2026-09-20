import { pageMeta } from "@/lib/meta";
import Link from "next/link";
import PageHero, { crumbLd } from "@/components/PageHero";
import JsonLd from "@/components/JsonLd";
import { getGuides, formatDate } from "@/lib/content";

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
        <div className="wrap grid gap-5 md:grid-cols-2">
          {guides.map((g, i) => (
            <Link key={g.slug} href={`/guides/${g.slug}`} className={`card card-hover flex flex-col p-8 ${i === 0 ? "md:col-span-2" : ""}`}>
              <p className="eyebrow">{g.eyebrow}</p>
              <h2 className={`mt-4 font-bold leading-tight ${i === 0 ? "text-[clamp(26px,3vw,38px)]" : "text-[25px]"}`}>{g.title}</h2>
              <p className="mt-3 max-w-3xl flex-1 text-muted">{g.description}</p>
              <p className="mt-6 font-mono text-[13px] text-muted">Updated {formatDate(g.updated)} · {g.readMinutes} min read <span className="text-mark">→</span></p>
            </Link>
          ))}
        </div>
      </section>
      <JsonLd data={crumbLd(crumbs)} />
    </>
  );
}
