import { NextResponse } from "next/server";
import { safeFetch, type Fetched } from "@/lib/safeFetch";
import { runChecks } from "@/lib/checker";

export const runtime = "nodejs";
export const maxDuration = 30;

// Best-effort limit per server instance. For heavy traffic, move this to a shared store.
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now(); const list = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  list.push(now); hits.set(ip, list); if (hits.size > 5000) hits.clear();
  return list.length > 8;
}
const quiet = (p: Promise<Fetched>) => p.catch(() => null);

export async function POST(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") ?? "local").split(",")[0].trim();
  if (limited(ip)) return NextResponse.json({ error: "Too many checks in a short time. Please wait a minute and try again." }, { status: 429 });
  let input = "";
  try { input = String((await req.json()).url ?? "").trim(); } catch { /* handled below */ }
  if (!input || input.length > 300) return NextResponse.json({ error: "Enter your website address, like example.com." }, { status: 400 });
  if (!/^https?:\/\//i.test(input)) input = "https://" + input;
  let target: URL;
  try { target = new URL(input); } catch { return NextResponse.json({ error: "That does not look like a website address." }, { status: 400 }); }
  try {
    const page = await safeFetch(target.href);
    if (!/html/i.test(page.headers.get("content-type") ?? "html")) return NextResponse.json({ error: "That address is not a web page." }, { status: 400 });
    const origin = new URL(page.url).origin;
    const robots = await quiet(safeFetch(origin + "/robots.txt", { timeout: 6000, maxBytes: 300_000 }));
    const smUrl = robots?.status === 200 ? robots.body.match(/^sitemap:\s*(\S+)/im)?.[1] : undefined;
    const [sitemap, llms] = await Promise.all([
      quiet(safeFetch(smUrl ?? origin + "/sitemap.xml", { timeout: 6000, maxBytes: 300_000 })),
      quiet(safeFetch(origin + "/llms.txt", { timeout: 5000, maxBytes: 100_000 })),
    ]);
    return NextResponse.json(runChecks(page, { robots, sitemap, llms }), { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Something went wrong. Please try again." }, { status: 422 });
  }
}
