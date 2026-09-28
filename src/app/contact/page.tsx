import Link from "next/link";
import PageHero, { crumbLd } from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";
import Faq, { faqLd } from "@/components/Faq";
import JsonLd from "@/components/JsonLd";
import { site, abs } from "@/lib/site";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta({
  title: "Contact Us: Send a Message",
  description: "Send SEO Using AI a message about SEO, Google Maps, AI search, websites or social media. We reply within one business day. No call needed.",
  path: "/contact",
});

const next = [
  ["We read it", "A person reads every message. No bots, no ticket queue."],
  ["We look at your site", "If you shared your website, we take a quick first look before we reply."],
  ["You get a straight answer", "What we would do first, what it costs, or a free tip if you need less than you think."],
];

const faqs = [
  { q: "Do I have to book a call?", a: "No. Send a message and we reply by email. Many owners prefer that. If a call would help, we will suggest it, and you can book one whenever you like." },
  { q: "How fast do you reply?", a: "Within one business day, Monday to Friday. Messages sent on weekends are answered on Monday." },
  { q: "What should I include?", a: "Your website address, what your business does and where your customers are, and what you want to change, such as more calls from Google Maps or showing up in AI answers." },
  { q: "Can you tell me what my site needs from a message?", a: "Often, yes. With your website address we can point out the first thing worth fixing. A full plan needs a proper look, which is the Website Checkup or a free call." },
  { q: "Is my message private?", a: "Yes. It is emailed to us and not stored on the website. We use it only to reply, and never add you to a mailing list or share it." },
];

export default function Contact() {
  const crumbs = [{ name: "Contact", href: "/contact" }];
  return (
    <>
      <PageHero eyebrow="Contact" crumbs={crumbs} title={<>Send us a <span className="hl">message</span></>}
        lede="Not ready for a call? Tell us about your business and what you want to change. A person reads every message and replies within one business day." />

      <section className="band paper-dots !pt-12 lg:!pt-16">
        <div className="wrap grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          <ContactForm email={site.email} />

          <aside className="space-y-5">
            <div className="card p-6">
              <p className="eyebrow">Contact details</p>
              <dl className="mt-4 space-y-4 text-[15.5px]">
                <div>
                  <dt className="font-semibold">Email</dt>
                  <dd><a className="text-link underline underline-offset-4 hover:text-gold" href={`mailto:${site.email}`}>{site.email}</a></dd>
                </div>
                <div>
                  <dt className="font-semibold">Reply time</dt>
                  <dd className="text-muted">Within one business day, Monday to Friday</dd>
                </div>
                <div>
                  <dt className="font-semibold">Working hours</dt>
                  <dd className="text-muted">Monday to Friday, US mornings: 8 AM to 1 PM Eastern (8 PM to 1 AM Manila)</dd>
                </div>
                <div>
                  <dt className="font-semibold">Where we work</dt>
                  <dd className="text-muted">Fully remote. We work with small businesses across the US, on video calls and email.</dd>
                </div>
                <div>
                  <dt className="font-semibold">Website</dt>
                  <dd><a className="text-link underline underline-offset-4 hover:text-gold" href={site.url}>{site.domain}</a></dd>
                </div>
              </dl>
              {site.social.length > 0 && (
                <div className="mt-5 border-t border-line pt-5">
                  <p className="font-semibold text-[15.5px]">Follow us</p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {site.social.map((u) => (
                      <li key={u}><a href={u} rel="me noopener" target="_blank" className="inline-block rounded-full border border-line bg-panel2 px-3 py-1 text-[14px] hover:border-night">{new URL(u).hostname.replace(/^www\./, "").split(".")[0]}</a></li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="band-night rounded-[20px] p-6">
              <p className="eyebrow">Prefer to talk?</p>
              <p className="mt-3 text-[16px]">A free {site.callMinutes}-minute call on Google Meet. Pick a time that suits you.</p>
              <Link href="/book-a-call" className="btn btn-primary mt-5 w-full">Book a free call</Link>
            </div>

            <div className="card p-6">
              <p className="eyebrow">Before you write</p>
              <ul className="mt-3 space-y-2 text-[15px]">
                <li><Link className="text-link underline underline-offset-4 hover:text-gold" href="/pricing">Prices for every service</Link></li>
                <li><Link className="text-link underline underline-offset-4 hover:text-gold" href="/services">What each service includes</Link></li>
                <li><Link className="text-link underline underline-offset-4 hover:text-gold" href="/seo-tips">Free SEO tips videos</Link></li>
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <section className="band band-line">
        <div className="wrap">
          <p className="eyebrow">What happens next</p>
          <h2 className="h-lg mt-5">After you hit send</h2>
          <ol className="mt-10 grid gap-5 md:grid-cols-3">
            {next.map(([t, b], i) => (
              <li key={t} className="card p-6">
                <span className={`grid h-10 w-10 place-items-center rounded-xl font-[family-name:var(--font-display)] text-[18px] font-bold text-white ${["bg-sky", "bg-leaf", "bg-coral"][i]}`}>{i + 1}</span>
                <h3 className="mt-4 text-[20px] font-bold">{t}</h3>
                <p className="mt-2 text-[15.5px] text-muted">{b}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="band band-line">
        <div className="wrap grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div><p className="eyebrow">FAQ</p><h2 className="h-lg mt-5">Questions about getting in touch</h2></div>
          <Faq items={faqs} />
        </div>
      </section>

      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "ContactPage",
        name: "Contact SEO Using AI",
        url: abs("/contact"),
        mainEntity: {
          "@id": abs("/#org"),
          "@type": "Organization",
          name: site.name,
          email: site.email,
          contactPoint: [{ "@type": "ContactPoint", contactType: "customer support", email: site.email, availableLanguage: "English", areaServed: "US", url: abs("/contact") }],
        },
      }} />
      <JsonLd data={faqLd(faqs)} />
      <JsonLd data={crumbLd(crumbs)} />
    </>
  );
}
