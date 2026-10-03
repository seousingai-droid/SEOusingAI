import type { Metadata } from "next";
import PageIntro from "@/components/PageIntro";
import { CtaBand, FaqList, JsonLd, faqLd } from "@/components/site";
import { faqs, services } from "@/data/hvac";
import { business } from "@/data/business";

export const metadata: Metadata = {
  title: `Heating and AC Questions, Answered`,
  description: `Answers to common questions about AC repair, new systems, prices, financing and service areas from ${business.name}.`,
  alternates: { canonical: "/faq" },
};

export default function Faq() {
  const all = [...faqs, ...services.flatMap((s) => s.faqs)];
  return (
    <>
      <PageIntro crumbs={[{ name: "FAQ", href: "/faq" }]} eyebrow="FAQ" title="Heating and AC questions, answered"
        answer={`We answer emergency AC calls 24/7 and usually arrive the same day. A diagnostic visit is $89, credited to the repair, and you get a written price before any work starts. More answers about prices, financing, new systems and maintenance are below.`} />
      <section className="wrap max-w-4xl py-16"><FaqList items={all} /></section>
      <CtaBand />
      <JsonLd data={faqLd(all)} />
    </>
  );
}
