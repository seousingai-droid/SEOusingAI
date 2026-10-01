// Site audit: crawls every URL in the sitemap plus every internal link it finds, and
// reports pages that would hurt rankings or look broken. Run against a local build:
//   npm run build && npm start   (in one terminal)
//   node scripts/audit.mjs http://localhost:3000
// Or against the live site: node scripts/audit.mjs https://seousingai.com
import { parse } from "node-html-parser";

const BASE = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");
const LIVE = "https://seousingai.com";

const sitemap = await (await fetch(`${BASE}/sitemap.xml`)).text();
const queue = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1].replace(LIVE, ""));
const seen = new Set();
const issues = [];
const titles = new Map();
const flag = (path, msg) => issues.push(`${path}: ${msg}`);

while (queue.length) {
  const path = queue.shift() || "/";
  if (seen.has(path)) continue;
  seen.add(path);
  const res = await fetch(BASE + path, { redirect: "manual" });
  if (res.status !== 200) { flag(path, `HTTP ${res.status}`); continue; }
  if (!(res.headers.get("content-type") || "").includes("text/html")) continue;
  const root = parse(await res.text());

  const title = root.querySelector("title")?.text.trim() || "";
  const desc = root.querySelector('meta[name="description"]')?.getAttribute("content") || "";
  const h1s = root.querySelectorAll("h1");
  const canonical = root.querySelector('link[rel="canonical"]')?.getAttribute("href") || "";
  const robots = root.querySelector('meta[name="robots"]')?.getAttribute("content") || "";

  if (title.length < 25 || title.length > 65) flag(path, `title ${title.length} chars: "${title}"`);
  if (desc.length < 70 || desc.length > 160) flag(path, `description ${desc.length} chars`);
  if (h1s.length !== 1) flag(path, `${h1s.length} H1 tags`);
  if (!canonical) flag(path, "no canonical");
  else if (canonical.replace(LIVE, "").replace(/\/$/, "") !== path.replace(/\/$/, "")) flag(path, `canonical points elsewhere: ${canonical}`);
  if (titles.has(title)) flag(path, `same title as ${titles.get(title)}`);
  titles.set(title, path);

  for (const s of root.querySelectorAll('script[type="application/ld+json"]')) {
    try { JSON.parse(s.text); } catch { flag(path, "invalid JSON-LD"); }
  }
  for (const img of root.querySelectorAll("img")) {
    if (img.getAttribute("alt") === undefined) flag(path, `image without alt: ${img.getAttribute("src")}`);
  }

  // Visible text problems: leftovers from code and doubled punctuation.
  const body = root.querySelector("main") || root.querySelector("body");
  const text = body ? body.structuredText : "";
  for (const [re, label] of [[/\bundefined\b/, '"undefined"'], [/\bNaN\b/, '"NaN"'], [/\[object Object\]/, "[object Object]"], [/[a-z]\.\.(?!\.)/i, 'double period ".."'], [/\bTODO\b|lorem ipsum/i, "placeholder text"], [/\b([a-z]{2,}) \1\b/i, "repeated word"]]) {
    const m = text.match(re);
    if (m) flag(path, `${label} near "${text.slice(Math.max(0, m.index - 40), m.index + 10).replace(/\s+/g, " ")}"`);
  }

  if (robots.includes("noindex")) continue; // still crawl-checked above, but its links are not followed
  for (const a of root.querySelectorAll("a[href]")) {
    let href = a.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) continue;
    if (href.startsWith(LIVE)) href = href.slice(LIVE.length) || "/";
    if (!href.startsWith("/")) continue;
    href = href.split("#")[0].split("?")[0];
    if (/\.(png|jpe?g|webp|svg|mp4|pdf|xml|txt|ico)$/.test(href)) {
      if (!seen.has(href)) { seen.add(href); const r = await fetch(BASE + href, { method: "HEAD" }); if (r.status !== 200) flag(path, `broken file link ${href} (${r.status})`); }
      continue;
    }
    if (!seen.has(href)) queue.push(href);
  }
}

console.log(`Checked ${seen.size} URLs. ${issues.length ? `${issues.length} issue(s):` : "No issues."}`);
for (const i of issues) console.log(" - " + i);
process.exitCode = issues.length ? 1 : 0;
