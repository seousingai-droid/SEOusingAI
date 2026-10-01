import Link from "next/link";
import PageHero, { crumbLd } from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import Faq, { faqLd } from "@/components/Faq";
import JsonLd from "@/components/JsonLd";
import { pageMeta } from "@/lib/meta";
import Bundles from "@/components/Bundles";
import { site, offers, bundles, abs } from "@/lib/site";
import { priceSpec } from "@/lib/servicePages";

export const metadata = pageMeta({
  title: "Pricing: SEO Using AI Bundles and Services",
  description: "SEO Using AI prices: monthly bundles for website + SEO and for social media + AI reels, plus single services. Month to month, no contracts.",
  path: "/pricing",
  absolute: true,
});

// The answer to "how much does SEO cost?", built from the price list so it never disagrees with it.
const price = (id: string) => offers.find((o) => o.id === id)!.price;
const managed = bundles.find((b) => b.id === "managed")!.price;
const costAnswer = `With SEO Using AI, SEO for a small business costs ${price("checkup")} for a one-time website checkup, ${price("local")} a month for local SEO on Google Maps, ${price("grow")} a month for new content and links, or ${managed} a month for the managed plan, where we run your website and your SEO. The price depends on how many pages and locations you have, how competitive your searches are, and how much new content you need. Every monthly plan is month to month.`;

const faqs = [
  { q: "How much does SEO cost for a small business?", a: costAnswer },
  { q: "What is the difference between a bundle and a single service?", a: "A bundle is ongoing: one monthly price and we run the whole thing, website and SEO or social media and reels. A single service is one job, like a website checkup or a redesign, quoted and paid once or monthly." },
  { q: "Why are these prices a range?", a: "Because a five-page local site and a 500-product shop need very different work. The range tells you whether we are in your budget. After a free call you get one fixed price in writing, and it does not move." },
  { q: "Do I have to sign a contract?", a: "No. Monthly work is month to month and you can stop whenever you like. One-off work is quoted and paid once." },
  { q: "How do I know what I need?", a: "Book the free call. We look at your website together and tell you what is actually wrong with it. If the honest answer is that you need less than you thought, we will say so." },
  { q: "Do you guarantee first place on Google?", a: "No, and be careful with anyone who does. Google and AI tools decide their own results. We commit to specific work, honest reporting, and a person checking everything." },
  { q: "How do I pay?", a: "By bank transfer or card, invoiced before the work starts for one-off projects, and monthly in advance for ongoing work." },
  { q: "What if I only need one small thing?", a: "Say so on the call. If the honest answer is a one-hour fix or a free guide you can follow yourself, we will tell you that rather than sell you a package." },
];

export default function Pricing() {
  const crumbs = [{ name: "Pricing", href: "/pricing" }];
  return (
    <>
      <PageHero eyebrow="Pricing" crumbs={crumbs}
        title={<>SEO prices, <span className="hl">up front</span></>}
        lede={`Single services from ${price("checkup")}, local SEO ${price("local")} a month, and the managed website and SEO plan ${managed} a month. You get a fixed quote in writing before any work starts.`} />

      <section className="band !pb-0">
        <div className="wrap">
          <div className="card max-w-[72ch] border-l-2 !border-l-mark p-7">
            <p className="eyebrow">Quick answer</p>
            <h2 className="mt-3 text-[24px] font-bold">How much does SEO cost for a small business?</h2>
            <p className="mt-3 text-[18px] leading-relaxed">{costAnswer}</p>
          </div>
        </div>
      </section>

      <section id="bundles" className="band scroll-mt-20">
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">Bundles</p>
            <h2 className="h-lg mt-5">We handle everything, for one monthly price.</h2>
          </Reveal>
          <div className="mt-10"><Bundles /></div>
        </div>
      </section>

      <section className="band band-line">
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">Single services</p>
            <h2 className="h-lg mt-5">Or pick one service.</h2>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
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
                <h2 className="h-lg mt-4 !text-[clamp(26px,3.2vw,38px)]">Start with the free call.</h2>
                <p className="lede mt-4 max-w-2xl">We look at your website together for {site.callMinutes} minutes and tell you what is actually holding it back. You leave with one thing worth fixing this week, whether or not you hire us. Most people find they need less than they expected.</p>
              </div>
              <div className="flex lg:justify-end"><Link href="/book-a-call" className="btn btn-primary">Book a free call <span aria-hidden>→</span></Link></div>
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
            <p className="mt-6 text-muted">Want to see the full list of what we do? <Link className="text-link underline underline-offset-4 hover:text-gold" href="/services">All services</Link>.</p>
          </Reveal>
          <Reveal delay={100}><Faq items={faqs} /></Reveal>
        </div>
      </section>

      <JsonLd data={{ "@context": "https://schema.org", "@type": "OfferCatalog", name: "SEO Using AI bundles and services", url: abs("/pricing"), provider: { "@id": abs("/#org") }, itemListElement: [...bundles, ...offers].map((o) => ({ "@type": "Offer", name: o.name, description: o.plain, url: abs(o.href), priceSpecification: priceSpec(o.price, o.unit) })) }} />
      <JsonLd data={crumbLd(crumbs)} />
      <JsonLd data={faqLd(faqs)} />
    </>
  );
}
