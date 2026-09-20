import { pageMeta } from "@/lib/meta";
import Link from "next/link";
import PageHero, { crumbLd } from "@/components/PageHero";
import ServicesHub from "@/components/ServicesHub";
import Faq, { faqLd } from "@/components/Faq";
import JsonLd from "@/components/JsonLd";
import { services, site, abs } from "@/lib/site";
import { servicePages } from "@/lib/servicePages";

export const metadata = pageMeta({
  title: "AI SEO Services, Done for You",
  description: "Done-for-you AI SEO services: audits, fixes, strategy, content, link outreach, local SEO, and reporting. AI does the volume. A person checks every fact.",
  path: "/services",
});

const faqs = [
  { q: "What are AI SEO services?", a: "AI SEO services are search engine optimization services where AI workflows handle the high-volume work, such as crawling, clustering keywords, drafting, and reporting, while a person sets the strategy, verifies facts, and approves everything before it ships. The result is agency-level coverage at a faster pace." },
  { q: "How much do your AI SEO services cost?", a: "Pricing is scoped after a free call, because a five-page local site and a 5,000-product store need very different work. You get a written scope with a fixed price before anything starts. There are no packages of hours." },
  { q: "Do you guarantee rankings?", a: "No. Nobody can guarantee rankings, because Google and AI engines control their own results. We commit to specific deliverables, clear priorities, and honest reporting on what changed." },
  { q: "Do you publish unedited AI content?", a: "No. Every page is reviewed by a person, every statistic is checked against its source, and anything that cannot be verified is removed. Unedited AI content at scale is exactly what Google's spam policies target." },
  { q: "Which platforms do you work with?", a: "We work with WordPress and Next.js sites at the code level, and with most other platforms for strategy, content, and reporting." },
];

export default function Services() {
  const crumbs = [{ name: "Services", href: "/services" }];
  return (
    <>
      <PageHero eyebrow="Services" crumbs={crumbs} title={<>AI SEO services with a <span className="hl">person in the loop</span></>} lede="Fifteen specialist AI workflows cover the full job, from the first crawl to the monthly report. A person reviews what they produce before it touches your site." />
      <section className="band">
        <div className="wrap grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow">How it works</p>
            <h2 className="h-lg mt-5">Five lines of work. One review gate.</h2>
            <p className="lede mt-6">AI SEO services work when speed and judgment are kept apart. The workflows do the crawling, clustering, drafting, and reporting. A person decides the strategy, checks the facts, and signs off.</p>
            <ol className="mt-8 space-y-4">
              {[["Free call", `A ${site.callMinutes}-minute Google Meet call about your site, market, and main problem.`], ["Written scope", "The narrowest sensible first step, with deliverables and a fixed price."], ["Delivery", "Work ships in reviewed batches. You approve before anything goes live."], ["Report", "What changed, what it did, and what should happen next."]].map(([t, b], i) => (
                <li key={t} className="flex gap-5"><span className="font-mono text-[14px] font-bold text-mark">{String(i + 1).padStart(2, "0")}</span><p><strong>{t}.</strong> <span className="text-muted">{b}</span></p></li>
              ))}
            </ol>
            <Link href="/book-a-call" className="btn btn-primary mt-9">Book a free call <span aria-hidden>→</span></Link>
          </div>
          <ServicesHub className="hidden w-full md:block" />
        </div>
      </section>

      <section className="band band-line">
        <div className="wrap">
          <p className="eyebrow">Most requested</p>
          <h2 className="h-lg mt-5">Seven services, explained in full</h2>
          <p className="lede mt-5 max-w-2xl">Each page says what the service is, the signs you need it, what you get, and what it will not do.</p>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {servicePages.map((sp) => (
              <Link key={sp.slug} href={`/services/${sp.slug}`} className="card card-hover p-7">
                <h3 className="text-[22px] font-bold">{sp.name}</h3>
                <p className="mt-2 text-[15.5px] text-muted">{sp.lede}</p>
                <p className="mt-5 font-mono text-[13px] text-mark">Read more →</p>
              </Link>
            ))}
          </div>
          <p className="mt-10 text-muted">Looking for the big picture? See how we work as an <Link className="text-link underline underline-offset-4 hover:text-mark" href="/ai-seo-agency">AI SEO agency</Link>, or read <Link className="text-link underline underline-offset-4 hover:text-mark" href="/ai-seo-for-small-business">AI SEO for small business</Link> and <Link className="text-link underline underline-offset-4 hover:text-mark" href="/ai-seo-for-b2b">AI SEO for B2B</Link>.</p>
        </div>
      </section>

      {services.map((s, i) => (
        <section key={s.key} className="band band-line" id={s.key.toLowerCase().replace(/[^a-z]+/g, "-")}>
          <div className="wrap grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="eyebrow">Everything we cover · {i + 1} of {services.length}</p>
              <h2 className="h-lg mt-4 !text-[clamp(30px,3.6vw,44px)]">{s.key}</h2>
              <p className="lede mt-4">{s.summary}</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              {s.items.map(([t, b]) => (
                <div key={t} className="card p-6">
                  <h3 className="text-[19px] font-semibold leading-snug">{t}</h3>
                  <p className="mt-3 text-[15.5px] text-muted">{b}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="band band-line">
        <div className="wrap grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div><p className="eyebrow">FAQ</p><h2 className="h-lg mt-5">Questions about working together</h2></div>
          <Faq items={faqs} />
        </div>
      </section>

      <section className="band band-line">
        <div className="wrap"><div className="card grid items-center gap-8 p-8 sm:p-14 lg:grid-cols-[1.3fr_0.7fr]">
          <div><p className="eyebrow">Next step</p><h2 className="h-lg mt-4">Describe the site and the problem.</h2><p className="lede mt-5 max-w-xl">We will recommend the narrowest sensible first step. If the honest answer is a guide you can follow yourself, we will say so.</p></div>
          <div className="flex lg:justify-end"><Link href="/book-a-call" className="btn btn-primary">Book a free call <span aria-hidden>→</span></Link></div>
        </div></div>
      </section>

      <JsonLd data={{ "@context": "https://schema.org", "@type": "Service", name: "AI SEO services", serviceType: "Search engine optimization", url: abs("/services"), provider: { "@id": abs("/#org") }, areaServed: { "@type": "Country", name: "United States" }, description: "Done-for-you AI SEO services: audits, fixes, strategy, content, link outreach, local SEO, and reporting, with a person reviewing every deliverable.", hasOfferCatalog: { "@type": "OfferCatalog", name: "AI SEO services", itemListElement: services.map((s) => ({ "@type": "OfferCatalog", name: s.key, itemListElement: s.items.map(([t, b]) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: t, description: b } })) })) } }} />
      <JsonLd data={crumbLd(crumbs)} />
      <JsonLd data={faqLd(faqs)} />
    </>
  );
}
