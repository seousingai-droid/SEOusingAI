import { safeFetch, type Fetched } from "./safeFetch";
import { runChecks, planExtras, GROUPS, type Check, type Report, type Status, type LinkProbe } from "./checker";

/**
 * A full-site audit.
 *
 * Pages are discovered from the sitemap, then from the site's own links, and
 * checked in parallel inside a time budget. Findings are then rolled up so the
 * reader sees "12 pages have no description", not the same problem twelve times.
 */

export type PageResult = { url: string; path: string; title: string; score: number; fail: number; warn: number; checks: Check[] };
export type Finding = Check & { pages: string[]; passing: number; total: number };
export type SiteAudit = {
  site: string; startUrl: string; checkedAt: string;
  score: number; pagesCrawled: number; pagesFound: number; pageLimit: number;
  counts: Record<Exclude<Status, "locked">, number>;
  groups: typeof GROUPS;
  findings: Finding[];
  pages: PageResult[];
  priorities: string[];
  discovery: "sitemap" | "links";
  truncated: boolean;
  locked: boolean;
  seconds: number;
};

const BUDGET_MS = 42_000;   // leave headroom inside the function timeout
const CONCURRENCY = 5;
const quiet = (p: Promise<Fetched>) => p.catch(() => null);
const probe = (url: string): Promise<LinkProbe> =>
  safeFetch(url, { timeout: 6000, maxBytes: 20_000 }).then((f) => ({ url, status: f.status })).catch(() => ({ url, status: null }));

/** Pulls page addresses out of a sitemap, following one level of sitemap index. */
async function fromSitemap(xml: string, origin: string, want: number): Promise<string[]> {
  const locs = (xml.match(/<loc>([\s\S]*?)<\/loc>/g) ?? []).map((m) => m.replace(/<\/?loc>/g, "").trim());
  if (!/<sitemapindex/i.test(xml)) return locs;
  const out: string[] = [];
  for (const child of locs.slice(0, 5)) {
    if (out.length >= want) break;
    const f = await quiet(safeFetch(child, { timeout: 8000, maxBytes: 2_000_000 }));
    if (f?.status === 200) out.push(...(f.body.match(/<loc>([\s\S]*?)<\/loc>/g) ?? []).map((m) => m.replace(/<\/?loc>/g, "").trim()));
  }
  return out.length ? out : locs.filter((l) => !/\.xml($|\?)/i.test(l));
}

const sameHost = (a: string, b: string) => a.replace(/^www\./, "") === b.replace(/^www\./, "");

/** Follows the site's own links when there is no usable sitemap. */
async function fromLinks(start: Fetched, want: number, deadline: number): Promise<string[]> {
  const origin = new URL(start.url);
  const seen = new Set([start.url]);
  const queue: string[] = [];
  const collect = (f: Fetched) => {
    for (const m of f.body.matchAll(/<a\b[^>]*href=["']([^"'#]+)["']/gi)) {
      try {
        const u = new URL(m[1], f.url); u.hash = ""; u.search = "";
        if (!sameHost(u.hostname, origin.hostname) || !/^https?:$/.test(u.protocol)) continue;
        if (/\.(pdf|zip|jpe?g|png|gif|webp|svg|mp4|mp3|css|js|xml|json)$/i.test(u.pathname)) continue;
        if (seen.has(u.href)) continue;
        seen.add(u.href); queue.push(u.href);
      } catch { /* skip */ }
    }
  };
  collect(start);
  // One more level, so a site whose homepage only links to sections still opens up.
  for (const next of queue.slice(0, 8)) {
    if (queue.length >= want || Date.now() > deadline) break;
    const f = await quiet(safeFetch(next, { timeout: 8000, maxBytes: 1_500_000 }));
    if (f?.status === 200) collect(f);
  }
  return queue;
}

/** Keeps the pages a reader would care about: shallow, varied, one per section. */
function pick(urls: string[], startUrl: string, limit: number): string[] {
  const start = new URL(startUrl);
  const clean = new Map<string, string>();
  for (const raw of urls) {
    try {
      const u = new URL(raw); u.hash = ""; u.search = "";
      if (!sameHost(u.hostname, start.hostname) || !/^https?:$/.test(u.protocol)) continue;
      if (/\.(xml|pdf|zip|jpe?g|png|gif|webp|svg|mp4|mp3)$/i.test(u.pathname)) continue;
      clean.set(u.href.replace(/\/$/, "") || u.href, u.href);
    } catch { /* skip */ }
  }
  const all = [...clean.values()].filter((u) => u !== startUrl);
  const depth = (u: string) => new URL(u).pathname.split("/").filter(Boolean).length;
  const section = (u: string) => new URL(u).pathname.split("/").filter(Boolean)[0] ?? "";

  // One page from each section first, so a 500-page shop is not audited as 25 products.
  const bySection = new Map<string, string[]>();
  for (const u of all.sort((a, b) => depth(a) - depth(b) || a.length - b.length)) {
    const k = section(u); bySection.set(k, [...(bySection.get(k) ?? []), u]);
  }
  const out: string[] = [startUrl];
  let round = 0;
  while (out.length < limit && round < 50) {
    let added = false;
    for (const list of bySection.values()) {
      if (out.length >= limit) break;
      const u = list[round]; if (!u) continue;
      out.push(u); added = true;
    }
    if (!added) break;
    round++;
  }
  return out.slice(0, limit);
}

async function inBatches<T, R>(items: T[], size: number, deadline: number, fn: (t: T) => Promise<R>): Promise<R[]> {
  const out: R[] = [];
  for (let i = 0; i < items.length; i += size) {
    if (Date.now() > deadline) break;
    out.push(...(await Promise.all(items.slice(i, i + size).map(fn))));
  }
  return out;
}

export async function auditSite(startUrl: string, pageLimit: number): Promise<SiteAudit> {
  const began = Date.now();
  const deadline = began + BUDGET_MS;
  const home = await safeFetch(startUrl);
  if (!/html/i.test(home.headers.get("content-type") ?? "html")) throw new Error("That address is not a web page.");

  const plan = planExtras(home);
  const origin = plan.origin;
  const small = { timeout: 7000, maxBytes: 400_000 };

  // Everything that is true of the site rather than one page, fetched once.
  const robots = await quiet(safeFetch(`${origin}/robots.txt`, small));
  const smUrl = robots?.status === 200 ? robots.body.match(/^sitemap:\s*(\S+)/im)?.[1] : undefined;
  const [sitemap, llms, http, alt, notFound, ogImage, ...links] = await Promise.all([
    quiet(safeFetch(smUrl ?? `${origin}/sitemap.xml`, { timeout: 8000, maxBytes: 3_000_000 })),
    quiet(safeFetch(`${origin}/llms.txt`, { timeout: 5000, maxBytes: 100_000 })),
    plan.http ? quiet(safeFetch(plan.http, { timeout: 6000, maxBytes: 20_000 })) : Promise.resolve(null),
    plan.alt ? quiet(safeFetch(plan.alt, { timeout: 6000, maxBytes: 20_000 })) : Promise.resolve(null),
    quiet(safeFetch(plan.notFound, { timeout: 6000, maxBytes: 20_000 })),
    plan.ogImage ? quiet(safeFetch(plan.ogImage, { timeout: 6000, maxBytes: 60_000 })) : Promise.resolve(null),
    ...plan.links.map(probe),
  ]);
  const siteExtras = { robots, sitemap, llms, http, alt, notFound, ogImage, links };

  const smOk = !!sitemap && sitemap.status === 200 && /<(urlset|sitemapindex)/i.test(sitemap.body);
  let found = smOk ? await fromSitemap(sitemap!.body, origin, pageLimit * 3) : [];
  let discovery: "sitemap" | "links" = "sitemap";
  if (found.length < 2) { found = await fromLinks(home, pageLimit * 3, deadline); discovery = "links"; }

  const targets = pick(found, home.url, pageLimit);
  const rest = targets.slice(1);

  const homeReport = runChecks(home, siteExtras);
  const others = await inBatches(rest, CONCURRENCY, deadline, async (url) => {
    const f = await quiet(safeFetch(url, { timeout: 9000 }));
    if (!f || !/html/i.test(f.headers.get("content-type") ?? "")) return null;
    // Site-level facts are carried over; only the page itself is re-read.
    return { url, report: runChecks(f, siteExtras) };
  });

  const reports: { url: string; report: Report }[] = [{ url: home.url, report: homeReport },
    ...others.filter(Boolean).map((o) => o as { url: string; report: Report })];

  const pages: PageResult[] = reports.map(({ url, report }) => ({
    url, path: new URL(url).pathname,
    title: report.checks.find((c) => c.id === "title")?.found?.replace(/^"/, "").split('" (')[0] ?? "",
    score: report.score, fail: report.counts.fail, warn: report.counts.warn, checks: report.checks,
  }));

  // Roll up: one finding per check, with the pages it affects.
  const findings: Finding[] = [];
  for (const template of homeReport.checks) {
    const across = reports.map(({ url, report }) => ({ url, c: report.checks.find((x) => x.id === template.id)! })).filter((x) => x.c);
    const bad = across.filter((x) => x.c.status === "fail" || x.c.status === "warn");
    const worst = bad.find((x) => x.c.status === "fail")?.c ?? bad[0]?.c ?? template;
    findings.push({
      ...worst,
      status: bad.length ? worst.status : across.every((x) => x.c.status === "info") ? "info" : "pass",
      pages: bad.map((x) => new URL(x.url).pathname),
      passing: across.length - bad.length,
      total: across.length,
    });
  }

  const counts = { pass: 0, warn: 0, fail: 0, info: 0 };
  findings.forEach((f) => counts[f.status as keyof typeof counts]++);
  const score = pages.length ? Math.round(pages.reduce((n, p) => n + p.score, 0) / pages.length) : 0;

  // Worst first, then by how much of the site it touches.
  const priorities = findings
    .filter((f) => f.status === "fail" || f.status === "warn")
    .sort((a, b) => (a.status === b.status ? 0 : a.status === "fail" ? -1 : 1) || b.weight - a.weight || b.pages.length - a.pages.length)
    .slice(0, 5).map((f) => f.id);

  return {
    site: new URL(home.url).hostname.replace(/^www\./, ""), startUrl: home.url, checkedAt: new Date().toISOString(),
    score, pagesCrawled: pages.length, pagesFound: Math.max(found.length, pages.length), pageLimit,
    counts, groups: GROUPS, findings, pages, priorities, discovery,
    truncated: found.length > pageLimit, locked: false, seconds: Math.round((Date.now() - began) / 100) / 10,
  };
}

/** Free view: full detail on the five free checks, names only for the rest. */
export function redactAudit(a: SiteAudit): SiteAudit {
  return {
    ...a, locked: true,
    pages: a.pages.map((p) => ({ ...p, checks: [] })),
    findings: a.findings.map((f) => f.free ? f : { id: f.id, group: f.group, label: f.label, weight: f.weight, status: "locked", pages: [], passing: 0, total: f.total }),
  };
}
