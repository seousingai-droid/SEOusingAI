import type { Metadata } from "next";
import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import { CtaBand, FaqList, JsonLd, faqLd } from "@/components/site";
import { prices, plan } from "@/data/hvac";
import { business } from "@/data/business";

export const metadata: Metadata = {
  title: `HVAC Prices and Financing in ${business.city}`,
  description: `What AC repair, tune-ups and new systems cost with ${business.short}: starting prices, typical ranges, and financing for new systems.`,
  alternates: { canonical: "/pricing" },
};

const faqs = [
  { q: "Why are new systems a range?", a: "The size of the home, the efficiency you choose and the work needed on ducts and electrical all change the price. We measure first, then give a fixed price in writing." },
  { q: "Is the diagnostic fee extra if I go ahead with the repair?", a: "No. The $89 visit is credited to the repair when you approve it." },
  { q: "Do you offer financing?", a: "Yes, for new systems, through approved lenders. You can apply during the estimate and see the monthly payment before you decide." },
];

export default function Pricing() {
  return (
    <>
      <PageIntro crumbs={[{ name: "Pricing", href: "/pricing" }]} eyebrow="Pricing" title="What heating and AC work costs"
        answer={`A diagnostic visit is $89 and is credited to the repair. Common repairs start around $195, a tune-up is $129, and a new air conditioner usually costs $7,500 to $14,000 installed. You get the exact price in writing before any work starts.`} />
      <section className="wrap grid gap-12 py-16 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="card overflow-hidden">
          <table className="w-full text-left">
            <caption className="sr-only">HVAC price guide</caption>
            <thead className="bg-ink text-white">
              <tr><th scope="col" className="label px-5 py-3 text-[0.68rem]">Job</th><th scope="col" className="label px-5 py-3 text-right text-[0.68rem]">Price</th></tr>
            </thead>
            <tbody className="divide-y divide-line">
              {prices.map((p) => (
                <tr key={p.item}>
                  <th scope="row" className="px-5 py-4 font-semibold">{p.item}<span className="block text-[0.88rem] font-normal text-muted">{p.note}</span></th>
                  <td className="whitespace-nowrap px-5 py-4 text-right text-[1.05rem] font-bold">{p.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="label border-t border-line px-5 py-3 text-[0.6rem] text-muted">Sample prices for the demo. A live site lists the company&apos;s own.</p>
        </div>
        <div className="space-y-5">
          <div className="plate p-7">
            <p className="label text-copper">Financing</p>
            <h2 className="display mt-3 text-[1.4rem]">Spread the cost of a new system</h2>
            <p className="mt-3 text-muted">Apply during your estimate. You see the monthly payment and terms from the lender before you decide, and there is no obligation.</p>
          </div>
          <Link href="/maintenance-plan" className="block rounded-lg bg-ink p-7 text-white">
            <p className="label text-[#f3b48f]">Save on every repair</p>
            <p className="display mt-3 text-[1.4rem]">{plan.name}</p>
            <p className="mt-2 text-white/70">{plan.price}: two tune-ups a year and 15% off repairs.</p>
          </Link>
        </div>
      </section>
      <section className="wrap pb-16"><FaqList items={faqs} /></section>
      <CtaBand title="Want an exact price?" text="Book a visit. You get a written price before any work starts, and the visit is credited to the repair." />
      <JsonLd data={faqLd(faqs)} />
    </>
  );
}
