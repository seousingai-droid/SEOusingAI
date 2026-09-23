import { NextResponse } from "next/server";
import { auditSite, redactAudit } from "@/lib/crawl";
import { currentSession, cookieOptions, COOKIE, sign } from "@/lib/session";
import { planOf, siteKey } from "@/lib/plans";

export const runtime = "nodejs";
export const maxDuration = 60;

// Crawling costs money, so it is limited per member as well as per visitor.
const hits = new Map<string, number[]>();
function over(key: string, max: number, windowMs: number) {
  const now = Date.now(); const list = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  list.push(now); hits.set(key, list); if (hits.size > 5000) hits.clear();
  return list.length > max;
}

export async function POST(req: Request) {
  const session = await currentSession();
  if (!session) return NextResponse.json({ error: "Please sign in to run a check.", needsSignIn: true }, { status: 401 });
  const plan = planOf(session.plan);
  const ip = (req.headers.get("x-forwarded-for") ?? "local").split(",")[0].trim();

  let input = "";
  try { input = String((await req.json()).url ?? "").trim(); } catch { /* handled below */ }
  if (!input || input.length > 300) return NextResponse.json({ error: "Enter your website address, like example.com." }, { status: 400 });
  if (!/^https?:\/\//i.test(input)) input = "https://" + input;
  let target: URL;
  try { target = new URL(input); } catch { return NextResponse.json({ error: "That does not look like a website address." }, { status: 400 }); }

  // Which websites this member has registered, and whether this is a new one.
  const host = siteKey(target.href);
  if (!host) return NextResponse.json({ error: "That does not look like a website address." }, { status: 400 });
  const sites = session.sites ?? [];
  const known = sites.includes(host);
  if (!known && sites.length >= plan.sites) {
    return NextResponse.json({
      error: plan.sites === 1
        ? `Your ${plan.name} plan covers one website, and you have already added ${sites[0]}. Upgrade to audit more websites.`
        : `Your ${plan.name} plan covers ${plan.sites} websites and you have added them all. Upgrade to audit more.`,
      limit: true, sites, allowed: plan.sites,
    }, { status: 403 });
  }

  const deep = plan.pages > 1;
  if (over(`ip:${ip}`, deep ? 20 : 6, 60_000)) return NextResponse.json({ error: "Too many checks in a short time. Please wait a minute and try again." }, { status: 429 });
  if (deep && over(`deep:${session.email}`, 6, 60 * 60_000)) {
    return NextResponse.json({ error: "You have run six full audits in the last hour. Please wait a little before the next one." }, { status: 429 });
  }

  try {
    // One code path for everyone: the free plan is simply an audit of one page.
    const audit = await auditSite(target.href, plan.pages);
    const payload = plan.fullResults ? audit : redactAudit(audit);
    const res = NextResponse.json(payload, { headers: { "Cache-Control": "no-store" } });

    // Register the website against the member once an audit has actually run.
    if (!known) {
      const token = sign({ ...session, sites: [...sites, host] });
      if (token) res.cookies.set(COOKIE, token, cookieOptions);
    }
    return res;
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Something went wrong. Please try again." }, { status: 422 });
  }
}
