import Image from "next/image";
import { CallButtons, Crumbs } from "./site";

/** The top of every inner page: where you are, the answer in the first lines, and the two actions. */
export default function PageIntro({ crumbs, eyebrow, title, answer, image, imageAlt, actions = true }: {
  crumbs: { name: string; href: string }[];
  eyebrow: string;
  title: string;
  answer: string;
  image?: string;
  imageAlt?: string;
  actions?: boolean;
}) {
  return (
    <section className="border-b border-ink/10">
      <div className={`wrap grid gap-10 py-12 md:py-16 ${image ? "lg:grid-cols-[1.1fr_0.9fr] lg:items-center" : ""}`}>
        <div>
          <Crumbs items={crumbs} />
          <p className="label mt-8 text-copper">{eyebrow}</p>
          <h1 className="display h-xl mt-4 !text-[clamp(2.1rem,4.6vw,3.7rem)]">{title}</h1>
          <p className="mt-6 max-w-[60ch] text-[1.12rem] text-muted">{answer}</p>
          {actions && <div className="mt-8"><CallButtons /></div>}
        </div>
        {image && (
          <div className="plate overflow-hidden p-2">
            <div className="relative aspect-[3/2] overflow-hidden rounded-[0.3rem]">
              <Image src={`/images/${image}.webp`} alt={imageAlt ?? ""} fill priority sizes="(min-width: 1024px) 520px, 100vw" className="object-cover" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
