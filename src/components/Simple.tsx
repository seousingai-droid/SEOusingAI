import PageHero, { crumbLd } from "./PageHero";
import JsonLd from "./JsonLd";
export default function Simple({ name, href, eyebrow, title, lede, children }: { name: string; href: string; eyebrow: string; title: React.ReactNode; lede?: string; children: React.ReactNode }) {
  const crumbs = [{ name, href }];
  return (
    <>
      <PageHero eyebrow={eyebrow} crumbs={crumbs} title={title} lede={lede} />
      <section className="wrap py-14 lg:py-20"><div className="prose">{children}</div></section>
      <JsonLd data={crumbLd(crumbs)} />
    </>
  );
}
