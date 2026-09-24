import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { crumbLd } from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import Faq, { faqLd } from "@/components/Faq";
import JsonLd from "@/components/JsonLd";
import { ScanArt, FixArt, WriteArt, LinksArt, MapPin, ChatRecommend, GapArt, SocialArt, AutomationArt, RedesignArt } from "@/components/Illustrations";
import { servicePages, getServicePage } from "@/lib/servicePages";
import { site, abs } from "@/lib/site";
import { pageMeta } from "@/lib/meta";

export const dynamicParams = false;
export const generateStaticParams = () => servicePages.map((s) => ({ slug: s.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const s = getServicePage((await params).slug);
  if (!s) return {};
  return pageMeta({ title: s.metaTitle, description: s.description, path: `/services/${s.slug}`, absolute: true });
}

const art = { scan: <ScanArt />, fix: <FixArt />, write: <WriteArt />, links: <LinksArt />, map: <MapPin />, chat: <ChatRecommend />, gap: <GapArt />, social: <SocialArt />, automation: <AutomationArt />, redesign: <RedesignArt /> };
const Check = () => (<span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-mark text-ink"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" aria-hidden><path d="m5 12 5 5 9-10" /></svg></span>);

export default async function ServiceDetail({ params }: { params: Promise<{ slug: string }> }) {
  const s = getServicePage((await params).slug);
  if (!s) notFound();
  const crumbs = [{ name: "Services", href: "/services" }, { name: s.name, href: `/services/${s.slug}` }];
  const related = s.related.map((r) => getServicePage(r)!).filter(Boolean);
  return (
    <>
      <section className="border-b border-line">
        <div className="wrap grid items-center gap-12 pb-16 pt-12 lg:grid-cols-[1.1fr_0.9fr] lg:pb-24 lg:pt-16">
          <div>
            <nav aria-label="Breadcrumb" className="mb-8 font-mono text-[12.5px] text-muted">
              <ol className="flex flex-wrap gap-2"><li><Link className="hover:text-text" href="/">Home</Link></li><li className="flex gap-2"><span aria-hidden>/</span><Link className="hover:text-text" href="/services">Services</Link></li><li className="flex gap-2"><span aria-hidden>/</span><span className="text-text" aria-current="page">{s.name}</span></li></ol>
            </nav>
            <p className="eyebrow">Service</p>
            <h1 className="h-lg mt-5 !text-[clamp(34px,4.6vw,58px)]">{s.h1} <span className="hl">{s.h1Mark}</span></h1>
            <p className="lede mt-6 max-w-xl">{s.lede}</p>
            <p className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-[family-name:var(--font-display)] text-[30px] font-bold text-mark">{s.price}</span>
              <span className="font-mono text-[12px] uppercase tracking-widest text-muted">{s.unit}</span>
              <span className="text-[14.5px] text-muted">· fixed quote in writing before we start</span>
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/book-a-call" className="btn btn-primary">Book a free call <span aria-hidden>→</span></Link>
              <a href="#what-you-get" className="btn btn-ghost">See what you get</a>
            </div>
          </div>
          {art[s.art]}
        </div>
      </section>

      <section className="band">
        <div className="wrap grid gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal>
            <h2 className="h-lg !text-[clamp(28px,3.4vw,42px)]">{s.quickQ}</h2>
            <p className="mt-6 text-[19px] leading-relaxed text-[#cfd6ec]">{s.quickA}</p>
          </Reveal>
          <Reveal delay={120}>
            <div className="card border-l-2 !border-l-mark p-7">
              <h2 className="font-[family-name:var(--font-display)] text-[22px] font-bold">Signs you need this</h2>
              <ul className="mt-5 space-y-3.5">{s.signs.map((t) => (<li key={t} className="flex gap-3 text-[16px]"><span aria-hidden className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-mark" />{t}</li>))}</ul>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="band band-line">
        <div className="wrap">
          <Reveal><p className="eyebrow">The work</p><h2 className="h-lg mt-5">{s.doTitle}</h2></Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {s.doItems.map(([t, b], i) => (<Reveal key={t} delay={(i % 3) * 100}><div className="card h-full p-7"><h3 className="text-[20px] font-semibold leading-snug">{t}</h3><p className="mt-3 text-[16px] text-muted">{b}</p></div></Reveal>))}
          </div>
        </div>
      </section>

      <section id="what-you-get" className="band band-line scroll-mt-20">
        <div className="wrap grid gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">What you get</p>
            <h2 className="h-lg mt-5">Clear deliverables, fixed price.</h2>
            <p className="mt-4 flex items-baseline gap-3">
              <span className="font-[family-name:var(--font-display)] text-[26px] font-bold">{s.price}</span>
              <span className="font-mono text-[12px] uppercase tracking-widest text-muted">{s.unit}</span>
            </p>
            <ul className="mt-8 space-y-4">{s.get.map((g) => (<li key={g} className="flex gap-3 text-[17.5px]"><Check />{g}</li>))}</ul>
            <p className="mt-8 text-muted">{s.price.startsWith("from") ? "The starting price covers a small website. " : ""}You get a written scope and one fixed price after a free call, before any work starts. {s.unit === "per month" ? "Month to month, stop whenever you like." : "Paid once."}</p>
          </Reveal>
          <Reveal delay={120}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-line bg-ink p-6"><p className="font-[family-name:var(--font-display)] text-[19px] font-bold">What AI does</p><ul className="mt-4 space-y-3">{s.ai.map((t) => <li key={t} className="flex gap-3 text-[15.5px] text-muted"><span aria-hidden className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-link" />{t}</li>)}</ul></div>
              <div className="rounded-2xl border border-mark/70 bg-mark/[0.06] p-6"><p className="font-[family-name:var(--font-display)] text-[19px] font-bold text-mark">What a person does</p><ul className="mt-4 space-y-3">{s.human.map((t) => <li key={t} className="flex gap-3 text-[15.5px]"><span aria-hidden className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-mark" />{t}</li>)}</ul></div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="band band-line">
        <div className="wrap">
          <Reveal><p className="eyebrow">How it works</p><h2 className="h-lg mt-5">Three steps</h2></Reveal>
          <ol className="mt-12 grid gap-5 md:grid-cols-3">
            {s.steps.map(([t, b], i) => (<Reveal key={t} delay={i * 120}><li className="card h-full list-none p-7"><span className="font-mono text-[14px] font-bold text-mark">Step {i + 1}</span><h3 className="mt-4 text-[21px] font-semibold leading-snug">{t}</h3><p className="mt-3 text-[16px] text-muted">{b}</p></li></Reveal>))}
          </ol>
          <Reveal className="mt-10"><div className="rounded-2xl border border-line bg-panel/60 p-7"><h2 className="font-[family-name:var(--font-display)] text-[20px] font-bold">What this will not do</h2><p className="mt-3 max-w-3xl text-muted">{s.honest}</p></div></Reveal>
        </div>
      </section>

      <section className="band band-line">
        <div className="wrap grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal><p className="eyebrow">FAQ</p><h2 className="h-lg mt-5">Questions about {s.name.toLowerCase().replace(/\bai\b/g, "AI").replace(/\bseo\b/g, "SEO").replace(/\bpr\b/g, "PR")}</h2><p className="mt-6 text-muted">Want to learn the method yourself? Read <Link className="text-link underline underline-offset-4 hover:text-mark" href={s.guide.href}>{s.guide.label}</Link>.</p></Reveal>
          <Reveal delay={100}><Faq items={s.faqs} /></Reveal>
        </div>
      </section>

      <section className="band band-line">
        <div className="wrap">
          <h2 className="h-md">Related services</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {related.map((r) => (<Link key={r.slug} href={`/services/${r.slug}`} className="card card-hover p-7"><h3 className="text-[21px] font-bold">{r.name}</h3><p className="mt-2 text-[15.5px] text-muted">{r.lede}</p><p className="mt-5 font-mono text-[13px] text-mark">Learn more →</p></Link>))}
          </div>
          <div className="card mt-12 grid items-center gap-8 p-8 sm:p-12 lg:grid-cols-[1.3fr_0.7fr]">
            <div><h2 className="h-lg !text-[clamp(28px,3.4vw,42px)]">Talk it through on a free call.</h2><p className="lede mt-4 max-w-xl">A {site.callMinutes}-minute Google Meet call. You leave with one thing worth fixing this week, whether or not we work together.</p></div>
            <div className="flex lg:justify-end"><Link href="/book-a-call" className="btn btn-primary">Book a free call <span aria-hidden>→</span></Link></div>
          </div>
        </div>
      </section>

      <JsonLd data={{ "@context": "https://schema.org", "@type": "Service", name: s.name, serviceType: s.name, description: s.description, url: abs(`/services/${s.slug}`), provider: { "@id": abs("/#org") }, areaServed: { "@type": "Country", name: "United States" },
        offers: { "@type": "Offer", priceCurrency: "USD", price: s.price.replace(/[^0-9.]/g, ""), priceSpecification: { "@type": "UnitPriceSpecification", priceCurrency: "USD", price: s.price.replace(/[^0-9.]/g, ""), ...(s.unit === "per month" ? { unitText: "MONTH" } : {}), description: `${s.price} ${s.unit}` }, url: abs(`/services/${s.slug}`) } }} />
      <JsonLd data={crumbLd(crumbs)} />
      <JsonLd data={faqLd(s.faqs)} />
    </>
  );
}
