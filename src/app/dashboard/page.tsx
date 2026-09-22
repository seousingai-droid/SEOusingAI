import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Dashboard from "./Dashboard";

// A private area. Nothing here is useful to a search engine.
export const metadata: Metadata = {
  title: { absolute: "My Dashboard | SEO Using AI" },
  description: "Your saved website audits, your score over time, and one ordered list of what to fix next.",
  alternates: { canonical: "/dashboard" },
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Members" crumbs={[{ name: "Dashboard", href: "/dashboard" }]} title={<>Your audits, your score, and <span className="hl">what to do next</span></>} lede="Every check you run is saved here. Watch your score move, see what changed, and tick jobs off as you finish them." />
      <section className="wrap py-12 lg:py-16"><Dashboard /></section>
    </>
  );
}
