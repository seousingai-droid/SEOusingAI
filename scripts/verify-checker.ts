/**
 * Proves the checker reports the truth.
 *
 * Each fixture is a page whose problems we already know. The suite asserts that
 * every listed check returns the expected verdict: no missed problems on the
 * broken page, and no invented ones on the clean page.
 *
 * Run with: npm run verify
 */
import { runChecks, type Status } from "../src/lib/checker";
import type { Fetched } from "../src/lib/safeFetch";

type Extras = Parameters<typeof runChecks>[1];
const page = (body: string, headers: Record<string, string> = {}): Fetched => ({
  url: "https://example.com/page", status: 200,
  headers: new Headers({ "content-type": "text/html; charset=utf-8", "content-encoding": "gzip", ...headers }),
  body, ms: 300, hops: [], bytes: Buffer.byteLength(body),
});
const text = (body: string, status = 200): Fetched => ({ url: "https://example.com/f", status, headers: new Headers({ "content-type": "text/plain" }), body, ms: 50, hops: [], bytes: body.length });

// ---------------------------------------------------------------- fixtures
const BROKEN = `<html>
<head><meta name="robots" content="noindex"></head>
<body>
<font size="3">Old tag</font>
<h2>Section</h2><h4>Skipped a level</h4>
<img src="/a.jpg"><img src="/b.jpg">
<p>plumber plumber plumber plumber plumber plumber plumber plumber plumber plumber plumber plumber</p>
<script src="/jquery-1.12.4.min.js"></script>
</body></html>`;

const GOOD = `<!doctype html><html lang="en-US">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Emergency Plumber in Columbus: Same-Day Repairs</title>
<meta name="description" content="Need an emergency plumber in Columbus? We answer day and night, quote before we start, and most repairs are finished the same day. Call for a free estimate.">
<link rel="canonical" href="https://example.com/page">
<link rel="icon" href="/favicon.ico">
<link rel="apple-touch-icon" href="/apple.png">
<meta property="og:title" content="Emergency Plumber in Columbus">
<meta property="og:description" content="Same-day emergency plumbing repairs in Columbus, quoted before we start.">
<meta property="og:image" content="https://example.com/share.png">
<meta property="og:url" content="https://example.com/page">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Acme Plumbing">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"LocalBusiness","name":"Acme Plumbing","telephone":"+1-614-555-0100","sameAs":["https://www.facebook.com/acme"]}</script>
<script type="application/ld+json">{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home"}]}</script>
</head>
<body>
<h1>Emergency plumber in Columbus</h1>
<p>Acme Plumbing answers emergency calls in Columbus day and night, and most repairs are finished on the same visit. We quote the price before any work starts, so there is never a surprise on the invoice.</p>
<h2>How much does an emergency call-out cost?</h2>
<p>An emergency call-out from Acme Plumbing costs between 120 and 180 dollars, which covers the visit and the first hour of work. Parts are quoted separately and always agreed with you first. According to the 2025 Ohio trade survey, 68 percent of homeowners say a clear price up front matters more than the lowest rate.</p>
<h2>What should you do before we arrive?</h2>
<p>Turn off the water at the main stopcock, move anything valuable away from the leak, and take a photo of the damage for your insurer. Acme Plumbing will talk you through these steps on the phone when you call.</p>
<h2>Which emergencies do we handle most often?</h2>
<p>The three most common emergency calls Acme Plumbing takes in Columbus are burst pipes in winter, blocked drains after heavy rain, and water heaters that fail without warning. Each of these is usually fixable on the first visit, because our vans carry the common parts.</p>
<h2>How quickly can we get to you?</h2>
<p>Acme Plumbing reaches most addresses inside the Columbus outerbelt within 60 to 90 minutes of your call. If we are further away than that, we say so on the phone rather than leaving you waiting, and we will tell you who else is closer.</p>
<h3>Do you charge extra at night?</h3>
<p>Acme Plumbing charges the same hourly rate at night as during the day. Only the call-out fee changes, and we tell you the figure on the phone before we set off.</p>
<ul><li>Burst pipes and leaks</li><li>Blocked drains</li><li>Water heater failures</li><li>Frozen pipes</li><li>Failed sump pumps</li><li>Leaking radiators</li><li>Blocked toilets</li><li>Broken stopcocks</li></ul>
<table><tr><th>Service</th><th>Typical time</th></tr><tr><td>Leak repair</td><td>1 hour</td></tr></table>
<img src="/_next/image?url=%2Fvan.png&w=800&q=75" alt="An Acme Plumbing van outside a house in Columbus" width="800" height="450" loading="lazy">
<p>Read more about our <a href="/services/leak-repair">leak repair service</a>, our <a href="/services/drains">blocked drain service</a>, our <a href="/about">team</a>, our <a href="/pricing">prices</a> and our <a href="/contact">contact details</a>. Figures come from the <a href="https://www.ohio.gov/survey">2025 Ohio trade survey</a>.</p>
<p><a href="tel:+16145550100">Call 614 555 0100</a> or <a href="/contact">book a visit</a> today.</p>
<time datetime="2026-09-01">Updated 1 September 2026</time>
<a href="/privacy">Privacy policy</a>
<p>&copy; 2026 Acme Plumbing</p>
</body></html>`;

const goodExtras: Extras = {
  robots: text("User-agent: *\nAllow: /\nSitemap: https://example.com/sitemap.xml"),
  sitemap: text("<?xml version='1.0'?><urlset><url><loc>https://example.com/page</loc><lastmod>2026-09-01</lastmod></url></urlset>"),
  http: { ...text(""), url: "https://example.com/page" },
  notFound: text("gone", 404),
  ogImage: { ...text("binary"), headers: new Headers({ "content-type": "image/png" }) },
  links: [{ url: "https://example.com/about", status: 200 }, { url: "https://example.com/pricing", status: 200 }],
};

// ------------------------------------------------------------ expectations
type Case = { name: string; report: ReturnType<typeof runChecks>; expect: Record<string, Status> };

const cases: Case[] = [
  {
    name: "A page with known problems",
    report: runChecks({ url: "http://example.com/page", status: 200, headers: new Headers({ "content-type": "text/html" }), body: BROKEN, ms: 300, hops: [], bytes: BROKEN.length }, {
      robots: text("User-agent: *\nDisallow: /"),
      notFound: text("still here", 200),
      http: { ...text(""), url: "http://example.com/page" },
    }),
    expect: {
      https: "fail", index: "fail", title: "fail", desc: "fail", h1: "fail", mobile: "fail",
      words: "fail", internal: "fail", og: "fail", robots: "fail", aibots: "fail", soft404: "fail",
      "http-redirect": "info", canonical: "warn", lang: "warn", charset: "warn", doctype: "warn",
      deprecated: "warn", "old-lib": "warn", "h-order": "warn", stuffing: "warn", alt: "fail",
      sitemap: "warn", twitter: "warn", schema: "warn", h2: "warn",
    },
  },
  {
    name: "A page built properly",
    report: runChecks(page(GOOD), goodExtras),
    expect: {
      https: "pass", status: "pass", index: "pass", robots: "pass", sitemap: "pass", "sitemap-page": "pass",
      canonical: "pass", mobile: "pass", lang: "pass", charset: "pass", doctype: "pass", soft404: "pass",
      title: "pass", "title-h1": "pass", desc: "pass", h1: "pass", h2: "pass", "h-order": "pass",
      alt: "pass", "img-size": "pass", internal: "pass", external: "pass", broken: "pass",
      words: "pass", sentences: "pass", structure: "pass", stuffing: "pass", cta: "pass", contact: "pass",
      aibots: "pass", nojs: "pass", questions: "pass", "answer-first": "pass", sources: "pass", stats: "pass",
      schema: "pass", "schema-valid": "pass", org: "pass", sameas: "pass", breadcrumb: "pass", date: "pass", entity: "pass",
      og: "pass", "og-image": "pass", "og-url": "pass", twitter: "pass", favicon: "pass", "apple-icon": "pass",
      gzip: "pass", mixed: "pass", redirects: "pass", deprecated: "pass", "old-lib": "pass", privacy: "pass",
      copyright: "pass", "http-redirect": "pass", "link-text": "pass", "desc-title": "pass", "img-format": "pass",
    },
  },
];

// ------------------------------------------------------------------- report
let passed = 0; const failures: string[] = [];
for (const c of cases) {
  const byId = new Map(c.report.checks.map((k) => [k.id, k]));
  console.log(`\n${c.name}  (score ${c.report.score}/100, ${c.report.total} checks run)`);
  for (const [id, want] of Object.entries(c.expect)) {
    const got = byId.get(id);
    if (!got) { failures.push(`${c.name}: check "${id}" does not exist`); console.log(`  MISSING  ${id}`); continue; }
    if (got.status === want) { passed++; continue; }
    failures.push(`${c.name}: ${id} expected ${want}, got ${got.status} — "${got.found}"`);
    console.log(`  WRONG    ${id}: expected ${want}, got ${got.status}  (${got.found})`);
  }
  // Nothing actionable may be missing its fix text.
  for (const k of c.report.checks) {
    if ((k.status === "fail" || k.status === "warn") && !k.fix) failures.push(`${c.name}: ${k.id} is a problem with no fix text`);
    if (k.status !== "pass" && !k.found) failures.push(`${c.name}: ${k.id} has no finding text`);
    if (!k.why) failures.push(`${c.name}: ${k.id} has no reason text`);
  }
}

const clean = cases[1].report;
if (clean.counts.fail > 0) failures.push(`The clean page reported ${clean.counts.fail} false problems`);
if (clean.score < 95) failures.push(`The clean page scored ${clean.score}, which is too harsh`);
const broken = cases[0].report;
if (broken.score > 40) failures.push(`The broken page scored ${broken.score}, which is too generous`);

console.log(`\n${"=".repeat(64)}`);
console.log(`${passed} assertions passed, ${failures.length} problems`);
if (failures.length) { console.log("\n" + failures.map((f) => "  - " + f).join("\n")); process.exit(1); }
console.log("The checker reports what it should on both fixtures.");
