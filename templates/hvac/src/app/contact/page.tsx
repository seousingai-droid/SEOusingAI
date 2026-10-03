import type { Metadata } from "next";
import { Crumbs, PhoneIcon } from "@/components/site";
import QuoteForm from "@/components/QuoteForm";
import { business, telHref } from "@/data/business";

export const metadata: Metadata = {
  title: `Book a Heating or AC Visit in ${business.city}`,
  description: `Book AC repair, a new system estimate or a tune-up with ${business.short}. Three quick steps, or call ${business.phone}, 24/7.`,
  alternates: { canonical: "/contact" },
};

export default function Contact() {
  const b = business;
  return (
    <section className="wrap grid gap-12 py-12 md:py-16 lg:grid-cols-[1.2fr_0.8fr]">
      <div>
        <Crumbs items={[{ name: "Book a visit", href: "/contact" }]} />
        <h1 className="display h-xl mt-8 !text-[clamp(2.1rem,4.6vw,3.4rem)]">Book a visit</h1>
        <p className="mt-5 max-w-[56ch] text-[1.1rem] text-muted">Tell us what you need in three quick steps and we call you back to confirm a time. If your AC is out and it is urgent, call instead: we answer 24/7.</p>
        <div className="mt-8"><QuoteForm /></div>
      </div>
      <aside className="space-y-5 lg:pt-28">
        <a href={telHref} className="flex items-center gap-4 rounded-lg bg-copper p-6 text-white">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-white/15"><PhoneIcon /></span>
          <span><span className="label block text-[0.62rem] text-white/80">24/7 emergency line</span><span className="display text-[1.5rem]">{b.phone}</span></span>
        </a>
        <div className="plate p-6">
          <p className="label text-[0.62rem] text-muted">Office</p>
          <address className="mt-2 not-italic">{b.address.street}<br />{b.address.city}, {b.address.region} {b.address.zip}</address>
          <p className="label mt-5 text-[0.62rem] text-muted">Hours</p>
          <ul className="mt-2 space-y-1">{b.hours.map((h) => <li key={h.days}>{h.days}: {h.time}</li>)}<li className="font-semibold">{b.emergency}</li></ul>
          <p className="label mt-5 text-[0.62rem] text-muted">Email</p>
          <a href={`mailto:${b.email}`} className="link mt-2 inline-block">{b.email}</a>
        </div>
      </aside>
    </section>
  );
}
