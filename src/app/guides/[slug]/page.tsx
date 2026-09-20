import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero, { crumbLd } from "@/components/PageHero";
import Faq, { faqLd } from "@/components/Faq";
import JsonLd from "@/components/JsonLd";
import { getGuide, getGuides, formatDate } from "@/lib/content";
import { site, abs } from "@/lib/site";
import { pageMeta } from "@/lib/meta";

export const dynamicParams = false;
export function generateStaticParams() {
  return getGuides().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) return {};
  return pageMeta({ title: g.metaTitle, description: g.description, path: `/guides/${g.slug}`, absolute: true, type: "article", image: g.image, published: g.published, modified: g.updated });
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) notFound();
  const all = getGuides();
  const at = all.findIndex((x) => x.slug === g.slug);
  const others = [1, 2, 3].map((n) => all[(at + n) % all.length]);
  const crumbs = [{ name: "Guides", href: "/guides" }, { name: g.title, href: `/guides/${g.slug}` }];
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: g.title,
    description: g.description,
    datePublished: g.published,
    dateModified: g.updated,
    inLanguage: "en-US",
    mainEntityOfPage: abs(`/guides/${g.slug}`),
    author: { "@type": "Organization", "@id": abs("/#org"), name: site.name, url: site.url },
    publisher: { "@id": abs("/#org") },
    image: abs(g.image ?? "/opengraph-image"),
  };
  return (
    <article>
      <PageHero eyebrow={g.eyebrow} crumbs={crumbs} title={g.title} />
      <div className="wrap grid gap-14 py-14 lg:grid-cols-[minmax(0,1fr)_280px] lg:py-20">
        <div className="min-w-0">
          <p className="font-mono text-[13px] text-muted">
            By the <Link className="text-text underline underline-offset-4 hover:text-mark" href="/editorial-standards">{site.editorial.name}</Link> · Last updated <time dateTime={g.updated}>{formatDate(g.updated)}</time> · {g.readMinutes} min read
          </p>
          <div className="card mt-8 max-w-[72ch] border-l-2 !border-l-mark p-7">
            <p className="eyebrow">Quick answer</p>
            <p className="mt-3 text-[18px] leading-relaxed">{g.quickAnswer}</p>
          </div>
          <div className="prose mt-4" dangerouslySetInnerHTML={{ __html: g.html }} />
          {g.faqs.length > 0 && (
            <section className="mt-16 max-w-[72ch]">
              <h2 id="faq" className="mb-6 scroll-mt-24 text-[clamp(26px,3vw,34px)] font-bold">Frequently asked questions</h2>
              <Faq items={g.faqs} />
            </section>
          )}
          <aside className="card mt-16 grid max-w-[72ch] gap-5 p-7 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <p className="font-[family-name:var(--font-display)] text-[20px] font-semibold">Want this done for you?</p>
              <p className="mt-1 text-[15.5px] text-muted">We run this workflow for businesses, with a person checking every fact. Talk it through on a free {site.callMinutes}-minute Google Meet call. Read <Link className="text-link underline underline-offset-4 hover:text-mark" href="/editorial-standards">how we write and check guides</Link>.</p>
            </div>
            <Link href="/book-a-call" className="btn btn-primary">Book a call</Link>
          </aside>
        </div>
        <aside className="hidden lg:block">
          <nav aria-label="On this page" className="sticky top-28">
            <p className="eyebrow mb-4">On this page</p>
            <ul className="space-y-2.5 border-l border-line text-[14.5px] text-muted">
              {g.toc.map((t) => (<li key={t.id}><a className="-ml-px block border-l border-transparent pl-4 hover:border-mark hover:text-text" href={`#${t.id}`}>{t.text}</a></li>))}
              {g.faqs.length > 0 && <li><a className="-ml-px block border-l border-transparent pl-4 hover:border-mark hover:text-text" href="#faq">Frequently asked questions</a></li>}
            </ul>
          </nav>
        </aside>
      </div>
      <section className="band band-line">
        <div className="wrap">
          <h2 className="h-md">Keep going</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {others.map((o) => (
              <Link key={o.slug} href={`/guides/${o.slug}`} className="card card-hover p-7">
                <p className="eyebrow">{o.eyebrow}</p>
                <h3 className="mt-3 text-[20px] font-semibold leading-snug">{o.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <JsonLd data={articleLd} />
      <JsonLd data={crumbLd(crumbs)} />
      {g.faqs.length > 0 && <JsonLd data={faqLd(g.faqs)} />}
    </article>
  );
}
