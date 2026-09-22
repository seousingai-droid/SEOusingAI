import { site } from "@/lib/site";

/** The site's primary action. Plain GET form, so it works without JavaScript. */
export default function CheckForm({ id = "check", size = "lg" }: { id?: string; size?: "lg" | "sm" }) {
  const big = size === "lg";
  return (
    <form action="/tools/seo-checklist" method="get" className={`card flex flex-col gap-3 ${big ? "p-4 sm:flex-row sm:p-3" : "p-3 sm:flex-row sm:p-2.5"}`}>
      <label htmlFor={id} className="sr-only">Your website address</label>
      <input id={id} name="url" required className={`field !border-0 !bg-transparent sm:flex-1 ${big ? "text-[18px]" : "text-[16px]"}`} placeholder="yourwebsite.com" inputMode="url" autoCapitalize="none" autoCorrect="off" spellCheck={false} />
      <button className={`btn btn-primary shrink-0 ${big ? "" : "!py-3 !text-[15px]"}`}>Check my website <span aria-hidden>→</span></button>
    </form>
  );
}

export const trustPoints = [
  ["Free account", "Just an email. No password, no card."],
  ["Your page is not stored", "We open it, check it, and keep no copy."],
  [`${site.checklist.freeChecks} free every time`, "Free results on every page you check, forever."],
  ["Plain English", "Every result says what it found and how to fix it."],
] as const;
