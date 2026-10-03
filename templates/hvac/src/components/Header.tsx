"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { business, telHref } from "@/data/business";
import { Logo, PhoneIcon } from "./site";

const nav = [
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/maintenance-plan", label: "Comfort Plan" },
  { href: "/service-areas", label: "Service areas" },
  { href: "/reviews", label: "Reviews" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  useEffect(() => setOpen(false), [path]);
  return (
    <header className="sticky top-0 z-30 border-b border-ink/10 bg-paper/90 backdrop-blur">
      <div className="wrap flex h-[4.5rem] items-center justify-between gap-6">
        <Link href="/" aria-label={`${business.name} home`}><Logo /></Link>
        <nav aria-label="Main" className="hidden items-center gap-0.5 xl:flex">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className={`whitespace-nowrap rounded-md px-3 py-2 text-[0.95rem] font-semibold hover:bg-white ${path.startsWith(n.href) ? "text-copper-deep" : ""}`}>{n.label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a href={telHref} className="hidden items-center gap-2 text-right sm:flex">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-copper text-white"><PhoneIcon /></span>
            <span className="whitespace-nowrap leading-tight"><span className="label block text-[0.6rem] text-muted">24/7 emergency</span><span className="font-bold">{business.phone}</span></span>
          </a>
          <Link href="/contact" className="btn btn-ink ml-2 hidden !min-h-[2.6rem] whitespace-nowrap md:inline-flex">Book a visit</Link>
          <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-nav" className="grid h-11 w-11 place-items-center rounded-md border border-ink/15 xl:hidden">
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">{open ? <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="2" /> : <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="2" />}</svg>
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-ink/10 bg-paper xl:hidden">
          <ul className="wrap divide-y divide-line py-2">
            {nav.map((n) => <li key={n.href}><Link href={n.href} className="block py-3.5 text-[1.05rem] font-semibold">{n.label}</Link></li>)}
            <li><Link href="/faq" className="block py-3.5 text-[1.05rem] font-semibold">FAQ</Link></li>
            <li><Link href="/contact" className="block py-3.5 text-[1.05rem] font-semibold text-copper-deep">Book a visit</Link></li>
          </ul>
        </nav>
      )}
    </header>
  );
}
