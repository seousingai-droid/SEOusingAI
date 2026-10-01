import Link from "next/link";
import Logo from "./Logo";
import Nav, { type NavData } from "./Nav";
import { servicePages, MENU_GROUPS, shortPrice } from "@/lib/servicePages";
import { landingPages } from "@/lib/landingPages";
import { getGuides } from "@/lib/content";
import { bundles, tools } from "@/lib/site";

// The menu is built from the same data as the pages, so a new service or
// price change appears in the menu without touching this file.
function navData(): NavData {
  // Guides shown in the menu, with their menu labels written out.
  const featured: { slug: string; name: string; short?: string }[] = [
    { slug: "how-to-use-ai-for-seo", name: "How to Use AI for SEO", short: "Start here" },
    { slug: "ai-seo-strategies", name: "AI SEO Strategies" },
    { slug: "best-ai-seo-tools", name: "Best AI SEO Tools" },
    { slug: "generative-engine-optimization", name: "Generative Engine Optimization", short: "GEO" },
  ];
  const guides = new Set(getGuides().map((g) => g.slug));
  return {
    bundles: bundles.map((b) => ({ href: b.href, name: b.name, short: b.short, price: `${b.price}/mo` })),
    services: MENU_GROUPS.map((group) => ({
      group,
      items: servicePages.filter((s) => s.group === group).map((s) => ({ href: `/services/${s.slug}`, name: s.name, short: s.short, price: shortPrice(s) })),
    })),
    audiences: landingPages.map((l) => ({ href: `/${l.slug}`, name: l.menu.name, short: l.menu.short })),
    guides: featured.filter((g) => guides.has(g.slug)).map((g) => ({ href: `/guides/${g.slug}`, name: g.name, short: g.short })),
    tools: tools.map((t) => ({ href: `/tools/${t.slug}`, name: t.name })),
  };
}

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-canvas/90 backdrop-blur">
      <div className="wrap relative flex h-[72px] items-center justify-between gap-2.5 lg:gap-6">
        <Link href="/" aria-label="SEO Using AI home" className="shrink-0"><Logo /></Link>
        <Nav data={navData()} />
        <div className="ml-auto flex items-center lg:ml-0">
          <Link href="/book-a-call" className="btn btn-primary whitespace-nowrap !px-3.5 !py-2 !text-[14px] sm:!px-4 sm:!py-2.5 sm:!text-[15px]">Book a call</Link>
        </div>
      </div>
    </header>
  );
}
