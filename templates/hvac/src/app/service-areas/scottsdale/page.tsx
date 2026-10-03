import type { Metadata } from "next";
import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import { CtaBand, FaqList, JsonLd, faqLd } from "@/components/site";

// An example of a real service-area page: local detail a city-name swap cannot fake.
export const metadata: Metadata = {
  title: "AC Repair and Installation in Scottsdale, AZ",
  description: "Same-day AC repair and new systems in Scottsdale, from Old Town ranch homes to large North Scottsdale homes with two or three systems.",
  alternates: { canonical: "/service-areas/scottsdale" },
};

const faqs = [
  { q: "Do you serve North Scottsdale?", a: "Yes, all of Scottsdale, from Old Town and McCormick Ranch to the communities north of the Loop 101." },
  { q: "My home has two AC systems. Can you service both in one visit?", a: "Yes. Many larger Scottsdale homes have two or three systems, and we service them in the same visit." },
];

export default function Scottsdale() {
  return (
    <>
      <PageIntro crumbs={[{ name: "Service areas", href: "/service-areas" }, { name: "Scottsdale", href: "/service-areas/scottsdale" }]} eyebrow="Scottsdale, AZ"
        title="AC repair and installation in Scottsdale" answer="We repair and replace heating and air conditioning across Scottsdale, usually the same day. Homes here range from 1960s ranch houses near Old Town, often with older ductwork, to large newer homes in North Scottsdale that run two or three separate systems."
        image="service-van" imageAlt="Service van parked outside a single-story stucco home" />
      <section className="wrap grid gap-12 py-16 lg:grid-cols-2">
        <div className="space-y-5 text-[1.05rem]">
          <h2 className="display h-md">What we see most in Scottsdale homes</h2>
          <p><strong>Older homes near Old Town and McCormick Ranch:</strong> original or patched ductwork that leaks cooled air into the attic. Sealing it often cools the back bedrooms better than a bigger AC would.</p>
          <p><strong>Larger homes in North Scottsdale:</strong> two or three systems, sometimes with zoning. When one fails in July, the rest of the house works overtime, so we service them together.</p>
          <p><strong>Everywhere:</strong> dust storms clog outdoor coils and filters. A spring coil cleaning is the cheapest way to keep a Scottsdale AC running through August.</p>
        </div>
        <div>
          <FaqList items={faqs} />
          <p className="mt-6 text-muted">Also serving <Link href="/service-areas" className="link">Phoenix, Tempe, Mesa, Chandler and Glendale</Link>.</p>
        </div>
      </section>
      <CtaBand title="AC out in Scottsdale?" text="We usually arrive the same day. You get the price in writing before any work starts." />
      <JsonLd data={faqLd(faqs)} />
    </>
  );
}
