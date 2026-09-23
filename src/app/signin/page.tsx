import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import SignInPage from "./SignInPage";

export const metadata: Metadata = {
  title: { absolute: "Sign In | SEO Using AI" },
  description: "Sign in to check your website against 94 SEO and AI search checks, see your saved audits, and pick up your to-do list.",
  alternates: { canonical: "/signin" },
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Account" crumbs={[{ name: "Sign in", href: "/signin" }]} title={<>Sign in to <span className="hl">check your website</span></>} lede="A free account takes one email. No password, no card. You get a full audit of every page, and your reports saved." />
      <section className="wrap grid gap-10 py-12 lg:grid-cols-[1.15fr_0.85fr] lg:py-16">
        <SignInPage />
        <aside className="card h-fit p-7">
          <p className="eyebrow">What an account gives you</p>
          <ul className="mt-5 space-y-3.5 text-[15.5px]">
            {["A full audit of every page, free", "Up to 3 websites, as often as you like", "Your audits saved so you can track progress", "One to-do list across your websites"].map((t) => (
              <li key={t} className="flex gap-3"><span aria-hidden className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-mark text-ink"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="m5 12 5 5 9-10" /></svg></span>{t}</li>
            ))}
          </ul>
          <p className="mt-6 border-t border-line pt-5 text-[14.5px] text-muted">We use your email to keep you signed in and to send occasional guides. You can unsubscribe at any time. Read our <Link className="text-link underline underline-offset-4 hover:text-mark" href="/privacy">privacy policy</Link>.</p>
        </aside>
      </section>
    </>
  );
}
