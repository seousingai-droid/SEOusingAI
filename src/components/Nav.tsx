"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type NavItem = { href: string; name: string; short?: string; price?: string };
export type NavData = {
  bundles: NavItem[];
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
        <Link href="/guides" onClick={() => close()} className="mt-1 block px-3 text-[14px] text-link underline underline-offset-4 hover:text-gold">All guides</Link>
      </div>
      <div>
        <p className="nav-label">Free tools</p>
        {data.tools.map((i) => <Item key={i.href} i={i} onGo={() => close()} />)}
        <p className="nav-label mt-4">Reference</p>
        <Item i={{ href: "/seo-tips", name: "SEO tips videos", short: "20-second tips, full method" }} onGo={() => close()} />
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
            <div id="menu-services" className="nav-panel card grid gap-2 p-5 lg:grid-cols-3 xl:grid-cols-[1fr_1fr_1fr_270px]">
              {data.services.map((g) => (
                <div key={g.group}>
                  <p className="nav-label">{g.group}</p>
                  {g.items.map((i) => <Item key={i.href} i={i} onGo={() => close()} />)}
                </div>
              ))}
              <div className="flex flex-col justify-between rounded-xl border border-mark/50 bg-canvas p-3 lg:col-span-3 xl:col-span-1">
                <div>
                  <p className="nav-label">Bundles: we handle everything</p>
                  {data.bundles.map((i) => (
                    <Link key={i.href} href={i.href} onClick={() => close()} className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-panel2 focus-visible:bg-panel2">
                      <span className="block text-[15.5px] font-semibold leading-snug">{i.name}</span>
                      <span className="mt-0.5 block font-mono text-[12.5px] text-gold">{i.price}</span>
                      <span className="mt-0.5 block text-[13.5px] leading-snug text-muted">{i.short}</span>
                    </Link>
                  ))}
                </div>
                <div className="mt-3 flex flex-col gap-2 px-2 pb-2">
                  <Link href="/book-a-call" onClick={() => close()} className="btn btn-primary !py-2.5 !text-[14.5px]">Book a free call</Link>
                  <Link href="/services" onClick={() => close()} className="text-center text-[14px] text-link underline underline-offset-4 hover:text-gold">All services and prices</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** One row in the phone menu: name and price on top, a short line under it. */
function MobileItem({ i, onGo }: { i: NavItem; onGo: () => void }) {
  return (
    <Link href={i.href} onClick={onGo} className="flex items-start justify-between gap-4 px-4 py-3.5 transition-colors active:bg-panel2">
      <span className="min-w-0">
        <span className="block text-[16px] font-semibold leading-snug">{i.name}</span>
        {i.short && <span className="mt-0.5 block text-[13.5px] leading-snug text-muted">{i.short}</span>}
      </span>
      {i.price && <span className="mt-0.5 shrink-0 rounded-full bg-[#fff4c9] px-2.5 py-1 font-mono text-[11.5px] font-bold text-gold">{i.price}</span>}
    </Link>
  );
}

/** A labelled group of rows in a white card, with a line between every row. */
function Group({ label, tone, children }: { label?: string; tone?: string; children: React.ReactNode }) {
  return (
    <div className="mt-4 first:mt-0">
      {label && <p className={`mb-2 inline-block rounded-full px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-night ${tone ?? "bg-panel2"}`}>{label}</p>}
      <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white shadow-[0_1px_2px_rgb(20_26_51/0.05)]">{children}</div>
    </div>
  );
}

const groupTone: Record<string, string> = { "Get found": "bg-[#dce6ff]", Grow: "bg-[#d5f0e2]", "Market and convert": "bg-[#ffe0da]" };

function Section({ title, dot, on, onToggle, children }: { title: string; dot: string; on: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <div className="border-b-2 border-line">
      <button type="button" className="flex w-full items-center justify-between py-4 text-left" aria-expanded={on} onClick={onToggle}>
        <span className="flex items-center gap-3 font-[family-name:var(--font-display)] text-[19px] font-bold"><span aria-hidden className={`h-3 w-3 rounded-full ${dot}`} />{title}</span>
        <span aria-hidden className={`grid h-8 w-8 place-items-center rounded-full border border-line bg-white text-muted transition-transform ${on ? "rotate-180" : ""}`}>
          <svg width="12" height="12" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m2 3.5 3 3 3-3" /></svg>
        </span>
      </button>
      {on && <div className="pb-5">{children}</div>}
    </div>
  );
}

/** Phone menu: colour-coded sections that expand in place, rows in cards, and the call always in reach. */
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
  const go = () => setOpen(false);
  const toggle = (name: string) => setSection(section === name ? null : name);

  return (
    <div className="order-last lg:hidden">
      <button type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((o) => !o)}
        className={`grid h-11 w-11 place-items-center rounded-xl border-2 transition-colors ${open ? "border-night bg-night text-white" : "border-line bg-white"}`}>
        {open
          ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden><path d="M6 6l12 12M18 6 6 18" /></svg>
          : <span className="block h-[2px] w-5 rounded bg-night shadow-[0_6px_0_var(--color-night),0_-6px_0_var(--color-night)]" aria-hidden />}
      </button>

      {/* Rendered on the page body: the header's blur effect would otherwise make the
          header, not the screen, the frame for this panel and squash it to 72px tall. */}
      {open && createPortal(
        <div role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-x-0 bottom-0 top-[73px] z-[60] flex flex-col border-t-2 border-line bg-canvas">
          <div className="paper-dots flex-1 overflow-y-auto px-5 pb-6">
            <Section title="Services" dot="bg-sky" on={section === "Services"} onToggle={() => toggle("Services")}>
              <Group label="Bundles: we handle everything" tone="bg-mark">{data.bundles.map((i) => <MobileItem key={i.href} i={i} onGo={go} />)}</Group>
              {data.services.map((g) => (
                <Group key={g.group} label={g.group} tone={groupTone[g.group]}>{g.items.map((i) => <MobileItem key={i.href} i={i} onGo={go} />)}</Group>
              ))}
              <Link href="/services" onClick={go} className="mt-4 block text-center text-[15px] font-semibold text-link underline underline-offset-4">All services and prices</Link>
            </Section>
            <Section title="Who we help" dot="bg-leaf" on={section === "Who we help"} onToggle={() => toggle("Who we help")}>
              <Group>{data.audiences.map((i) => <MobileItem key={i.href} i={i} onGo={go} />)}</Group>
            </Section>
            <Section title="Resources" dot="bg-grape" on={section === "Resources"} onToggle={() => toggle("Resources")}>
              <Group label="Guides" tone="bg-[#e9e1ff]">{data.guides.map((i) => <MobileItem key={i.href} i={i} onGo={go} />)}</Group>
              <Group label="Free tools" tone="bg-[#d5f0e2]">{data.tools.map((i) => <MobileItem key={i.href} i={i} onGo={go} />)}</Group>
              <Group label="Learn" tone="bg-[#ffe0da]">
                <MobileItem i={{ href: "/seo-tips", name: "SEO tips videos", short: "20-second tips, full method" }} onGo={go} />
                <MobileItem i={{ href: "/glossary", name: "Glossary", short: "SEO words in plain English" }} onGo={go} />
              </Group>
            </Section>
            <Link href="/pricing" onClick={go} className="flex items-center gap-3 border-b-2 border-line py-4 font-[family-name:var(--font-display)] text-[19px] font-bold"><span aria-hidden className="h-3 w-3 rounded-full bg-mark ring-1 ring-night/30" />Pricing</Link>
            <Link href="/about" onClick={go} className="flex items-center gap-3 border-b-2 border-line py-4 font-[family-name:var(--font-display)] text-[19px] font-bold"><span aria-hidden className="h-3 w-3 rounded-full bg-coral" />About</Link>
          </div>
          <div className="border-t-2 border-line bg-white px-5 pb-6 pt-4">
            <Link href="/book-a-call" onClick={go} className="btn btn-primary w-full">Book a free call <span aria-hidden>→</span></Link>
            <p className="mt-2 text-center text-[13px] text-muted">30 minutes on Google Meet. No pitch deck.</p>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}

export default function Nav({ data }: { data: NavData }) {
  return <><Desktop data={data} /><Mobile data={data} /></>;
}
