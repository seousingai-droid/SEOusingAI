import { pageMeta } from "@/lib/meta";
import Link from "next/link";
import PageHero, { crumbLd } from "@/components/PageHero";
import Bundles from "@/components/Bundles";
import Faq, { faqLd } from "@/components/Faq";
import JsonLd from "@/components/JsonLd";
import { abs } from "@/lib/site";
import { servicePages, MENU_GROUPS, priceSpec } from "@/lib/servicePages";

export const metadata = pageMeta({
  title: "Services: SEO, Maps, AI Search and Social",
  description: "Done-for-you SEO using AI: Google search, Google Maps, AI search, websites, social media and AI reels. Two monthly bundles or single services, with prices.",
  path: "/services",
});

const faqs = [
  { q: "What are AI SEO services?", a: "SEO services where AI does the heavy lifting, like research, first drafts and checking every page, and a person makes the decisions, checks the facts and approves everything before it goes live. You get more done each month for the same price." },
  { q: "How much do your services cost?", a: "Every service and bundle on this page shows a starting price. After a free call you get one fixed price in writing, before any work starts." },
  { q: "Do you guarantee rankings?", a: "No. Nobody can guarantee rankings, because Google and AI engines control their own results. We commit to specific deliverables, clear priorities, and honest reporting on what changed." },
  { q: "Do you publish unedited AI content?", a: "No. Every page is reviewed by a person, every statistic is checked against its source, and anything that cannot be verified is removed. Unedited AI content at scale is exactly what Google's spam policies target." },
  { q: "Which platforms do you work with?", a: "We work with WordPress and Next.js sites at the code level, and with most other platforms for strategy, content, and reporting." },
];

export default function Services() {
  const crumbs = [{ name: "Services", href: "/services" }];
  return (
    <>
      <PageHero eyebrow="Services" crumbs={crumbs} title={<>SEO using AI, <span className="hl">done for you</span></>} lede="We optimize your business to show up on Google, Google Maps and AI search. Pick a bundle and we handle everything, or pick one service." />
      <section className="band">
        <div className="wrap">
          <p className="eyebrow">Bundles</p>
          <h2 className="h-lg mt-5">We handle everything, for one monthly price.</h2>
          <div className="mt-10"><Bundles /></div>
        </div>
      </section>

      <section className="band band-line">
        <div className="wrap">
          <p className="eyebrow">Single services</p>
          <h2 className="h-lg mt-5">Or pick one SEO service</h2>
          <p className="lede mt-5 max-w-2xl">Each page says what you get, what it costs, and what it will not do.</p>
          {MENU_GROUPS.map((group) => (
            <div key={group} className="mt-10">
              <p className="eyebrow">{group}</p>
              <div className="mt-4 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {servicePages.filter((sp) => sp.group === group).map((sp) => (
                  <Link key={sp.slug} href={`/services/${sp.slug}`} className="card card-hover flex flex-col p-7">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="text-[21px] font-bold leading-snug">{sp.name}</h3>
                    </div>
                    <p className="mt-2 flex-1 text-[15.5px] text-muted">{sp.lede}</p>
                    <p className="mt-5 flex items-baseline gap-2 border-t border-line pt-4">
                      <span className="font-[family-name:var(--font-display)] text-[20px] font-bold text-gold">{sp.price}</span>
                      <span className="font-mono text-[11px] uppercase tracking-widest text-muted">{sp.unit}</span>
                      <span className="ml-auto font-mono text-[13px] text-muted">Details →</span>
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <p className="mt-10 text-muted">Looking for the big picture? See how we work as an <Link className="text-link underline underline-offset-4 hover:text-gold" href="/ai-seo-agency">AI SEO agency</Link>, or read <Link className="text-link underline underline-offset-4 hover:text-gold" href="/ai-seo-for-small-business">AI SEO for small business</Link> and <Link className="text-link underline underline-offset-4 hover:text-gold" href="/ai-seo-for-b2b">AI SEO for B2B</Link>.</p>
        </div>
      </section>

      <section className="band band-line">
        <div className="wrap grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div><p className="eyebrow">FAQ</p><h2 className="h-lg mt-5">Questions about our SEO services</h2></div>
          <Faq items={faqs} />
        </div>
      </section>

      <section className="band band-line">
        <div className="wrap"><div className="card grid items-center gap-8 p-8 sm:p-14 lg:grid-cols-[1.3fr_0.7fr]">
          <div><p className="eyebrow">Next step</p><h2 className="h-lg mt-4">Not sure what you need?</h2><p className="lede mt-5 max-w-xl">Book a free 30-minute call. We look at your business together and tell you which bundle or service fits, or if you need less than you think.</p></div>
          <div className="flex lg:justify-end"><Link href="/book-a-call" className="btn btn-primary">Book a free call <span aria-hidden>→</span></Link></div>
        </div></div>
      </section>

      <JsonLd data={{ "@context": "https://schema.org", "@type": "Service", name: "AI SEO services", serviceType: "Search engine optimization", url: abs("/services"), provider: { "@id": abs("/#org") }, areaServed: { "@type": "Country", name: "United States" }, description: "Done-for-you SEO using AI: Google search, Google Maps, AI search, websites, social media and AI reels, with a person reviewing every deliverable.", hasOfferCatalog: { "@type": "OfferCatalog", name: "SEO Using AI services", itemListElement: servicePages.map((sp) => ({ "@type": "Offer", url: abs(`/services/${sp.slug}`), itemOffered: { "@type": "Service", name: sp.name, description: sp.lede }, priceSpecification: priceSpec(sp.price, sp.unit) })) } }} />
      <JsonLd data={crumbLd(crumbs)} />
      <JsonLd data={faqLd(faqs)} />
    </>
  );
}
