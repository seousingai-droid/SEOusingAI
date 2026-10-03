import Image from "next/image";
import Link from "next/link";
import { business } from "@/data/business";
import { areas, faqs, prices, reviews, services, plan } from "@/data/hvac";
import { CallButtons, CtaBand, FaqList, JsonLd, Plate, faqLd } from "@/components/site";

export default function Home() {
  const b = business;
  return (
    <>
      {/* Hero: the job in one line, and the gap we close. */}
      <section className="relative overflow-hidden border-b border-ink/10">
        <div className="wrap grid items-center gap-12 py-14 md:py-20 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="label text-copper">{b.tagline} · {b.metro}</p>
            <h1 className="display h-xl mt-5">AC repair and installation in {b.city}, <span className="text-copper">usually the same day.</span></h1>
            <p className="mt-6 max-w-[54ch] text-[1.15rem] text-muted">
              We fix and replace air conditioners, heat pumps and furnaces across the {b.metro}. You get a written price before any work starts, and every repair carries a {b.laborWarranty}.
            </p>
            <div className="mt-8"><CallButtons /></div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[0.92rem] font-semibold">
              {["Licensed · " + b.license, "Insured", b.laborWarranty, b.emergency].map((t) => (
                <li key={t} className="flex items-center gap-2"><span aria-hidden className="h-1.5 w-1.5 rounded-full bg-copper" />{t}</li>
              ))}
            </ul>
          </div>

          {/* The signature: a thermostat readout on a rating plate. Outside heat, inside comfort. */}
          <div className="plate mx-auto w-full max-w-md p-0">
            <div className="flex items-center justify-between px-6 pb-3 pt-6">
              <p className="label text-[0.66rem] text-muted">July afternoon · {b.city}</p>
              <p className="label text-[0.66rem] text-muted">Example</p>
            </div>
            <div className="grid grid-cols-2 border-y border-line">
              <div className="px-6 py-6">
                <p className="label text-[0.66rem] text-copper">Outside</p>
                <p className="display mt-2 text-[4.2rem] leading-none text-copper">112°</p>
              </div>
              <div className="border-l border-line px-6 py-6">
                <p className="label text-[0.66rem] text-coolant">Inside</p>
                <p className="display cool-in mt-2 text-[4.2rem] leading-none">76°</p>
              </div>
            </div>
            <div className="relative h-36 overflow-hidden">
              <Image src="/images/technician-condenser-800.webp" alt="Technician checking an outdoor AC condenser in a Phoenix backyard" fill priority sizes="(min-width: 1024px) 448px, 100vw" className="object-cover" />
            </div>
            <div className="plate-row">
              <div><p className="label text-[0.6rem] text-muted">Arrival</p><p className="text-[0.9rem] font-semibold">Same day</p></div>
              <div><p className="label text-[0.6rem] text-muted">Price</p><p className="text-[0.9rem] font-semibold">In writing</p></div>
              <div><p className="label text-[0.6rem] text-muted">Hours</p><p className="text-[0.9rem] font-semibold">24/7</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* Services as rating plates: what each job takes, costs and guarantees. */}
      <section className="wrap py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="label text-copper">Services</p>
            <h2 className="display h-lg mt-3">What we fix, install and maintain</h2>
          </div>
          <Link href="/services" className="link font-semibold">All services</Link>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => <Plate key={s.slug} s={s} />)}
          <Link href="/maintenance-plan" className="flex flex-col justify-between rounded-lg bg-ink p-7 text-white transition-transform hover:-translate-y-0.5">
            <div>
              <p className="label text-[#f3b48f]">Maintenance</p>
              <h3 className="display mt-3 text-[1.35rem]">{plan.name}</h3>
              <p className="mt-2 text-[0.97rem] text-white/70">Two tune-ups a year and priority service during heat waves.</p>
            </div>
            <p className="mt-6 font-bold">{plan.price} →</p>
          </Link>
        </div>
      </section>

      {/* Repair or replace: the question every owner of an aging system asks. */}
      <section className="bg-ink text-white">
        <div className="wrap grid items-center gap-10 py-20 md:grid-cols-2">
          <div>
            <p className="label text-[#f3b48f]">Repair or replace?</p>
            <h2 className="display h-lg mt-3">Use the $5,000 rule before you spend a dollar</h2>
            <p className="mt-5 max-w-[50ch] text-white/75">Multiply your system&apos;s age by the repair cost. Under $5,000, repairing usually makes sense. Over $5,000, a new system often costs less over the next few years.</p>
            <Link href="/repair-or-replace" className="btn btn-copper mt-8">Work it out for your system</Link>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[["12 yrs", "system age"], ["× $450", "repair quote"], ["= 5,400", "consider replacing"]].map(([n, l], i) => (
              <div key={l} className={`rounded-lg border p-5 ${i === 2 ? "border-copper bg-copper/15" : "border-white/15"}`}>
                <p className="display text-[1.6rem] leading-none">{n}</p>
                <p className="label mt-3 text-[0.62rem] text-white/60">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prices up front: the question people ask before they call. */}
      <section className="wrap grid gap-12 py-20 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="label text-copper">Price guide</p>
          <h2 className="display h-lg mt-3">What common jobs cost</h2>
          <p className="mt-5 max-w-[46ch] text-muted">Starting prices and typical ranges, so you know roughly what to expect before we arrive. Your exact price comes in writing before any work starts.</p>
          <Link href="/pricing" className="btn btn-line mt-8">See all prices and financing</Link>
        </div>
        <div className="card overflow-hidden">
          <table className="w-full text-left text-[0.97rem]">
            <caption className="sr-only">Starting prices for common HVAC jobs</caption>
            <tbody className="divide-y divide-line">
              {prices.slice(0, 6).map((p) => (
                <tr key={p.item}>
                  <th scope="row" className="px-5 py-4 font-semibold">{p.item}<span className="block text-[0.85rem] font-normal text-muted">{p.note}</span></th>
                  <td className="whitespace-nowrap px-5 py-4 text-right font-bold">{p.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Reviews next to the decision, not on a page nobody opens. */}
      <section className="border-y border-ink/10 bg-white">
        <div className="wrap py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="label text-copper">Reviews</p>
              <h2 className="display h-lg mt-3">What homeowners say</h2>
            </div>
            <Link href="/reviews" className="link font-semibold">All reviews</Link>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {reviews.slice(0, 3).map((r) => (
              <figure key={r.name} className="flex flex-col justify-between rounded-lg border border-line p-6">
                <blockquote className="text-[1.02rem]">“{r.text}”</blockquote>
                <figcaption className="mt-6 text-[0.9rem]"><span className="font-bold">{r.name}</span><span className="text-muted"> · {r.area} · {r.service}</span></figcaption>
              </figure>
            ))}
          </div>
          <p className="label mt-6 text-[0.62rem] text-muted">Sample reviews. A live site shows the company&apos;s real Google reviews.</p>
        </div>
      </section>

      {/* Service areas with honest arrival times. */}
      <section className="wrap py-20">
        <p className="label text-copper">Service areas</p>
        <h2 className="display h-lg mt-3">Across the {b.metro}</h2>
        <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((a) => (
            <Link key={a.slug} href={a.slug === "scottsdale" ? "/service-areas/scottsdale" : "/service-areas"} className="bg-white p-6 hover:bg-frost/50">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="display text-[1.3rem]">{a.name}</h3>
                <span className="label text-[0.62rem] text-coolant">{a.time}</span>
              </div>
              <p className="mt-2 text-[0.92rem] text-muted">{a.neighborhoods.join(" · ")}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="wrap grid gap-12 pb-20 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="label text-copper">Questions</p>
          <h2 className="display h-lg mt-3">Straight answers</h2>
          <Link href="/faq" className="link mt-6 inline-block font-semibold">All questions</Link>
        </div>
        <FaqList items={faqs.slice(0, 4)} />
      </section>

      <CtaBand />
      <JsonLd data={faqLd(faqs.slice(0, 4))} />
    </>
  );
}
