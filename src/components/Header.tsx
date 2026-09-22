import Link from "next/link";
import Logo from "./Logo";
import { site } from "@/lib/site";
import MemberLink from "./MemberLink";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink/85 backdrop-blur">
      <div className="wrap flex h-[72px] items-center justify-between gap-6">
        <Link href="/" aria-label="SEO Using AI home"><Logo /></Link>
        <nav aria-label="Main" className="hidden items-center gap-7 text-[15px] text-muted lg:flex">
          {site.nav.map((n) => (
            <Link key={n.href} href={n.href} className="transition-colors hover:text-text">{n.label}</Link>
          ))}
          <MemberLink className="text-mark transition-colors hover:text-text" />
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/book-a-call" className="btn btn-primary !hidden !py-2.5 !px-4 !text-[15px] sm:!inline-flex">Book a call</Link>
          <details className="relative lg:hidden">
            <summary className="grid h-11 w-11 cursor-pointer list-none place-items-center rounded-lg border border-line [&::-webkit-details-marker]:hidden" aria-label="Open menu">
              <span className="block h-[2px] w-5 bg-text shadow-[0_6px_0_var(--color-text),0_-6px_0_var(--color-text)]" />
            </summary>
            <nav aria-label="Mobile" className="card absolute right-0 top-14 flex w-64 flex-col p-3">
              {site.nav.map((n) => (
                <Link key={n.href} href={n.href} className="rounded-lg px-3 py-3 hover:bg-panel2">{n.label}</Link>
              ))}
              <MemberLink className="rounded-lg px-3 py-3 text-mark hover:bg-panel2" />
              <Link href="/book-a-call" className="btn btn-primary mt-2">Book a call</Link>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
