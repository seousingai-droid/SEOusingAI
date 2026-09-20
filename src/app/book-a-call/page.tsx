import { pageMeta } from "@/lib/meta";
import PageHero, { crumbLd } from "@/components/PageHero";
import CallArt from "@/components/CallArt";
import JsonLd from "@/components/JsonLd";
import { site } from "@/lib/site";

export const metadata = pageMeta({
  title: "Book a Free AI SEO Strategy Call",
  description: "Book a free AI SEO strategy call on Google Meet. Talk through your site, your market, and the first fix worth making. No pitch deck.",
  path: "/book-a-call",
});

const mailto = `mailto:${site.email}?subject=${encodeURIComponent("Strategy call request")}&body=${encodeURIComponent("Website:\nMain problem:\nThree times that suit you (with time zone):\n")}`;

export default function Book() {
  const crumbs = [{ name: "Book a call", href: "/book-a-call" }];
  const url: string = site.bookingUrl;
  const embed = url ? `${url}${url.includes("?") ? "&" : "?"}gv=true` : "";
  return (
    <>
      <PageHero eyebrow="Free strategy call" crumbs={crumbs} title={<>Book a {site.callMinutes}-minute call on <span className="hl">Google Meet</span></>} lede={embed ? "Pick a time that suits you. You get a calendar invite with a Google Meet link as soon as you book." : "A free video call about your site, your market, and the first fix worth making. No pitch deck."} />
      <section className="band">
        <div className="wrap grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <CallArt className="w-full max-w-md" />
            <h2 className="h-md mt-10">What happens on the call</h2>
            <ul className="mt-5 space-y-3 text-muted">
              {["We look at your site together and name the main thing holding it back.", "You leave with one fix worth making this week, whether or not we work together.", "If a done-for-you scope makes sense, you get it in writing afterward with a fixed price."].map((t) => (
                <li key={t} className="flex gap-3"><span aria-hidden className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-mark" />{t}</li>
              ))}
            </ul>
            <h2 className="h-md mt-10">What to have ready</h2>
            <p className="mt-4 text-muted">Your website address, the two or three searches you most want to win, and access to Google Search Console if you have it. That is all.</p>
          </div>
          <div className="min-w-0">
            {embed ? (
              <div className="overflow-hidden rounded-[20px] border border-line bg-white">
                <iframe src={embed} title="Book a Google Meet call" className="block h-[760px] w-full border-0" loading="lazy" />
              </div>
            ) : (
              <div className="card p-8 sm:p-10">
                <p className="eyebrow">Request a time</p>
                <h2 className="h-md mt-4">Send three times that suit you</h2>
                <p className="mt-4 text-muted">Email your website, your main problem, and three time slots with your time zone. You will get a Google Meet invite back for one of them.</p>
                <a href={mailto} className="btn btn-primary mt-8">Email to request a call</a>
                <p className="mt-5 font-mono text-[13px] text-muted">{site.email}</p>
              </div>
            )}
            {embed && <p className="mt-4 text-[14.5px] text-muted">Trouble with the calendar? <a className="text-link underline underline-offset-4 hover:text-mark" href={url} target="_blank" rel="noopener">Open the booking page</a> or <a className="text-link underline underline-offset-4 hover:text-mark" href={mailto}>email us</a>.</p>}
          </div>
        </div>
      </section>
      <JsonLd data={crumbLd(crumbs)} />
    </>
  );
}
