import Link from "next/link";
import Logo from "./Logo";
import Nav, { type NavData } from "./Nav";
import AccountMenu from "./AccountMenu";
import { servicePages, MENU_GROUPS, shortPrice } from "@/lib/servicePages";
import { landingPages } from "@/lib/landingPages";
import { getGuides } from "@/lib/content";
import { tools } from "@/lib/site";

// The menu is built from the same data as the pages, so a new service or
// price change appears in the menu without touching this file.
function navData(): NavData {
  const featured = ["how-to-use-ai-for-seo", "ai-seo-strategies", "best-ai-seo-tools", "generative-engine-optimization"];
  const guides = getGuides();
  return {
    services: MENU_GROUPS.map((group) => ({
      group,
      items: servicePages.filter((s) => s.group === group).map((s) => ({ href: `/services/${s.slug}`, name: s.name, short: s.short, price: shortPrice(s) })),
    })),
    audiences: landingPages.map((l) => ({ href: `/${l.slug}`, name: l.nav.replace(/^AI SEO for /, "For ").replace(/^AI SEO agency$/, "How our agency works"), short: l.lede.split(". ")[0].replace(/\.$/, "") })),
    guides: featured.map((slug) => guides.find((g) => g.slug === slug)).filter(Boolean).map((g) => {
      const name = g!.title.split(":")[0];
      // A subtitle that repeats the title ("AI SEO Strategies / Strategies") says nothing, so drop it.
      const first = g!.eyebrow.split(" ")[0].toLowerCase().replace(/s$/, "");
      return { href: `/guides/${g!.slug}`, name, short: name.toLowerCase().includes(first) ? undefined : g!.eyebrow };
    }),
    tools: tools.map((t) => ({ href: `/tools/${t.slug}`, name: t.name })),
  };
}

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink/90 backdrop-blur">
      <div className="wrap relative flex h-[72px] items-center justify-between gap-6">
        <Link href="/" aria-label="SEO Using AI home" className="shrink-0"><Logo /></Link>
        <Nav data={navData()} />
        <div className="flex items-center gap-3">
          <div className="hidden lg:block"><AccountMenu /></div>
          <Link href="/book-a-call" className="btn btn-primary !hidden !py-2.5 !px-4 !text-[15px] sm:!inline-flex">Book a call</Link>
        </div>
      </div>
    </header>
  );
}
