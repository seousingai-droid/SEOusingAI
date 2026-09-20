import Link from "next/link";
export type Crumb = { name: string; href: string };
export default function PageHero({ eyebrow, title, lede, crumbs }: { eyebrow: string; title: React.ReactNode; lede?: string; crumbs?: Crumb[] }) {
  return (
    <section className="border-b border-line">
      <div className="wrap pb-14 pt-12 lg:pb-20 lg:pt-16">
        {crumbs && (
          <nav aria-label="Breadcrumb" className="mb-8 font-mono text-[12.5px] text-muted">
            <ol className="flex flex-wrap gap-2">
              <li><Link className="hover:text-text" href="/">Home</Link></li>
              {crumbs.map((c, i) => (
                <li key={c.href} className="flex gap-2"><span aria-hidden>/</span>{i === crumbs.length - 1 ? <span className="text-text" aria-current="page">{c.name}</span> : <Link className="hover:text-text" href={c.href}>{c.name}</Link>}</li>
              ))}
            </ol>
          </nav>
        )}
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="h-lg mt-5 max-w-4xl !text-[clamp(36px,5vw,62px)]">{title}</h1>
        {lede && <p className="lede mt-6 max-w-2xl">{lede}</p>}
      </div>
    </section>
  );
}
export const crumbLd = (crumbs: Crumb[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [{ name: "Home", href: "/" }, ...crumbs].map((c, i) => ({
    "@type": "ListItem", position: i + 1, name: c.name, item: `https://seousingai.com${c.href === "/" ? "" : c.href}`,
  })),
});
