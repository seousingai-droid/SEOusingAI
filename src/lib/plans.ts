/**
 * What each plan allows.
 *
 * Crawling costs real money, so the limits here are the cost control: how many
 * websites a member may register, and how deep each audit goes.
 */
export type Tier = "free" | "basic" | "standard" | "premium";

export type Plan = {
  id: Tier; name: string; price: number; sites: number; pages: number;
  fullResults: boolean; blurb: string; best: string; includes: string[];
};

export const PLANS: Record<Tier, Plan> = {
  free: {
    id: "free", name: "Free", price: 0, sites: 1, pages: 1, fullResults: false,
    blurb: "Check one page and see the five most important results.",
    best: "Seeing whether your site has a problem at all.",
    includes: ["One page per check", "5 of 94 results", "Your score out of 100", "The names of the top 3 fixes"],
  },
  basic: {
    id: "basic", name: "Basic", price: 67, sites: 1, pages: 25, fullResults: true,
    blurb: "A full audit of one website, up to 25 pages.",
    best: "One business with one website.",
    includes: ["1 website", "Up to 25 pages crawled", "All 94 checks on every page", "Every fix explained in plain English", "Saved history and your to-do list", "Printable report"],
  },
  standard: {
    id: "standard", name: "Standard", price: 127, sites: 3, pages: 50, fullResults: true,
    blurb: "Three websites, up to 50 pages each.",
    best: "A freelancer or a business with a few sites.",
    includes: ["3 websites", "Up to 50 pages each", "All 94 checks on every page", "Compare your sites side by side", "Saved history per website", "Printable reports"],
  },
  premium: {
    id: "premium", name: "Premium", price: 247, sites: 10, pages: 100, fullResults: true,
    blurb: "Ten websites, up to 100 pages each.",
    best: "An agency looking after client sites.",
    includes: ["10 websites", "Up to 100 pages each", "All 94 checks on every page", "Saved history per website", "Printable client-ready reports", "Every future check included"],
  },
};

export const PAID: Tier[] = ["basic", "standard", "premium"];
export const planOf = (t: string | undefined): Plan => PLANS[(t as Tier) in PLANS ? (t as Tier) : "free"];
export const isPaid = (t: string | undefined) => PAID.includes(t as Tier);

/** Normalises a website to the key we count against the site limit. */
export function siteKey(input: string): string | null {
  try {
    const u = new URL(/^https?:\/\//i.test(input) ? input : `https://${input}`);
    return u.hostname.replace(/^www\./, "").toLowerCase();
  } catch { return null; }
}
