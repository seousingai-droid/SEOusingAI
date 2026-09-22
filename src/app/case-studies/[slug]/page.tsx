import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import PageHero, { crumbLd } from "@/components/PageHero";
import CaseStudyCard from "@/components/CaseStudyCard";
import JsonLd from "@/components/JsonLd";
import { getCaseStudies, getCaseStudy } from "@/lib/caseStudies";
import { pageMeta } from "@/lib/meta";
import { abs } from "@/lib/site";
import { formatDate } from "@/lib/content";

export const dynamicParams = false;
export const generateStaticParams = () => getCaseStudies().map((c) => ({ slug: c.slug }));
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = getCaseStudy((await params).slug); if (!c) return {};
  return pageMeta({ title: `${c.headline} | Case Study`, description: c.summary, path: `/case-studies/${c.slug}`, absolute: true, type: "article", image: c.screenshots[0]?.file, published: c.published, modified: c.published });
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const c = getCaseStudy((await params).slug); if (!c) notFound();
  const others = getCaseStudies().filter((x) => x.slug !== c.slug).slice(0, 3);
  const crumbs = [{ name: "Case studies", href: "/case-studies" }, { name: c.client, href: `/case-studies/${c.slug}` }];
  return (
    <article>
      <PageHero eyebrow={`Case study · ${c.industry}`} crumbs={crumbs} title={c.headline} lede={c.summary} />
      <div className="wrap grid gap-14 py-14 lg:grid-cols-[minmax(0,1fr)_300px] lg:py-20">
        <div className="min-w-0">
          <div className="grid gap-4 sm:grid-cols-2">
            {c.metrics.map((m) => (
              <figure key={m.label} className="card p-6">
                <p className="text-[15px] text-muted">{m.label}</p>
                <p className="mt-2 flex flex-wrap items-baseline gap-x-3"><span className="text-[18px] text-muted line-through decoration-muted/60">{m.before}</span><span className="font-[family-name:var(--font-display)] text-[34px] font-bold text-mark">{m.after}</span></p>
                <figcaption className="mt-3 font-mono text-[11.5px] text-muted">Source: {m.source} · {c.period}</figcaption>
              </figure>
            ))}
          </div>
          {c.screenshots.map((s) => (
            <figure key={s.file} className="mt-8"><Image src={s.file} alt={s.alt} width={1600} height={900} sizes="(min-width: 1024px) 760px, 100vw" className="figure-img" /><figcaption className="mt-2 text-[14.5px] text-muted">{s.caption}</figcaption></figure>
          ))}
          <div className="prose mt-10" dangerouslySetInnerHTML={{ __html: c.html }} />
          {c.quote && <blockquote className="card mt-12 max-w-[72ch] border-l-2 !border-l-mark p-7"><p className="text-[19px] leading-relaxed">“{c.quote.text}”</p><footer className="mt-4 text-[15px] text-muted">{c.quote.name}, {c.quote.role}</footer></blockquote>}
          <p className="mt-10 font-mono text-[13px] text-muted">Published {formatDate(c.published)} with the client&apos;s written permission. Numbers cover {c.period}.</p>
        </div>
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="card p-7">
            <p className="eyebrow">About this client</p>
            <dl className="mt-4 space-y-3 text-[15px]">
              <div><dt className="text-muted">Business</dt><dd className="font-medium">{c.website ? <a className="text-link underline underline-offset-4 hover:text-mark" href={c.website} target="_blank" rel="noopener">{c.client}</a> : c.client}</dd></div>
              <div><dt className="text-muted">Industry</dt><dd className="font-medium">{c.industry}{c.location ? `, ${c.location}` : ""}</dd></div>
              <div><dt className="text-muted">Services</dt><dd className="font-medium">{c.services.join(", ")}</dd></div>
              <div><dt className="text-muted">Period</dt><dd className="font-medium">{c.period}</dd></div>
            </dl>
            <Link href="/book-a-call" className="btn btn-primary mt-7 w-full">Get results like these</Link>
          </div>
        </aside>
      </div>
      {others.length > 0 && <section className="band band-line"><div className="wrap"><h2 className="h-md">More case studies</h2><div className="mt-8 grid gap-5 md:grid-cols-3">{others.map((o) => <CaseStudyCard key={o.slug} c={o} />)}</div></div></section>}
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Article", headline: c.headline, description: c.summary, datePublished: c.published, dateModified: c.published, mainEntityOfPage: abs(`/case-studies/${c.slug}`), author: { "@id": abs("/#org") }, publisher: { "@id": abs("/#org") }, image: c.screenshots[0] ? abs(c.screenshots[0].file) : abs("/opengraph-image"), about: { "@type": "Organization", name: c.client, ...(c.website ? { url: c.website } : {}) } }} />
      <JsonLd data={crumbLd(crumbs)} />
    </article>
  );
}
