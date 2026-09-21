import { parse } from "node-html-parser";
import type { Fetched } from "./safeFetch";

export type Status = "pass" | "warn" | "fail" | "info";
export type Check = { id: string; group: string; label: string; status: Status; found: string; fix?: string; learn?: string };
export type Report = { url: string; checkedAt: string; score: number; counts: Record<Status, number>; checks: Check[]; groups: string[] };

const GROUPS = ["Can Google find and read it?", "Does the page say what it is about?", "Is it ready for AI answers?", "Will it look right when shared?", "Speed and safety basics"];
const AI_BOTS = ["GPTBot", "OAI-SearchBot", "ClaudeBot", "PerplexityBot", "Google-Extended"];
const clip = (s: string, n = 90) => (s.length > n ? s.slice(0, n - 1) + "…" : s);

// Which user-agents does robots.txt block from the whole site?
function blockedAgents(robots: string) {
  const blocked = new Set<string>(); let agents: string[] = []; let inRules = false;
  for (const raw of robots.split(/\r?\n/)) {
    const line = raw.replace(/#.*/, "").trim(); const m = line.match(/^([a-z-]+)\s*:\s*(.*)$/i); if (!m) continue;
    const k = m[1].toLowerCase(), v = m[2].trim();
    if (k === "user-agent") { if (inRules) { agents = []; inRules = false; } agents.push(v.toLowerCase()); }
    else if (k === "disallow" || k === "allow") { inRules = true; if (k === "disallow" && v === "/") agents.forEach((a) => blocked.add(a)); }
  }
  return blocked;
}

export function runChecks(page: Fetched, extra: { robots?: Fetched | null; sitemap?: Fetched | null; llms?: Fetched | null }): Report {
  const root = parse(page.body, { comment: false, blockTextElements: { script: true, style: true, noscript: false, pre: true } });
  const u = new URL(page.url); const H = page.headers; const out: Check[] = [];
  const add = (group: number, id: string, label: string, status: Status, found: string, fix?: string, learn?: string) => out.push({ id, group: GROUPS[group], label, status, found, fix: status === "pass" ? undefined : fix, learn });
  const meta = (sel: string) => root.querySelector(sel)?.getAttribute("content")?.trim() ?? "";

  // ---------- 1. Find and read
  add(0, "https", "Your site uses a secure connection (https)", u.protocol === "https:" ? "pass" : "fail", u.protocol === "https:" ? "The page loads over https." : "The page loads over plain http.", "Ask your hosting company to turn on a free SSL certificate and redirect http to https.", "/services/technical-seo");
  add(0, "status", "The page loads without errors", page.status === 200 ? "pass" : "fail", `The server answered with status ${page.status}.`, "A working page should answer with status 200. Check the address, or ask your developer why the server returns an error.");
  const robotsMeta = (meta('meta[name="robots"]') + " " + meta('meta[name="googlebot"]') + " " + (H.get("x-robots-tag") ?? "")).toLowerCase();
  add(0, "index", "Google is allowed to list this page", robotsMeta.includes("noindex") ? "fail" : "pass", robotsMeta.includes("noindex") ? "The page carries a \"noindex\" instruction, which tells Google to leave it out of results." : "No \"noindex\" instruction found.", "Remove the noindex setting. In WordPress, check Settings, Reading, and your SEO plugin's setting for this page.");
  const robots = extra.robots && extra.robots.status === 200 && !/<html/i.test(extra.robots.body) ? extra.robots.body : "";
  const blocked = robots ? blockedAgents(robots) : new Set<string>();
  add(0, "robots", "Your robots.txt file does not block search engines", !robots ? "warn" : blocked.has("*") || blocked.has("googlebot") ? "fail" : "pass", !robots ? "No robots.txt file was found." : blocked.has("*") || blocked.has("googlebot") ? "robots.txt blocks search engines from the whole site." : "robots.txt exists and lets search engines in.", !robots ? "Add a simple robots.txt file that allows all crawlers and points to your sitemap." : "Remove the line \"Disallow: /\" for all crawlers. It is hiding your whole site from Google.");
  const smFromRobots = robots.match(/^sitemap:\s*(\S+)/im)?.[1];
  const smOk = !!extra.sitemap && extra.sitemap.status === 200 && /<(urlset|sitemapindex)/i.test(extra.sitemap.body);
  add(0, "sitemap", "You have a sitemap that lists your pages", smOk ? "pass" : "warn", smOk ? `Sitemap found${smFromRobots ? " and listed in robots.txt" : ""}.` : "No sitemap found at /sitemap.xml or in robots.txt.", "Create an XML sitemap and submit it in Google Search Console. Most website platforms and SEO plugins make one for you.");
  const canon = root.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? "";
  let canonStatus: Status = "warn", canonFound = "No canonical tag found.";
  if (canon) { try { const c = new URL(canon, u); const same = c.hostname.replace(/^www\./, "") === u.hostname.replace(/^www\./, "") && c.pathname.replace(/\/$/, "") === u.pathname.replace(/\/$/, ""); canonStatus = same ? "pass" : "warn"; canonFound = same ? "The page names itself as the main version." : `The page points to a different main version: ${clip(c.href, 70)}`; } catch { canonFound = "The canonical tag is not a valid address."; } }
  add(0, "canonical", "The page tells Google its one official address", canonStatus, canonFound, "Add a canonical tag pointing to this page's own address. It stops copies of a page from competing with each other.");
  const viewport = meta('meta[name="viewport"]');
  add(0, "mobile", "The page is set up for phones", viewport.includes("width=device-width") ? "pass" : "fail", viewport ? `Viewport setting: ${clip(viewport, 60)}` : "No mobile viewport setting found.", "Add a viewport tag so the page fits phone screens. Google ranks the phone version of your site.");
  const lang = root.querySelector("html")?.getAttribute("lang") ?? "";
  add(0, "lang", "The page states its language", lang ? "pass" : "warn", lang ? `Language is set to "${lang}".` : "No language is set on the page.", "Add a lang attribute to the html tag, for example lang=\"en-US\".");

  // ---------- 2. On-page
  const title = root.querySelector("title")?.text.trim() ?? "";
  add(1, "title", "The page has a clear Google headline (title tag)", !title ? "fail" : title.length < 25 || title.length > 60 ? "warn" : "pass", title ? `"${clip(title, 80)}" (${title.length} characters)` : "No title tag found.", !title ? "Add a title that says what the page offers, with your main search phrase near the front." : title.length > 60 ? "Shorten it to about 60 characters so Google does not cut it off." : "Make it more descriptive. Aim for 25 to 60 characters.", "/tools/serp-preview");
  const desc = meta('meta[name="description"]');
  add(1, "desc", "The page has a summary for Google (meta description)", !desc ? "fail" : desc.length < 70 || desc.length > 160 ? "warn" : "pass", desc ? `"${clip(desc, 100)}" (${desc.length} characters)` : "No meta description found.", !desc ? "Write a 1 to 2 sentence summary that previews the answer and gives a reason to click." : "Aim for 70 to 160 characters.", "/tools/serp-preview");
  const h1s = root.querySelectorAll("h1").map((h) => h.text.trim()).filter(Boolean);
  add(1, "h1", "The page has one main heading", h1s.length === 1 ? "pass" : h1s.length === 0 ? "fail" : "warn", h1s.length === 1 ? `"${clip(h1s[0], 80)}"` : h1s.length === 0 ? "No main heading (H1) found." : `${h1s.length} main headings found. There should be one.`, "Use exactly one H1 that says what the page is about. Use H2 and H3 for sections.");
  const h2s = root.querySelectorAll("h2").map((h) => h.text.trim()).filter(Boolean);
  add(1, "h2", "The page is split into sections with subheadings", h2s.length >= 2 ? "pass" : "warn", `${h2s.length} section heading${h2s.length === 1 ? "" : "s"} (H2) found.`, "Break the page into sections with clear H2 subheadings. It helps readers, Google, and AI tools.");
  root.querySelectorAll("script,style,noscript,svg,template").forEach((n) => n.remove());
  const text = (root.querySelector("body")?.text ?? "").replace(/\s+/g, " ").trim(); const words = text ? text.split(" ").length : 0;
  add(1, "words", "The page has enough helpful content", words >= 300 ? "pass" : words >= 120 ? "warn" : "fail", `About ${words.toLocaleString("en-US")} words of readable text.`, "Thin pages rarely rank. Add what a customer needs: what you offer, who it is for, prices or how pricing works, and answers to common questions.", "/services/ai-content-writing");
  const imgs = root.querySelectorAll("img"); const noAlt = imgs.filter((i) => i.getAttribute("alt") === undefined).length;
  add(1, "alt", "Images have text descriptions (alt text)", imgs.length === 0 ? "info" : noAlt === 0 ? "pass" : noAlt / imgs.length > 0.3 ? "fail" : "warn", imgs.length === 0 ? "No images found on the page." : `${imgs.length - noAlt} of ${imgs.length} images have alt text.`, "Add a short description to each meaningful image. It helps blind visitors and tells Google what the image shows.");
  const internal = new Set(root.querySelectorAll("a[href]").map((a) => { try { const l = new URL(a.getAttribute("href")!, u); return l.hostname === u.hostname ? l.pathname : ""; } catch { return ""; } }).filter((p) => p && p !== u.pathname));
  add(1, "links", "The page links to your other pages", internal.size >= 5 ? "pass" : internal.size >= 1 ? "warn" : "fail", `Links to ${internal.size} other page${internal.size === 1 ? "" : "s"} on your site.`, "Link to related pages using descriptive words, not \"click here\". Links help Google discover and understand your site.");

  // ---------- 3. AI readiness
  const aiBlocked = AI_BOTS.filter((b) => blocked.has(b.toLowerCase()) || blocked.has("*"));
  add(2, "aibots", "AI tools like ChatGPT are allowed to read your site", aiBlocked.length === 0 ? "pass" : "fail", aiBlocked.length === 0 ? "No AI crawlers are blocked in robots.txt." : `Blocked in robots.txt: ${aiBlocked.join(", ")}.`, "If you want AI tools to mention you, remove the rules that block their crawlers. Blocked crawlers cannot quote you.", "/guides/generative-engine-optimization");
  const scripts = (page.body.match(/<script\b/gi) ?? []).length;
  const emptyApp = /<div[^>]+id=["'](root|app|__next|__nuxt)["'][^>]*>\s*<\/div>/i.test(page.body);
  const jsOnly = words < 150 && (emptyApp || scripts >= 4);
  add(2, "nojs", "Your content is visible without JavaScript", words >= 150 ? "pass" : jsOnly ? "fail" : "info", words >= 150 ? "The main text is in the page itself, so every crawler can read it." : jsOnly ? "Very little text is in the page's HTML, and the page relies on scripts. The content is probably added by JavaScript, which many AI crawlers do not run." : "There is very little text on this page, so there was not much to test.", "Ask your developer to render the main content on the server, so it is in the HTML that crawlers download.", "/services/technical-seo");
  const allHeads = [...h2s, ...root.querySelectorAll("h3").map((h) => h.text.trim())];
  const qHeads = allHeads.filter((h) => /\?$/.test(h) || /^(how|what|why|when|where|which|who|can|do|does|is|are|should)\b/i.test(h));
  add(2, "questions", "Headings are written as questions people ask", qHeads.length >= 2 ? "pass" : qHeads.length === 1 ? "warn" : "warn", qHeads.length ? `${qHeads.length} question-style heading${qHeads.length === 1 ? "" : "s"}, for example "${clip(qHeads[0], 60)}"` : "No question-style headings found.", "Rewrite some headings as real customer questions, then answer in the first sentence below. AI tools quote sections written this way.", "/guides/generative-engine-optimization");
  const ld: Record<string, unknown>[] = []; let ldBroken = 0;
  for (const s of parse(page.body).querySelectorAll('script[type="application/ld+json"]')) { try { const j = JSON.parse(s.text); (Array.isArray(j) ? j : j["@graph"] ?? [j]).forEach((x: Record<string, unknown>) => ld.push(x)); } catch { ldBroken++; } }
  const types = [...new Set(ld.flatMap((x) => (Array.isArray(x["@type"]) ? x["@type"] : [x["@type"]]) as string[]).filter(Boolean))];
  add(2, "schema", "The page labels its key facts in code (schema)", ldBroken ? "warn" : types.length ? "pass" : "warn", ldBroken ? `${ldBroken} schema block${ldBroken === 1 ? " is" : "s are"} broken and cannot be read.` : types.length ? `Schema found: ${clip(types.join(", "), 90)}.` : "No schema found.", ldBroken ? "Fix the broken schema. Test it with Google's Rich Results Test." : "Add schema so Google and AI tools can read your business name, services, and FAQs without guessing.", "/services/technical-seo");
  const orgTypes = /Organization|LocalBusiness|Corporation|Store|Restaurant|Dentist|Physician|LegalService|ProfessionalService|HomeAndConstructionBusiness|Person/;
  add(2, "org", "The site says who is behind it, in code", types.some((t) => orgTypes.test(t)) ? "pass" : "warn", types.some((t) => orgTypes.test(t)) ? "Business or organization details found in schema." : "No business or organization schema found on this page.", "Add Organization or LocalBusiness schema with your name, address, phone, and links to your profiles. It helps Google and AI tools recognize your brand.");
  const dated = ld.some((x) => x.dateModified || x.datePublished) || !!root.querySelector("time[datetime]");
  add(2, "date", "The page shows when it was last updated", dated ? "pass" : "info", dated ? "A date was found on the page or in its schema." : "No published or updated date found. This matters for articles, less for service pages.", "For articles and guides, show a last updated date. Fresh, dated content is preferred by AI tools.");
  const llmsOk = !!extra.llms && extra.llms.status === 200 && !/<html/i.test(extra.llms.body) && extra.llms.body.trim().length > 20;
  add(2, "llms", "Optional: an llms.txt file for AI systems", llmsOk ? "pass" : "info", llmsOk ? "llms.txt found." : "No llms.txt file. This is optional. Google says it is not needed for its AI answers.", "If you want one, it takes a minute to make.", "/tools/llms-txt-generator");

  // ---------- 4. Sharing
  const og = { t: meta('meta[property="og:title"]'), d: meta('meta[property="og:description"]'), i: meta('meta[property="og:image"]') };
  const ogMissing = [!og.t && "title", !og.d && "description", !og.i && "image"].filter(Boolean);
  add(3, "og", "Links to this page look good on social media", ogMissing.length === 0 ? "pass" : ogMissing.length === 3 ? "fail" : "warn", ogMissing.length === 0 ? "Share title, description, and image are all set." : `Missing share ${ogMissing.join(", ")}.`, "Add Open Graph tags (og:title, og:description, og:image). Without them, shared links show up bare on Facebook, LinkedIn, and messaging apps.");
  add(3, "twitter", "Links look good on X", meta('meta[name="twitter:card"]') ? "pass" : "warn", meta('meta[name="twitter:card"]') ? `Card type: ${meta('meta[name="twitter:card"]')}.` : "No X (Twitter) card tag found.", "Add a twitter:card tag set to summary_large_image.");
  add(3, "favicon", "The site has a browser tab icon", root.querySelector('link[rel~="icon"]') ? "pass" : "info", root.querySelector('link[rel~="icon"]') ? "Icon found." : "No icon link found in the page. It may still exist at /favicon.ico.", "Add a favicon. Google shows it next to your result on phones.");

  // ---------- 5. Speed and safety
  add(4, "ttfb", "The server responds quickly", page.ms < 1200 ? "pass" : page.ms < 3000 ? "warn" : "fail", `The server started answering in ${(page.ms / 1000).toFixed(1)} seconds, measured from our server. This is a rough guide, not a full speed test.`, "Slow first response usually means slow hosting or no caching. Ask your host about caching or a content delivery network.", "/services/technical-seo");
  const kb = Math.round(page.bytes / 1024);
  add(4, "size", "The page code is not bloated", kb < 250 ? "pass" : kb < 600 ? "warn" : "fail", `The page's HTML is ${kb.toLocaleString("en-US")} KB.`, "Very large HTML often comes from page builders or inlined images. Ask your developer to trim it.");
  add(4, "gzip", "The server compresses pages before sending them", H.get("content-encoding") ? "pass" : "warn", H.get("content-encoding") ? `Compression is on (${H.get("content-encoding")}).` : "No compression was detected.", "Turn on gzip or Brotli compression on your server. It is usually one setting.");
  const mixed = u.protocol === "https:" ? (page.body.match(/(?:src|href)=["']http:\/\/[^"']+\.(?:js|css|png|jpe?g|gif|webp|svg)/gi) ?? []).length : 0;
  add(4, "mixed", "Nothing on the page loads over an insecure connection", mixed === 0 ? "pass" : "warn", mixed === 0 ? "No insecure files found." : `${mixed} file${mixed === 1 ? "" : "s"} load over plain http.`, "Change those addresses to https. Browsers may block them or show a warning.");
  add(4, "redirects", "Visitors reach the page without extra hops", page.hops.length <= 1 ? "pass" : "warn", page.hops.length === 0 ? "No redirects." : `${page.hops.length} redirect${page.hops.length === 1 ? "" : "s"} before the page loaded.`, "Point links and redirects straight at the final address. Each hop slows the page down.");

  const counts = { pass: 0, warn: 0, fail: 0, info: 0 } as Record<Status, number>; out.forEach((c) => counts[c.status]++);
  const graded = counts.pass + counts.warn + counts.fail;
  const score = graded ? Math.round(((counts.pass + counts.warn * 0.5) / graded) * 100) : 0;
  return { url: page.url, checkedAt: new Date().toISOString(), score, counts, checks: out, groups: GROUPS };
}
