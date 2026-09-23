import Link from "next/link";
import PageHero, { crumbLd } from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import Faq, { faqLd } from "@/components/Faq";
import JsonLd from "@/components/JsonLd";
import { pageMeta } from "@/lib/meta";
import { site, offers, abs } from "@/lib/site";

export const metadata = pageMeta({
  title: "Pricing: What SEO and Website Work Costs",
  description: "Plain prices for SEO, content, local search, and website work. A fixed quote before anything starts, no long contracts, and a free audit so you know what you need first.",
  path: "/pricing",
  absolute: true,
});

const faqs = [
  { q: "Why are these prices a range?", a: "Because a five-page local site and a 500-product shop need very different work. The range tells you whether we are in your budget. After a free call you get one fixed price in writing, and it does not move." },
  { q: "Do I have to sign a contract?", a: "No. Monthly work is month to month and you can stop whenever you like. One-off work is quoted and paid once." },
  { q: "How do I know what I need?", a: "Run the free audit first. It tells you what is actually wrong with your website, in plain English, and costs nothing. Then we talk about which of it is worth paying to fix." },
  { q: "Do you guarantee first place on Google?", a: "No, and be careful with anyone who does. Google and AI tools decide their own results. We commit to specific work, honest reporting, and a person checking everything." },
  { q: "How do I pay?", a: "By bank transfer or card, invoiced before the work starts for one-off projects, and monthly in advance for ongoing work." },
  { q: "What if I only need one small thing?", a: "Say so on the call. If the honest answer is a one-hour fix or a free guide you can follow yourself, we will tell you that rather than sell you a package." },
];

export default function Pricing() {
  const crumbs = [{ name: "Pricing", href: "/pricing" }];
  return (
    <>
      <PageHero eyebrow="Pricing" crumbs={crumbs}
        title={<>What this costs, <span className="hl">before you call</span></>}
        lede="Most agencies hide their prices until they have you on the phone. These are ours. You get one fixed quote in writing after a free call, and it does not move." />

      <section className="band">
        <div className="wrap">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {offers.map((o, i) => (
              <Reveal key={o.id} delay={(i % 3) * 90}>
                <div className="card flex h-full flex-col p-7">
                  <p className="eyebrow">{o.name}</p>
                  <p className="mt-3 flex items-baseline gap-2">
                    <span className="font-[family-name:var(--font-display)] text-[32px] font-bold leading-none">{o.price}</span>
                    <span className="font-mono text-[12px] uppercase tracking-widest text-muted">{o.unit}</span>
                  </p>
                  <p className="mt-4 text-[15.5px] text-muted">{o.plain}</p>
                  <ul className="mt-5 flex-1 space-y-2.5 border-t border-line pt-5 text-[15px]">
                    {o.get.map((g) => (
                      <li key={g} className="flex gap-2.5"><span aria-hidden className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-mark" />{g}</li>
                    ))}
                  </ul>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link href="/book-a-call" className="btn btn-primary !py-2.5 !px-4 !text-[15px]">Book a call</Link>
                    <Link href={o.href} className="btn btn-ghost !py-2.5 !px-4 !text-[15px]">How it works</Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-14">
            <div className="card grid items-center gap-8 p-8 sm:p-12 lg:grid-cols-[1.35fr_0.65fr]">
              <div>
                <p className="eyebrow">Not sure which</p>
                <h2 className="h-lg mt-4 !text-[clamp(26px,3.2vw,38px)]">Get the free audit first.</h2>
                <p className="lede mt-4 max-w-2xl">It reads every page of your website and tells you exactly what is wrong, in plain English. Free, no card, and yours to keep whether or not you hire us. Most people find they need less than they expected.</p>
              </div>
              <div className="flex lg:justify-end"><Link href="/tools/seo-checklist" className="btn btn-primary">Audit my website free <span aria-hidden>→</span></Link></div>
            </div>
          </Reveal>

          <Reveal className="mt-10">
            <p className="max-w-3xl text-[15px] text-muted">
              Every price above is a starting point, not a final bill. After a free {site.callMinutes}-minute call you get one written quote covering exactly what will be done. If we think you do not need us, we will say so.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="band band-line">
        <div className="wrap grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <p className="eyebrow">FAQ</p>
            <h2 className="h-lg mt-5">Questions about cost</h2>
            <p className="mt-6 text-muted">Want to see the full list of what we do? <Link className="text-link underline underline-offset-4 hover:text-mark" href="/services">All services</Link>.</p>
          </Reveal>
          <Reveal delay={100}><Faq items={faqs} /></Reveal>
        </div>
      </section>

      <JsonLd data={{ "@context": "https://schema.org", "@type": "OfferCatalog", name: "SEO and website services", url: abs("/pricing"), provider: { "@id": abs("/#org") }, itemListElement: offers.map((o) => ({ "@type": "Offer", name: o.name, description: o.plain, url: abs(o.href), priceSpecification: { "@type": "PriceSpecification", priceCurrency: "USD", description: `${o.price} ${o.unit}` } })) }} />
      <JsonLd data={crumbLd(crumbs)} />
      <JsonLd data={faqLd(faqs)} />
    </>
  );
}
