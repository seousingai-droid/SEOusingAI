import Link from "next/link";
import { business, telHref } from "@/data/business";
import { services, areas, type Faq, type Service } from "@/data/hvac";

export const abs = (path: string) => `${business.url}${path === "/" ? "" : path}`;

/** The copper line set, coiled: the mark of the brand. */
export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
        <rect width="34" height="34" rx="8" fill={light ? "#fff" : "#15191c"} />
        <path d="M9 23c0-4 3-6 6-6s6-2 6-6M13 23c0-2.2 1.8-3 3-3h3c3 0 5-2 5-5" fill="none" stroke="#b4582a" strokeWidth="2.6" strokeLinecap="round" />
        <circle cx="21" cy="11" r="2" fill="#dff0ed" />
      </svg>
      <span className={`display text-[1.15rem] leading-none ${light ? "text-white" : ""}`}>
        {business.short}
        <span className="block font-sans text-[0.68rem] font-semibold tracking-[0.14em] uppercase opacity-60" style={{ fontStretch: "100%" }}>Comfort Co.</span>
      </span>
    </span>
  );
}

/** Says plainly that this is a demo. A live client site drops this bar. */
export function DemoBar() {
  return (
    <div className="bg-ink text-[0.82rem] text-white/80">
      <div className="wrap flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-2">
        <p>Demo website by <strong className="text-white">{business.demo.by}</strong>. Business, prices and reviews are samples.</p>
        <a href={business.demo.href} className="font-semibold text-[#f3b48f] underline underline-offset-2 hover:text-white">Get this website for your company →</a>
      </div>
    </div>
  );
}

export function Plate({ s, compact = false }: { s: Service; compact?: boolean }) {
  return (
    <Link href={`/services/${s.slug}`} className="plate group flex h-full flex-col transition-transform hover:-translate-y-0.5">
      <div className="flex-1 px-6 pb-5 pt-7">
        <p className="label text-copper">{s.name}</p>
        <h3 className="display mt-3 text-[1.35rem] group-hover:text-copper-deep">{s.title.split(",")[0]}</h3>
        {!compact && <p className="mt-2 text-[0.97rem] text-muted">{s.short}</p>}
      </div>
      <div className="plate-row">
        <div><p className="label text-[0.62rem] text-muted">Time</p><p className="text-[0.92rem] font-semibold">{s.plate.time}</p></div>
        <div><p className="label text-[0.62rem] text-muted">From</p><p className="text-[0.92rem] font-semibold">{s.plate.from}</p></div>
        <div><p className="label text-[0.62rem] text-muted">Warranty</p><p className="text-[0.92rem] font-semibold">{s.plate.warranty}</p></div>
      </div>
    </Link>
  );
}

export function FaqList({ items }: { items: Faq[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((f) => (
        <details key={f.q} className="faq group py-5">
          <summary className="flex items-start justify-between gap-6">
            <h3 className="text-[1.08rem] font-bold">{f.q}</h3>
            <span aria-hidden className="faq-icon mt-1 text-xl leading-none text-copper transition-transform">+</span>
          </summary>
          <p className="mt-3 max-w-[68ch] text-muted">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

export const faqLd = (items: Faq[]) => ({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) });

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export function Crumbs({ items }: { items: { name: string; href: string }[] }) {
  const all = [{ name: "Home", href: "/" }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb" className="label text-[0.68rem] text-muted">
        {all.map((c, i) => (
          <span key={c.href}>{i > 0 && <span className="mx-2 opacity-50">/</span>}{i < all.length - 1 ? <Link href={c.href} className="hover:text-ink">{c.name}</Link> : <span className="text-ink">{c.name}</span>}</span>
        ))}
      </nav>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: all.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: abs(c.href) })) }} />
    </>
  );
}

export function CallButtons({ dark = false }: { dark?: boolean }) {
  return (
    <div className="flex flex-wrap gap-3">
      <a href={telHref} className="btn btn-copper"><PhoneIcon /> Call {business.phone}</a>
      <Link href="/contact" className={`btn ${dark ? "border-[1.5px] border-white/70 text-white hover:bg-white hover:text-ink" : "btn-line"}`}>Book a visit</Link>
    </div>
  );
}

export function PhoneIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" /></svg>;
}

/** The closing band on every page: the two things a visitor came to do. */
export function CtaBand({ title = "AC out right now?", text = `We answer 24/7 and send a technician the same day across the ${business.metro}.` }: { title?: string; text?: string }) {
  return (
    <section className="bg-frost">
      <div className="wrap grid items-center gap-8 py-16 md:grid-cols-[1.2fr_auto] md:py-20">
        <div>
          <h2 className="display h-lg">{title}</h2>
          <p className="mt-3 max-w-[52ch] text-[1.08rem] text-muted">{text}</p>
        </div>
        <CallButtons />
      </div>
    </section>
  );
}

/** Sticky call and book buttons on phones, where most emergency calls start. */
export function MobileBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-ink/10 bg-white/95 p-2 backdrop-blur md:hidden">
      <a href={telHref} className="btn btn-copper mr-1"><PhoneIcon /> Call now</a>
      <Link href="/contact" className="btn btn-ink ml-1">Book a visit</Link>
    </div>
  );
}

export function Footer() {
  const b = business;
  return (
    <footer className="bg-ink pb-24 text-white/75 md:pb-0">
      <div className="wrap grid gap-10 py-16 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-5 max-w-[34ch] text-[0.95rem]">{b.tagline} for homes across the {b.metro}, since {b.founded}.</p>
          <p className="label mt-5 text-[0.66rem] text-white/50">{b.license} · Licensed and insured</p>
        </div>
        <div>
          <p className="label text-[0.68rem] text-white/50">Contact</p>
          <address className="mt-4 space-y-1.5 text-[0.95rem] not-italic">
            <a href={telHref} className="block font-bold text-white hover:text-[#f3b48f]">{b.phone}</a>
            <a href={`mailto:${b.email}`} className="block hover:text-white">{b.email}</a>
            <span className="block">{b.address.street}<br />{b.address.city}, {b.address.region} {b.address.zip}</span>
          </address>
        </div>
        <div>
          <p className="label text-[0.68rem] text-white/50">Services</p>
          <ul className="mt-4 space-y-1.5 text-[0.95rem]">
            {services.map((s) => <li key={s.slug}><Link href={`/services/${s.slug}`} className="hover:text-white">{s.name}</Link></li>)}
            <li><Link href="/maintenance-plan" className="hover:text-white">Maintenance plan</Link></li>
          </ul>
        </div>
        <div>
          <p className="label text-[0.68rem] text-white/50">Hours</p>
          <ul className="mt-4 space-y-1.5 text-[0.95rem]">
            {b.hours.map((h) => <li key={h.days}>{h.days}: {h.time}</li>)}
            <li className="font-semibold text-white">{b.emergency}</li>
          </ul>
          <p className="label mt-6 text-[0.68rem] text-white/50">Areas</p>
          <p className="mt-3 text-[0.95rem]">{areas.map((a) => a.name).join(", ")}</p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="wrap flex flex-wrap justify-between gap-3 py-6 text-[0.82rem] text-white/50">
          <p>© {new Date().getFullYear()} {b.name} (sample business)</p>
          <p>Website by <a href="https://seousingai.com" className="underline underline-offset-2 hover:text-white">SEO Using AI</a></p>
        </div>
      </div>
    </footer>
  );
}
