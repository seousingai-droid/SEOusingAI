import Link from "next/link";
import Image from "next/image";
import type { Guide } from "@/lib/content";

/**
 * The one card used wherever a guide is listed, so every list looks the same.
 * The image is decorative here: the title beside it already says what it is,
 * so screen readers are not told the same thing twice.
 */
export default function GuideCard({ g, size = "md", sizes, priority = false }: { g: Guide; size?: "sm" | "md" | "lg"; sizes?: string; priority?: boolean }) {
  const title = size === "lg" ? "text-[clamp(24px,2.8vw,34px)]" : size === "sm" ? "text-[18.5px]" : "text-[21px]";
  const wide = size === "lg";
  return (
    <Link href={`/guides/${g.slug}`}
      className={`card card-hover group flex h-full flex-col overflow-hidden ${wide ? "lg:grid lg:grid-cols-[1.15fr_1fr]" : ""}`}>
      {g.image && (
        <div className={`relative overflow-hidden border-b border-line ${wide ? "lg:border-b-0 lg:border-r" : ""}`}>
          <Image src={g.image} alt="" width={1600} height={900} priority={priority}
            sizes={sizes ?? (wide ? "(min-width: 1024px) 620px, 100vw" : "(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw")}
            className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100" />
        </div>
      )}
      <div className={`flex flex-1 flex-col ${size === "sm" ? "p-6" : wide ? "p-7 lg:justify-center lg:p-10" : "p-7"}`}>
        <p className="eyebrow">{g.eyebrow}</p>
        <h3 className={`mt-3 font-bold leading-tight ${title}`}>{g.title}</h3>
        {wide && <p className="mt-3 max-w-xl text-muted">{g.description}</p>}
        <p className={`${wide ? "mt-auto lg:mt-6" : "mt-auto"} pt-5 font-mono text-[13px] text-muted`}>{g.readMinutes} min read <span className="text-mark transition-transform group-hover:translate-x-1 inline-block">→</span></p>
      </div>
    </Link>
  );
}
