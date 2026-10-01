import Link from "next/link";
import PageHero, { crumbLd } from "./PageHero";
import Reveal from "./Reveal";
import Faq, { faqLd } from "./Faq";
import JsonLd from "./JsonLd";
import type { Landing } from "@/lib/landingPages";
import { getServicePage, priceAmount, shortPrice } from "@/lib/servicePages";
import { site, abs, bundles, offers } from "@/lib/site";
import { pageMeta } from "@/lib/meta";

export const landingMeta = (l: Landing) => pageMeta({ title: l.metaTitle, description: l.description, path: `/${l.slug}` });

// The cheapest single service, read from the price list so this line never goes stale.
const singleFrom = Math.min(...offers.map((o) => Number(priceAmount(o.price)))).toLocaleString("en-US");

export default function LandingPage({ l }: { l: Landing }) {
  const crumbs = [{ name: l.nav, href: `/${l.slug}` }];
  return (
    <>
      <PageHero eyebrow={l.eyebrow} crumbs={crumbs} title={<>{l.h1} <span className="hl">{l.h1Mark}</span></>} lede={l.lede} />
      <section className="band">
        <div className="wrap grid gap-14 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0">
            <div className="card max-w-[72ch] border-l-2 !border-l-mark p-7"><p className="eyebrow">Quick answer</p><h2 className="mt-3 text-[24px] font-bold">{l.quickQ}</h2><p className="mt-3 text-[18px] leading-relaxed">{l.quickA}</p></div>
            <div className="card mt-5 max-w-[72ch] p-7">
              <p className="eyebrow">What it costs</p>
              <ul className="mt-4 divide-y divide-line">
                {bundles.map((b) => (
                  <li key={b.id} className="py-3 first:pt-0">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4"><Link href={b.href} className="text-[18px] font-bold hover:text-gold">{b.name}</Link><span className="font-mono text-[14px] text-gold">{b.price}/mo</span></div>
                    <p className="mt-1 text-[15.5px] text-muted">{b.short}</p>
                  </li>
                ))}
                <li className="py-3 last:pb-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4"><Link href="/services" className="text-[18px] font-bold hover:text-gold">Single services</Link><span className="font-mono text-[14px] text-gold">from ${singleFrom}</span></div>
                  <p className="mt-1 text-[15.5px] text-muted">One job done well, such as a website checkup, technical fixes or AI search optimization.</p>
                </li>
              </ul>
              <p className="mt-4 text-[14.5px] text-muted">Month to month, no contracts. <Link href="/pricing" className="text-link underline underline-offset-4 hover:text-gold">Every price</Link> is on the pricing page.</p>
            </div>
            <div className="prose mt-4">
              {l.sections.map((s) => (
                <Reveal key={s.h}>
                  <h2>{s.h}</h2>
                  {s.p.map((t) => <p key={t.slice(0, 40)} className="mt-[1.15em]">{t}</p>)}
                  {s.list && (s.ordered ? <ol className="mt-[1.15em]">{s.list.map((t) => <li key={t.slice(0, 40)}>{t}</li>)}</ol> : <ul className="mt-[1.15em]">{s.list.map((t) => <li key={t.slice(0, 40)}>{t}</li>)}</ul>)}
                </Reveal>
              ))}
              {l.table && (
                <Reveal className="!mt-12">
                  <div className="table-wrap"><table><caption className="sr-only">{l.table.caption}</caption><thead><tr>{l.table.head.map((h) => <th key={h} scope="col">{h}</th>)}</tr></thead><tbody>{l.table.rows.map((r) => <tr key={r[0]}>{r.map((c, i) => i === 0 ? <th key={c} scope="row" className="!bg-transparent !font-sans !text-[15px] !normal-case !tracking-normal !text-text">{c}</th> : <td key={c}>{c}</td>)}</tr>)}</tbody></table></div>
                </Reveal>
              )}
            </div>
          </div>
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="card p-7">
              <p className="eyebrow">Free call</p>
              <p className="mt-3 font-[family-name:var(--font-display)] text-[22px] font-bold leading-snug">Look at your website with us for {site.callMinutes} minutes.</p>
              <p className="mt-3 text-[15.5px] text-muted">On Google Meet. You leave with one thing worth fixing this week.</p>
              <Link href="/book-a-call" className="btn btn-primary mt-6 w-full">Book a free call</Link>
            </div>
          </aside>
        </div>
      </section>
      <section className="band band-line">
        <div className="wrap">
          <Reveal><p className="eyebrow">How we can help</p><h2 className="h-lg mt-5">Services that fit</h2></Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {l.services.map((slug, i) => { const s = getServicePage(slug)!; return (
              <Reveal key={slug} delay={(i % 3) * 100}><Link href={`/services/${slug}`} className="card card-hover block h-full p-7"><h3 className="text-[21px] font-bold">{s.name}</h3><p className="mt-2 text-[15.5px] text-muted">{s.lede}</p><p className="mt-5 flex justify-between font-mono text-[13px] text-gold"><span>Learn more →</span><span>{shortPrice(s)}</span></p></Link></Reveal>
            ); })}
          </div>
        </div>
      </section>
      <section className="band band-line">
        <div className="wrap grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal><p className="eyebrow">FAQ</p><h2 className="h-lg mt-5">Common questions</h2></Reveal>
          <Reveal delay={100}><Faq items={l.faqs} /></Reveal>
        </div>
      </section>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebPage", name: l.metaTitle, description: l.description, url: abs(`/${l.slug}`), about: { "@id": abs("/#org") }, isPartOf: { "@id": abs("/#website") } }} />
      <JsonLd data={crumbLd(crumbs)} />
      <JsonLd data={faqLd(l.faqs)} />
    </>
  );
}
