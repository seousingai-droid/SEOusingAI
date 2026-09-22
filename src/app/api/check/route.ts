import { NextResponse } from "next/server";
import { safeFetch, type Fetched } from "@/lib/safeFetch";
import { runChecks, planExtras, redact, type LinkProbe } from "@/lib/checker";
import { verifyKey } from "@/lib/license";

export const runtime = "nodejs";
export const maxDuration = 60;

// Best-effort limit per server instance. For heavy traffic, move this to a shared store.
const hits = new Map<string, number[]>();
function limited(ip: string, max: number) {
  const now = Date.now(); const list = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  list.push(now); hits.set(ip, list); if (hits.size > 5000) hits.clear();
  return list.length > max;
}
const quiet = (p: Promise<Fetched>) => p.catch(() => null);
const probe = (url: string): Promise<LinkProbe> => safeFetch(url, { timeout: 6000, maxBytes: 20_000 }).then((f) => ({ url, status: f.status })).catch(() => ({ url, status: null }));

export async function POST(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") ?? "local").split(",")[0].trim();
  const unlocked = verifyKey(req.headers.get("x-license") ?? "");
  if (limited(ip, unlocked ? 30 : 6)) return NextResponse.json({ error: "Too many checks in a short time. Please wait a minute and try again." }, { status: 429 });
  let input = "";
  try { input = String((await req.json()).url ?? "").trim(); } catch { /* handled below */ }
  if (!input || input.length > 300) return NextResponse.json({ error: "Enter your website address, like example.com." }, { status: 400 });
  if (!/^https?:\/\//i.test(input)) input = "https://" + input;
  let target: URL;
  try { target = new URL(input); } catch { return NextResponse.json({ error: "That does not look like a website address." }, { status: 400 }); }
  try {
    const page = await safeFetch(target.href);
    if (!/html/i.test(page.headers.get("content-type") ?? "html")) return NextResponse.json({ error: "That address is not a web page." }, { status: 400 });
    const plan = planExtras(page);
    const small = { timeout: 6000, maxBytes: 300_000 };
    const robots = await quiet(safeFetch(plan.origin + "/robots.txt", small));
    const smUrl = robots?.status === 200 ? robots.body.match(/^sitemap:\s*(\S+)/im)?.[1] : undefined;
    const [sitemap, llms, http, alt, notFound, ogImage, ...links] = await Promise.all([
      quiet(safeFetch(smUrl ?? plan.origin + "/sitemap.xml", small)),
      quiet(safeFetch(plan.origin + "/llms.txt", { timeout: 5000, maxBytes: 100_000 })),
      plan.http ? quiet(safeFetch(plan.http, { timeout: 6000, maxBytes: 20_000 })) : Promise.resolve(null),
      plan.alt ? quiet(safeFetch(plan.alt, { timeout: 6000, maxBytes: 20_000 })) : Promise.resolve(null),
      quiet(safeFetch(plan.notFound, { timeout: 6000, maxBytes: 20_000 })),
      plan.ogImage ? quiet(safeFetch(plan.ogImage, { timeout: 6000, maxBytes: 50_000 })) : Promise.resolve(null),
      ...plan.links.map(probe),
    ]);
    const report = runChecks(page, { robots, sitemap, llms, http, alt, notFound, ogImage, links });
    return NextResponse.json(unlocked ? report : redact(report), { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Something went wrong. Please try again." }, { status: 422 });
  }
}
