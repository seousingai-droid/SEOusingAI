import type { Metadata } from "next";
import PageIntro from "@/components/PageIntro";
import { CallButtons, CtaBand, FaqList, JsonLd, faqLd } from "@/components/site";
import { plan } from "@/data/hvac";
import { business } from "@/data/business";

export const metadata: Metadata = {
  title: `HVAC Maintenance Plan in ${business.city}`,
  description: `${plan.name}: two tune-ups a year, priority service during heat waves and 15% off repairs, for ${plan.price}.`,
  alternates: { canonical: "/maintenance-plan" },
};

const faqs = [
  { q: "Why two tune-ups a year?", a: "In Phoenix the AC works hardest from May to October and the heating runs on winter nights. A spring AC check and a fall heating check catch worn parts before each season." },
  { q: "What happens in a tune-up?", a: "We clean the outdoor coil, test capacitors and contactors, check refrigerant pressures and the temperature drop, clear the drain line, and check the filter." },
  { q: "Can I cancel?", a: "Yes, any time. The plan is month to month." },
];

export default function Maintenance() {
  return (
    <>
      <PageIntro crumbs={[{ name: "Comfort Plan", href: "/maintenance-plan" }]} eyebrow="Maintenance plan" title={`${plan.name}: ${plan.price}`}
        answer="Two tune-ups a year, priority scheduling during heat waves and 15% off repairs. Many summer breakdowns start as a worn part, such as a weak capacitor, that a spring tune-up can catch before the heat arrives." image="gauges-maintenance" imageAlt="Technician checking refrigerant pressures on an outdoor AC unit" actions={false} />
      <section className="wrap grid gap-12 py-16 lg:grid-cols-2">
        <div className="plate p-8">
          <p className="label text-copper">What you get</p>
          <ul className="mt-6 space-y-4">
            {plan.perks.map((p) => <li key={p} className="flex gap-3 text-[1.05rem]"><svg width="22" height="22" viewBox="0 0 24 24" className="mt-0.5 shrink-0 text-coolant" aria-hidden="true"><path d="m5 12 5 5 9-10" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>{p}</li>)}
          </ul>
          <div className="mt-8"><CallButtons /></div>
        </div>
        <FaqList items={faqs} />
      </section>
      <CtaBand title="Join before the heat arrives" text="Sign up on the phone or at your next visit. Your first tune-up is booked straight away." />
      <JsonLd data={faqLd(faqs)} />
    </>
  );
}
