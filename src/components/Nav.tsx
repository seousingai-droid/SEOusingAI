"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import AccountMenu from "./AccountMenu";

export type NavItem = { href: string; name: string; short?: string; price?: string };
export type NavData = {
  services: { group: string; items: NavItem[] }[];
  audiences: NavItem[];
  guides: NavItem[];
  tools: NavItem[];
};
type MenuId = "services" | "audiences" | "resources";

const Caret = () => (
  <svg className="nav-caret" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden><path d="m2 3.5 3 3 3-3" /></svg>
);

function Item({ i, onGo }: { i: NavItem; onGo: () => void }) {
  return (
    <Link href={i.href} className="nav-item" onClick={onGo}>
      <span className="nav-name">{i.name}</span>
      {i.price ? <span className="nav-price">{i.price}</span> : <span />}
      {i.short && <span className="nav-short">{i.short}</span>}
    </Link>
  );
}

/** Desktop menu with hover intent, click, and full keyboard support. */
function Desktop({ data }: { data: NavData }) {
  const [open, setOpen] = useState<MenuId | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const root = useRef<HTMLDivElement>(null);
  const triggers = useRef<Partial<Record<MenuId, HTMLButtonElement | null>>>({});
  const focusFirst = useRef(false);
  const pathname = usePathname();

  const clear = () => window.clearTimeout(timer.current);
  // Open after a short pause so a pointer passing over the bar does not flash menus.
  // Switching between menus is instant once one is already open.
  const openSoon = (id: MenuId) => { clear(); timer.current = window.setTimeout(() => setOpen(id), open ? 0 : 90); };
  const closeSoon = () => { clear(); timer.current = window.setTimeout(() => setOpen(null), 200); };
  const close = useCallback((focusBack = false) => {
    clear();
    setOpen((cur) => { if (focusBack && cur) triggers.current[cur]?.focus(); return null; });
  }, []);

  useEffect(() => { close(); }, [pathname, close]);
  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") close(true); };
    const away = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node)) close(); };
    document.addEventListener("keydown", esc); document.addEventListener("pointerdown", away);
    return () => { document.removeEventListener("keydown", esc); document.removeEventListener("pointerdown", away); };
  }, [open, close]);
  useEffect(() => () => clear(), []);
  // Arrow Down from a button moves focus into its menu, once the menu exists.
  useEffect(() => {
    if (!open || !focusFirst.current) return;
    focusFirst.current = false;
    document.querySelector<HTMLElement>(`#menu-${open} a`)?.focus();
  }, [open]);

  const trigger = (id: MenuId, label: string, panel?: React.ReactNode) => (
    <div className="relative" onPointerEnter={(e) => e.pointerType === "mouse" && openSoon(id)} onPointerLeave={(e) => e.pointerType === "mouse" && closeSoon()}>
      <button ref={(el) => { triggers.current[id] = el; }} type="button" className="nav-trigger"
        aria-expanded={open === id} aria-controls={`menu-${id}`} aria-haspopup="true"
        onClick={() => { clear(); setOpen((cur) => (cur === id ? null : id)); }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault(); clear();
            if (open === id) document.querySelector<HTMLElement>(`#menu-${id} a`)?.focus();
            else { focusFirst.current = true; setOpen(id); }
          }
        }}>
        {label}<Caret />
      </button>
      {open === id && <span className="nav-bridge" aria-hidden />}
      {open === id && panel && <div className="absolute left-[-14px] top-[calc(100%+10px)]">{panel}</div>}
    </div>
  );

  const audiences = (
    <div id="menu-audiences" className="nav-panel card grid w-[420px] gap-1 p-4">
      <p className="nav-label">Who we help</p>
      {data.audiences.map((i) => <Item key={i.href} i={i} onGo={() => close()} />)}
    </div>
  );
  const resources = (
    <div id="menu-resources" className="nav-panel card grid w-[620px] grid-cols-[1.3fr_1fr] gap-4 p-5">
      <div>
        <p className="nav-label">Guides</p>
        {data.guides.map((i) => <Item key={i.href} i={i} onGo={() => close()} />)}
        <Link href="/guides" onClick={() => close()} className="mt-1 block px-3 text-[14px] text-link underline underline-offset-4 hover:text-mark">All guides</Link>
      </div>
      <div>
        <p className="nav-label">Free tools</p>
        {data.tools.map((i) => <Item key={i.href} i={i} onGo={() => close()} />)}
        <p className="nav-label mt-4">Reference</p>
        <Item i={{ href: "/glossary", name: "Glossary", short: "SEO words in plain English" }} onGo={() => close()} />
        <Item i={{ href: "/case-studies", name: "Case studies", short: "Real results, with sources" }} onGo={() => close()} />
      </div>
    </div>
  );

  return (
    <div ref={root} className="hidden lg:block"
      onBlur={(e) => { if (!root.current?.contains(e.relatedTarget as Node)) closeSoon(); }}>
      <nav aria-label="Main" className="flex items-center gap-7">
        {trigger("services", "Services")}
        {trigger("audiences", "Who we help", audiences)}
        {trigger("resources", "Resources", resources)}
        <Link href="/pricing" className="nav-trigger">Pricing</Link>
        <Link href="/about" className="nav-trigger">About</Link>
      </nav>

      {open === "services" && (
        <div className="absolute inset-x-0 top-full" onPointerEnter={clear} onPointerLeave={(e) => e.pointerType === "mouse" && closeSoon()}>
          <div className="wrap pt-2">
            <div id="menu-services" className="nav-panel card grid gap-2 p-5 lg:grid-cols-3 xl:grid-cols-[1fr_1fr_1fr_250px]">
              {data.services.map((g) => (
                <div key={g.group}>
                  <p className="nav-label">{g.group}</p>
                  {g.items.map((i) => <Item key={i.href} i={i} onGo={() => close()} />)}
                </div>
              ))}
              <div className="flex flex-col justify-between rounded-xl border border-line bg-ink p-5 lg:col-span-3 xl:col-span-1">
                <div>
                  <p className="eyebrow">Not sure which?</p>
                  <p className="mt-3 text-[15px] leading-snug">Tell us about your website on a free 30-minute call. We will tell you what actually matters.</p>
                </div>
                <div className="mt-5 flex flex-col gap-2">
                  <Link href="/book-a-call" onClick={() => close()} className="btn btn-primary !py-2.5 !text-[14.5px]">Book a free call</Link>
                  <Link href="/services" onClick={() => close()} className="text-center text-[14px] text-link underline underline-offset-4 hover:text-mark">All services and prices</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ title, on, onToggle, children }: { title: string; on: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <div className="border-b border-line">
      <button type="button" className="flex w-full items-center justify-between py-4 text-left text-[17px] font-medium" aria-expanded={on} onClick={onToggle}>
        {title}<span className={`text-muted transition-transform ${on ? "rotate-180" : ""}`} aria-hidden>⌄</span>
      </button>
      {on && <div className="pb-4">{children}</div>}
    </div>
  );
}

/** Phone menu: sections that expand in place, with prices kept visible. */
function Mobile({ data }: { data: NavData }) {
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<string | null>("Services");
  const pathname = usePathname();
  useEffect(() => { const id = setTimeout(() => setOpen(false), 0); return () => clearTimeout(id); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", esc);
    return () => { document.body.style.overflow = ""; document.removeEventListener("keydown", esc); };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((o) => !o)}
        className="grid h-11 w-11 place-items-center rounded-lg border border-line">
        {open
          ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden><path d="M6 6l12 12M18 6 6 18" /></svg>
          : <span className="block h-[2px] w-5 bg-text shadow-[0_6px_0_var(--color-text),0_-6px_0_var(--color-text)]" aria-hidden />}
      </button>

      {/* Rendered on the page body: the header's blur effect would otherwise make the
          header, not the screen, the frame for this panel and squash it to 72px tall. */}
      {open && createPortal(
        <div role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-x-0 bottom-0 top-[73px] z-[60] overflow-y-auto border-t border-line bg-ink px-6 pb-10">
          <Section title="Services" on={section === "Services"} onToggle={() => setSection(section === "Services" ? null : "Services")}>
            {data.services.map((g) => (
              <div key={g.group} className="mb-3">
                <p className="nav-label !px-3">{g.group}</p>
                {g.items.map((i) => <Item key={i.href} i={i} onGo={() => setOpen(false)} />)}
              </div>
            ))}
            <Link href="/services" className="block px-3 text-[14.5px] text-link underline underline-offset-4">All services and prices</Link>
          </Section>
          <Section title="Who we help" on={section === "Who we help"} onToggle={() => setSection(section === "Who we help" ? null : "Who we help")}>{data.audiences.map((i) => <Item key={i.href} i={i} onGo={() => setOpen(false)} />)}</Section>
          <Section title="Resources" on={section === "Resources"} onToggle={() => setSection(section === "Resources" ? null : "Resources")}>
            {data.guides.map((i) => <Item key={i.href} i={i} onGo={() => setOpen(false)} />)}
            <p className="nav-label !px-3 mt-3">Free tools</p>
            {data.tools.map((i) => <Item key={i.href} i={i} onGo={() => setOpen(false)} />)}
            <Item i={{ href: "/glossary", name: "Glossary" }} onGo={() => setOpen(false)} />
          </Section>
          <Link href="/pricing" className="block border-b border-line py-4 text-[17px] font-medium">Pricing</Link>
          <Link href="/about" className="block border-b border-line py-4 text-[17px] font-medium">About</Link>
          <div className="mt-6"><AccountMenu variant="mobile" /></div>
          <Link href="/book-a-call" className="btn btn-primary mt-4 w-full">Book a free call</Link>
        </div>,
        document.body,
      )}
    </div>
  );
}

export default function Nav({ data }: { data: NavData }) {
  return <><Desktop data={data} /><Mobile data={data} /></>;
}
