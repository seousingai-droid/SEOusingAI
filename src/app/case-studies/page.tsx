import type { Metadata } from "next";
import Link from "next/link";
import PageHero, { crumbLd } from "@/components/PageHero";
import CaseStudyCard from "@/components/CaseStudyCard";
import JsonLd from "@/components/JsonLd";
import { getCaseStudies } from "@/lib/caseStudies";
import { pageMeta } from "@/lib/meta";
import { site } from "@/lib/site";

const studies = getCaseStudies();
export const metadata: Metadata = {
  ...pageMeta({ title: "Case Studies: Real Results, Real Numbers", description: "Case studies from SEO Using AI: what the client's problem was, what we did, and what changed, with numbers from Google Search Console and other named sources.", path: "/case-studies", absolute: true }),
  // Not listed until there is at least one real study. A page of promises is thin content.
  ...(studies.length ? {} : { robots: { index: false, follow: true } }),
};

export default function CaseStudies() {
  const crumbs = [{ name: "Case studies", href: "/case-studies" }];
  return (
    <>
      <PageHero eyebrow="Case studies" crumbs={crumbs} title={<>Real results, with the <span className="hl">numbers to prove it</span></>} lede="Every study names its source, covers a stated period, and is published with the client's written permission. If we cannot show the numbers, we do not tell the story." />
      <section className="band">
        <div className="wrap">
          {studies.length ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{studies.map((c) => <CaseStudyCard key={c.slug} c={c} />)}</div>
          ) : (
            <div className="card max-w-2xl p-8 sm:p-10">
              <p className="eyebrow">Nothing to show yet, on purpose</p>
              <h2 className="mt-4 text-[clamp(24px,3vw,32px)] font-bold">We publish results after we get them, not before.</h2>
              <p className="mt-4 text-muted">SEO Using AI is new. Rather than borrow screenshots or invent numbers, this page stays empty until the first client agrees to share real Search Console data. When it does, it will show the problem, the work, the numbers, and their source.</p>
              <p className="mt-4 text-muted">Want to see what we can find on your site today? Run the free checker, or book a call.</p>
              <div className="mt-8 flex flex-wrap gap-3"><Link href="/tools/seo-checklist" className="btn btn-primary">Check my website free</Link><Link href="/book-a-call" className="btn btn-ghost">Book a free call</Link></div>
            </div>
          )}
          <p className="mt-12 max-w-2xl text-[15px] text-muted">How we write these: numbers come from Google Search Console, Google Analytics, Google Business Profile, or the client's booking system, over a stated period. Screenshots are exported from those tools and only have private details blurred. Quotes are the client's own words. Read our <Link className="text-link underline underline-offset-4 hover:text-mark" href="/editorial-standards">editorial standards</Link>.</p>
        </div>
      </section>
      <JsonLd data={crumbLd(crumbs)} />
      {studies.length > 0 && <JsonLd data={{ "@context": "https://schema.org", "@type": "ItemList", name: `${site.name} case studies`, itemListElement: studies.map((c, i) => ({ "@type": "ListItem", position: i + 1, url: `${site.url}/case-studies/${c.slug}`, name: c.headline })) }} />}
    </>
  );
}
