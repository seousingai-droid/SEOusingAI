import type { Metadata } from "next";
import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import { CtaBand, FaqList, JsonLd, Plate, abs, faqLd } from "@/components/site";
import { getService, services, areas } from "@/data/hvac";
import { business } from "@/data/business";

export const dynamicParams = false;
export const generateStaticParams = () => services.map((s) => ({ slug: s.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const s = getService((await params).slug);
  return { title: s.metaTitle, description: s.description, alternates: { canonical: `/services/${s.slug}` } };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const s = getService((await params).slug);
  const others = services.filter((o) => o.slug !== s.slug).slice(0, 3);
  return (
    <>
      <PageIntro crumbs={[{ name: "Services", href: "/services" }, { name: s.name, href: `/services/${s.slug}` }]} eyebrow={s.name}
        title={s.title} answer={s.answer} image={s.image} imageAlt={s.imageAlt} />

      <section className="wrap grid gap-12 py-16 lg:grid-cols-[1fr_1fr]">
        <div className="plate self-start p-7">
          <h2 className="display h-md">{s.signs.h}</h2>
          <ul className="mt-5 space-y-3">
            {s.signs.list.map((t) => <li key={t} className="flex gap-3"><span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-copper" /><span>{t}</span></li>)}
          </ul>
        </div>
        <div>
          <h2 className="display h-md">How a visit works</h2>
          <ol className="mt-6 space-y-6">
            {s.steps.map((st, i) => (
              <li key={st.h} className="grid grid-cols-[2.5rem_1fr] gap-4">
                <span className="display grid h-10 w-10 place-items-center rounded-full bg-frost text-coolant">{i + 1}</span>
                <div><h3 className="text-[1.08rem] font-bold">{st.h}</h3><p className="mt-1 text-muted">{st.p}</p></div>
              </li>
            ))}
          </ol>
          <div className="plate-row mt-8 rounded-md border border-line bg-white">
            <div><p className="label text-[0.62rem] text-muted">Time</p><p className="font-semibold">{s.plate.time}</p></div>
            <div><p className="label text-[0.62rem] text-muted">From</p><p className="font-semibold">{s.plate.from}</p></div>
            <div><p className="label text-[0.62rem] text-muted">Warranty</p><p className="font-semibold">{s.plate.warranty}</p></div>
          </div>
          <p className="mt-3 text-[0.9rem] text-muted">See the full <Link href="/pricing" className="link">price guide</Link>.</p>
        </div>
      </section>

      <section className="wrap grid gap-12 pb-16 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="label text-copper">Questions</p>
          <h2 className="display h-lg mt-3">{s.name}: common questions</h2>
          <p className="mt-5 text-muted">We cover {areas.map((a) => a.name).join(", ")}. <Link href="/service-areas" className="link">See service areas</Link>.</p>
        </div>
        <FaqList items={s.faqs} />
      </section>

      <section className="border-t border-ink/10 bg-white">
        <div className="wrap py-16">
          <h2 className="display h-md">Other services</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">{others.map((o) => <Plate key={o.slug} s={o} compact />)}</div>
        </div>
      </section>

      <CtaBand />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Service", name: s.name, serviceType: s.name, description: s.description, url: abs(`/services/${s.slug}`), provider: { "@id": abs("/#business") }, areaServed: areas.map((a) => `${a.name}, ${business.state}`) }} />
      <JsonLd data={faqLd(s.faqs)} />
    </>
  );
}
