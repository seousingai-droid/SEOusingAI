import PageHero, { crumbLd } from "./PageHero";
import JsonLd from "./JsonLd";
import Faq, { faqLd } from "./Faq";
import type { Faq as F } from "@/lib/content";
import { abs } from "@/lib/site";

export default function ToolShell({ slug, name, title, lede, children, how, faqs }: {
  slug: string; name: string; title: React.ReactNode; lede: string; children: React.ReactNode;
  how: { h: string; p: string }[]; faqs: F[];
}) {
  const crumbs = [{ name: "Free tools", href: "/tools" }, { name, href: `/tools/${slug}` }];
  return (
    <>
      <PageHero eyebrow="Free tool" crumbs={crumbs} title={title} lede={lede} />
      <section className="wrap py-12 lg:py-16">{children}</section>
      <section className="band band-line">
        <div className="wrap grid gap-12 lg:grid-cols-2">
          <div className="prose">
            {how.map((s) => (<div key={s.h}><h2 className="!mt-0">{s.h}</h2><p className="mb-10">{s.p}</p></div>))}
          </div>
          <div>
            <h2 className="mb-6 text-[clamp(26px,3vw,34px)] font-bold">Questions</h2>
            <Faq items={faqs} />
          </div>
        </div>
      </section>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebApplication", name, url: abs(`/tools/${slug}`), applicationCategory: "BusinessApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, publisher: { "@id": abs("/#org") } }} />
      <JsonLd data={crumbLd(crumbs)} />
      <JsonLd data={faqLd(faqs)} />
    </>
  );
}
