/**
 * What each plan allows.
 *
 * Crawling costs real money, so the limits here are the cost control: how many
 * websites a member may register, and how deep each audit goes.
 */
export type Tier = "free" | "basic" | "standard" | "premium";

/**
 * Paid plans audit the whole site. This is a ceiling, not a target: in practice
 * the time budget in the crawler stops first on a large or slow website, and
 * the report says plainly how many pages were reached.
 */
export const FULL_SITE = 300;

export type Plan = {
  id: Tier; name: string; price: number; sites: number; pages: number;
  fullResults: boolean; blurb: string; best: string; includes: string[];
  /** Paste the checkout link for this plan here to turn the buy button on. */
  checkoutUrl?: string;
};

export const PLANS: Record<Tier, Plan> = {
  free: {
    id: "free", name: "Free", price: 0, sites: 1, pages: 1, fullResults: false,
    blurb: "Check one page and see the five most important results.",
    best: "Seeing whether your site has a problem at all.",
    includes: ["One page per check", "5 of 94 results", "Your score out of 100", "The names of the top 3 fixes"],
  },
  basic: {
    id: "basic", name: "Basic", price: 39, sites: 1, pages: FULL_SITE, fullResults: true,
    blurb: "Your whole website audited, every page we can reach.",
    best: "One business with one website.",
    checkoutUrl: "",
    includes: ["1 website", "Every page audited, not a sample", "All 94 checks on every page", "Every fix explained in plain English", "Saved history and your to-do list", "Printable report"],
  },
  standard: {
    id: "standard", name: "Standard", price: 67, sites: 3, pages: FULL_SITE, fullResults: true,
    blurb: "Three websites, each audited in full.",
    best: "A freelancer, or a business with a few sites.",
    checkoutUrl: "",
    includes: ["3 websites", "Every page audited on each", "All 94 checks on every page", "Separate history per website", "Compare your sites side by side", "Printable reports"],
  },
  premium: {
    id: "premium", name: "Premium", price: 127, sites: 10, pages: FULL_SITE, fullResults: true,
    blurb: "Ten websites, each audited in full.",
    best: "An agency looking after client sites.",
    checkoutUrl: "",
    includes: ["10 websites", "Every page audited on each", "All 94 checks on every page", "Separate history per website", "Client-ready printable reports", "Every future check included"],
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
