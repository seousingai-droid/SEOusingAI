import type { Metadata } from "next";
import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import { CtaBand } from "@/components/site";
import { areas } from "@/data/hvac";
import { business } from "@/data/business";

export const metadata: Metadata = {
  title: `HVAC Service Areas in the ${business.metro}`,
  description: `${business.short} serves ${areas.map((a) => a.name).join(", ")}. Arrival times and neighborhoods for each city.`,
  alternates: { canonical: "/service-areas" },
};

export default function ServiceAreas() {
  return (
    <>
      <PageIntro crumbs={[{ name: "Service areas", href: "/service-areas" }]} eyebrow="Service areas" title={`Heating and AC service across the ${business.metro}`}
        answer={`We serve ${areas.map((a) => a.name).join(", ")}, with same-day AC repair in most of the metro. Each city below shows how quickly we usually arrive and the neighborhoods we cover most.`} />
      <section className="wrap grid gap-5 py-16 md:grid-cols-2">
        {areas.map((a) => (
          <article key={a.slug} className="plate p-7">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="display text-[1.6rem]">{a.name}</h2>
              <span className="label text-[0.66rem] text-coolant">{a.time}</span>
            </div>
            <p className="mt-3 text-muted">{a.note}</p>
            <p className="label mt-5 text-[0.62rem] text-muted">Neighborhoods</p>
            <p className="mt-1 font-semibold">{a.neighborhoods.join(" · ")}</p>
            {a.slug === "scottsdale" && <Link href="/service-areas/scottsdale" className="link mt-5 inline-block font-semibold">Heating and AC in Scottsdale</Link>}
          </article>
        ))}
      </section>
      <CtaBand />
    </>
  );
}
