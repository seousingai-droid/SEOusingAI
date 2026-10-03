import type { Metadata } from "next";
import PageIntro from "@/components/PageIntro";
import { CtaBand, Plate } from "@/components/site";
import { services } from "@/data/hvac";
import { business } from "@/data/business";

export const metadata: Metadata = {
  title: `Heating and AC Services in ${business.city}`,
  description: `AC repair, AC installation, heating repair, heat pumps and indoor air quality across the ${business.metro}. Same-day service and written prices.`,
  alternates: { canonical: "/services" },
};

export default function Services() {
  return (
    <>
      <PageIntro crumbs={[{ name: "Services", href: "/services" }]} eyebrow="Services" title="Heating and air conditioning services"
        answer={`We repair, replace and maintain central air conditioners, heat pumps and gas furnaces across the ${business.metro}. Each service below lists the usual time, the starting price and the warranty.`} />
      <section className="wrap grid gap-5 py-16 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => <Plate key={s.slug} s={s} />)}
      </section>
      <CtaBand />
    </>
  );
}
