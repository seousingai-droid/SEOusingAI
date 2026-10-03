import type { Metadata } from "next";
import PageIntro from "@/components/PageIntro";
import Calculator from "@/components/Calculator";
import { CtaBand, FaqList, JsonLd, faqLd } from "@/components/site";

export const metadata: Metadata = {
  title: "Repair or Replace Your AC? Use the $5,000 Rule",
  description: "Repair or replace your AC? Multiply its age by the repair cost. Under 5,000, repairing usually makes sense; over 5,000, consider replacing. Try the calculator.",
  alternates: { canonical: "/repair-or-replace" },
};

const other: React.ReactNode[] = [
  <>It uses R-22 refrigerant. US production and import ended in 2020 (<a className="link" href="https://www.epa.gov/ods-phaseout/homeowners-and-consumers-frequently-asked-questions" target="_blank" rel="noopener">EPA</a>), so only recycled R-22 is left and repairs that need it get expensive.</>,
  "You have needed more than one repair in the last two years.",
  "Some rooms never cool down, even when the system runs all day.",
  "Your summer electric bills keep rising while your usage has not changed.",
];
const faqs = [
  { q: "How long does an air conditioner last in Phoenix?", a: "Many central air systems in the desert last about 10 to 15 years. Heavy summer use and dust shorten that; regular maintenance lengthens it." },
  { q: "Is the $5,000 rule always right?", a: "No. It is a widely used rule of thumb in the HVAC trade, not a law of physics. Refrigerant type, repair history and efficiency matter too. We give you both options in writing so you can compare." },
];

export default function RepairOrReplace() {
  return (
    <>
      <PageIntro crumbs={[{ name: "Repair or replace", href: "/repair-or-replace" }]} eyebrow="Repair or replace" title="Repair or replace your AC? Use the $5,000 rule"
        answer="Multiply your air conditioner's age by the repair cost. If the result is under 5,000, repairing usually makes sense. Over 5,000, a new system often costs less over the next few years than repairs and higher electric bills." actions={false} />
      <section className="wrap grid gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr]">
        <Calculator />
        <div>
          <h2 className="display h-md">Replace sooner if</h2>
          <ul className="mt-5 space-y-4">
            {other.map((t, i) => <li key={i} className="flex gap-3"><span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-copper" /><span>{t}</span></li>)}
          </ul>
        </div>
      </section>
      <section className="wrap pb-16"><FaqList items={faqs} /></section>
      <CtaBand title="Get both options in writing" text="Book a visit: we price the repair and a replacement side by side, so you can decide with real numbers." />
      <JsonLd data={faqLd(faqs)} />
    </>
  );
}
