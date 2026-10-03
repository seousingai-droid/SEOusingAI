import type { Metadata } from "next";
import PageIntro from "@/components/PageIntro";
import { CtaBand } from "@/components/site";
import { business } from "@/data/business";

export const metadata: Metadata = {
  title: `About ${business.name}`,
  description: `${business.name} has repaired and installed heating and air conditioning in the ${business.metro} since ${business.founded}. Licensed, insured and EPA 608 certified.`,
  alternates: { canonical: "/about" },
};

const facts = [
  ["Since", String(business.founded)],
  ["License", business.license],
  ["Certified", "EPA 608"],
  ["Warranty", "2 yr labor"],
];

export default function About() {
  return (
    <>
      <PageIntro crumbs={[{ name: "About", href: "/about" }]} eyebrow="About" title={`A ${business.city} heating and AC company, since ${business.founded}`}
        answer={`${business.name} repairs, installs and maintains heating and air conditioning for homes across the ${business.metro}. We are licensed with the Arizona Registrar of Contractors, insured, and every technician holds the EPA 608 certification required to handle refrigerant.`}
        image="service-van" imageAlt="Service van parked outside a Phoenix home" />
      <section className="wrap grid gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5 text-[1.05rem]">
          <h2 className="display h-md">How we work</h2>
          <p>We price before we work. Every job starts with a diagnosis you can see, and a fixed price in writing. If you decide not to go ahead, you pay for the visit and nothing else.</p>
          <p>We size systems for the home, not the old unit. A new air conditioner starts with a load calculation, because an oversized system cools fast, switches off, and leaves the house clammy and the bills high.</p>
          <p>We put people first in a heat wave. When it is 110 degrees out, homes with elderly residents, babies or medical needs go to the front of the line.</p>
        </div>
        <div className="plate grid grid-cols-2 self-start">
          {facts.map(([k, v], i) => (
            <div key={k} className={`p-6 ${i % 2 ? "border-l border-line" : ""} ${i > 1 ? "border-t border-line" : ""}`}>
              <p className="label text-[0.62rem] text-muted">{k}</p>
              <p className="display mt-2 text-[1.4rem]">{v}</p>
            </div>
          ))}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
