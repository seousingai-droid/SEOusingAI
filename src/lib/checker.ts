import { parse, type HTMLElement } from "node-html-parser";
import type { Fetched } from "./safeFetch";

export type Status = "pass" | "warn" | "fail" | "info" | "locked";
export type Check = { id: string; group: string; label: string; weight: 1 | 2 | 3; free?: boolean; status: Status; found?: string; why?: string; fix?: string; learn?: string };
export type Group = { name: string; blurb: string };
export type Counts = { pass: number; warn: number; fail: number; info: number };
export type Report = { url: string; checkedAt: string; score: number; counts: Counts; total: number; groups: Group[]; checks: Check[]; priorities: string[]; locked: boolean };
export type LinkProbe = { url: string; status: number | null };
export type Extras = { robots?: Fetched | null; sitemap?: Fetched | null; llms?: Fetched | null; http?: Fetched | null; alt?: Fetched | null; notFound?: Fetched | null; ogImage?: Fetched | null; links?: LinkProbe[] };

export const GROUPS: Group[] = [
  { name: "Can Google find and read it?", blurb: "If search engines cannot reach and understand the page, nothing else matters." },
  { name: "Does the page say what it is about?", blurb: "Titles, headings, and links tell Google and visitors what this page is for." },
  { name: "Is the content helpful and easy to read?", blurb: "Google rewards pages that answer the question fully and are pleasant to read." },
  { name: "Is it ready for AI answers?", blurb: "ChatGPT, Perplexity, and Google's AI summaries quote pages that are clear, structured, and trusted." },
  { name: "Will it look right when shared?", blurb: "Links get shared on social media and in messages. A good preview earns the click." },
  { name: "Speed, safety, and trust", blurb: "Fast, secure, well-maintained pages rank better and convert better." },
];
const AI_BOTS = ["GPTBot", "OAI-SearchBot", "ClaudeBot", "PerplexityBot", "Google-Extended"];
const STOP = new Set("the a an and or but of to in on at for with by from as is are was were be been it its this that these those you your we our they their he she his her not no so if then than can will just more most very also into about over under out up down off all any some such only own same too".split(" "));
const clip = (s: string, n = 90) => (s.length > n ? s.slice(0, n - 1) + "…" : s);
const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? "" : "s"}`;
const contentWords = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s'-]/g, " ").split(/\s+/).filter((w) => w.length > 3 && !STOP.has(w));

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
const isText = (f?: Fetched | null) => !!f && f.status === 200 && !/<html/i.test(f.body.slice(0, 500));
const sameSite = (a: string, b: string) => a.replace(/^www\./, "") === b.replace(/^www\./, "");

/** Decides which extra addresses the API should probe after fetching the page. */
export function planExtras(page: Fetched) {
  const u = new URL(page.url); const root = parse(page.body);
  const og = root.querySelector('meta[property="og:image"]')?.getAttribute("content")?.trim();
  let ogImage: string | undefined; try { if (og) ogImage = new URL(og, u).href; } catch { /* invalid */ }
  const seen = new Set<string>(); const links: string[] = [];
  for (const a of root.querySelectorAll("a[href]")) {
    try { const l = new URL(a.getAttribute("href")!, u); l.hash = ""; if (l.hostname === u.hostname && l.pathname !== u.pathname && !seen.has(l.href) && /^https?:$/.test(l.protocol) && !/\.(pdf|zip|jpg|png|mp4)$/i.test(l.pathname)) { seen.add(l.href); links.push(l.href); } } catch { /* skip */ }
  }
  const altHost = u.hostname.startsWith("www.") ? u.hostname.slice(4) : "www." + u.hostname;
  return {
    origin: u.origin, ogImage, links: links.slice(0, 6),
    http: u.protocol === "https:" ? "http://" + u.host + u.pathname : undefined,
    alt: altHost.includes(".") ? `${u.protocol}//${altHost}${u.pathname}` : undefined,
    notFound: `${u.origin}/seousingai-check-${Math.random().toString(36).slice(2, 10)}`,
  };
}

export function runChecks(page: Fetched, x: Extras): Report {
  const full = parse(page.body, { comment: false });
  const root = parse(page.body, { comment: false });
  root.querySelectorAll("script,style,noscript,svg,template").forEach((n) => n.remove());
  const u = new URL(page.url); const H = page.headers; const out: Check[] = [];
  const meta = (sel: string) => full.querySelector(sel)?.getAttribute("content")?.trim() ?? "";
  const add = (g: number, id: string, label: string, weight: 1 | 2 | 3, status: Exclude<Status, "locked">, found: string, why: string, fix?: string, learn?: string, free?: boolean) =>
    out.push({ id, group: GROUPS[g].name, label, weight, free, status, found, why, fix: status === "pass" ? undefined : fix, learn });

  // Shared facts
  const text = (root.querySelector("body")?.text ?? "").replace(/\s+/g, " ").trim();
  const words = text ? text.split(" ").length : 0;
  const heads = full.querySelectorAll("h1,h2,h3,h4,h5,h6").map((h) => ({ level: Number(h.tagName[1]), text: h.text.replace(/\s+/g, " ").trim() }));
  const h1s = heads.filter((h) => h.level === 1 && h.text), h2s = heads.filter((h) => h.level === 2 && h.text);
  const title = full.querySelector("title")?.text.replace(/\s+/g, " ").trim() ?? "";
  const desc = meta('meta[name="description"]');
  const anchors = full.querySelectorAll("a[href]");
  const links = anchors.map((a) => { try { return { a, l: new URL(a.getAttribute("href")!, u) }; } catch { return null; } }).filter(Boolean) as { a: HTMLElement; l: URL }[];
  const internal = links.filter(({ l }) => l.hostname === u.hostname && l.pathname !== u.pathname);
  const external = links.filter(({ l }) => /^https?:$/.test(l.protocol) && !sameSite(l.hostname, u.hostname));
  const imgs = full.querySelectorAll("img");
  const robots = isText(x.robots) ? x.robots!.body : "";
  const blocked = robots ? blockedAgents(robots) : new Set<string>();
  const robotsMeta = (meta('meta[name="robots"]') + " " + meta('meta[name="googlebot"]') + " " + (H.get("x-robots-tag") ?? "")).toLowerCase();
  const ld: Record<string, unknown>[] = []; let ldBroken = 0;
  for (const s of full.querySelectorAll('script[type="application/ld+json"]')) { try { const j = JSON.parse(s.text); (Array.isArray(j) ? j : j["@graph"] ?? [j]).forEach((o: Record<string, unknown>) => ld.push(o)); } catch { ldBroken++; } }
  const typesOf = (o: Record<string, unknown>) => ([] as string[]).concat((o["@type"] as string | string[]) ?? []);
  const types = [...new Set(ld.flatMap(typesOf))];
  const orgLike = /Organization|LocalBusiness|Corporation|Store|Restaurant|Dentist|Physician|Attorney|LegalService|ProfessionalService|HomeAndConstructionBusiness|MedicalBusiness|FinancialService|RealEstateAgent|AutoRepair|Hotel/;
  const orgs = ld.filter((o) => typesOf(o).some((t) => orgLike.test(t)));
  const brand = meta('meta[property="og:site_name"]') || (orgs[0]?.name as string | undefined) || "";

  // ===== 1. Find and read
  const https = u.protocol === "https:";
  add(0, "https", "The site uses a secure connection (https)", 3, https ? "pass" : "fail", https ? "The page loads over https." : "The page loads over plain http.", "Google prefers secure pages, and browsers warn visitors away from insecure ones.", "Ask your hosting company for a free SSL certificate and redirect all http addresses to https.", "/services/technical-seo", true);
  add(0, "status", "The page loads without an error", 3, page.status === 200 ? "pass" : "fail", `The server answered with status ${page.status}.`, "Google drops pages that return errors, and visitors leave.", "A working page answers with status 200. Check the address, or ask your developer why the server returns an error.");
  add(0, "index", "Google is allowed to list this page", 3, robotsMeta.includes("noindex") ? "fail" : "pass", robotsMeta.includes("noindex") ? "The page carries a \"noindex\" instruction." : "No \"noindex\" instruction found.", "A noindex tag tells Google to leave the page out of results entirely.", "Remove the noindex setting. In WordPress, check Settings, Reading, and your SEO plugin's setting for this page.", undefined, true);
  add(0, "nofollow", "Google may follow the links on this page", 2, robotsMeta.includes("nofollow") ? "warn" : "pass", robotsMeta.includes("nofollow") ? "The page carries a \"nofollow\" instruction." : "No \"nofollow\" instruction found.", "A page-wide nofollow stops Google passing value to the pages you link to.", "Remove the nofollow directive unless the page is deliberately isolated.");
  const rb = !robots ? "warn" : blocked.has("*") || blocked.has("googlebot") ? "fail" : "pass";
  add(0, "robots", "Your robots.txt file does not block search engines", 3, rb, !robots ? "No robots.txt file was found." : rb === "fail" ? "robots.txt blocks search engines from the whole site." : "robots.txt exists and lets search engines in.", "robots.txt is the first file crawlers read. One wrong line can hide your whole site.", !robots ? "Add a simple robots.txt that allows all crawlers and points to your sitemap." : "Remove the line \"Disallow: /\" for all crawlers.");
  const smFromRobots = robots.match(/^sitemap:\s*(\S+)/im)?.[1];
  add(0, "robots-sitemap", "robots.txt points to your sitemap", 1, !robots ? "info" : smFromRobots ? "pass" : "warn", smFromRobots ? `Sitemap listed: ${clip(smFromRobots, 60)}` : robots ? "robots.txt does not mention a sitemap." : "No robots.txt to check.", "Listing the sitemap in robots.txt helps every crawler find it without being told.", "Add a line \"Sitemap: https://yoursite.com/sitemap.xml\" to robots.txt.");
  const smOk = !!x.sitemap && x.sitemap.status === 200 && /<(urlset|sitemapindex)/i.test(x.sitemap.body);
  const smUrls = smOk ? (x.sitemap!.body.match(/<loc>(.*?)<\/loc>/g) ?? []).map((m) => m.replace(/<\/?loc>/g, "").trim()) : [];
  const smIndex = smOk && /<sitemapindex/i.test(x.sitemap!.body);
  add(0, "sitemap", "You have a sitemap that lists your pages", 2, smOk ? "pass" : "warn", smOk ? `Sitemap found with ${smUrls.length} ${smIndex ? "child sitemaps" : "addresses"}.` : "No sitemap found at /sitemap.xml or in robots.txt.", "A sitemap helps Google find every page, including new ones, quickly.", "Create an XML sitemap and submit it in Google Search Console. Most platforms and SEO plugins make one for you.");
  const inSm = smOk && !smIndex ? smUrls.some((s) => s.replace(/\/$/, "").replace(/^https?:\/\/(www\.)?/, "") === page.url.replace(/\/$/, "").replace(/^https?:\/\/(www\.)?/, "")) : null;
  add(0, "sitemap-page", "This page is listed in the sitemap", 1, inSm === null ? "info" : inSm ? "pass" : "warn", inSm === null ? (smIndex ? "The sitemap is an index of other sitemaps, so this was not checked." : "No sitemap to check.") : inSm ? "The page appears in the sitemap." : "The page is not in the sitemap.", "Pages missing from the sitemap can still be found, but they get less attention.", "Make sure the sitemap includes every page you want ranked.");
  add(0, "sitemap-dates", "The sitemap shows when pages changed", 1, !smOk ? "info" : /<lastmod>/i.test(x.sitemap!.body) ? "pass" : "info", !smOk ? "No sitemap to check." : /<lastmod>/i.test(x.sitemap!.body) ? "Last-modified dates are present." : "No last-modified dates in the sitemap.", "Accurate dates help Google decide which pages to recrawl first.", "Add real lastmod dates to the sitemap. Fake or always-today dates are ignored.");
  const canon = full.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? ""; let cs: Exclude<Status, "locked"> = "warn", cf = "No canonical tag found.";
  if (canon) { try { const c = new URL(canon, u); const same = sameSite(c.hostname, u.hostname) && c.pathname.replace(/\/$/, "") === u.pathname.replace(/\/$/, ""); cs = same ? "pass" : "warn"; cf = same ? "The page names itself as the main version." : `The page points elsewhere as the main version: ${clip(c.href, 70)}`; } catch { cf = "The canonical tag is not a valid address."; } }
  add(0, "canonical", "The page tells Google its one official address", 2, cs, cf, "Without it, copies of a page (with and without www, or with tracking codes) compete against each other.", "Add a canonical tag pointing to this page's own address.");
  const httpOk = x.http ? new URL(x.http.url).protocol === "https:" : null;
  add(0, "http-redirect", "The insecure address redirects to the secure one", 2, !https ? "info" : httpOk === null ? "info" : httpOk ? "pass" : "fail", !https ? "The page itself is not on https." : httpOk === null ? "The http version could not be tested." : httpOk ? "http redirects to https." : "The http version loads as a separate page.", "If both versions load, Google sees two copies and visitors may land on the insecure one.", "Redirect every http address to its https twin with a permanent (301) redirect.");
  const altHost = x.alt ? new URL(x.alt.url).hostname : null;
  add(0, "www", "www and non-www versions lead to one site", 2, !x.alt ? "pass" : altHost === u.hostname ? "pass" : "warn", !x.alt ? "Only one version responds, which is fine." : altHost === u.hostname ? "The other version redirects here." : `The other version (${altHost}) serves its own copy of the page.`, "Two live versions split your rankings between them.", "Pick one version and permanently redirect the other to it.");
  const nf = x.notFound?.status;
  add(0, "soft404", "Missing pages return a real \"not found\" error", 2, nf === undefined || nf === null ? "info" : nf === 404 || nf === 410 ? "pass" : nf === 200 ? "fail" : "warn", nf == null ? "Could not test." : `A made-up address returned status ${nf}.`, "If missing pages return \"OK\", Google wastes effort on junk addresses and may index them.", "Configure the server to return status 404 for pages that do not exist.");
  const refresh = !!full.querySelector('meta[http-equiv="refresh" i]');
  add(0, "meta-refresh", "The page does not redirect with a timer", 2, refresh ? "warn" : "pass", refresh ? "A meta refresh tag was found." : "No meta refresh found.", "Timed redirects confuse crawlers and frustrate visitors.", "Use a server-side 301 redirect instead.");
  const vp = meta('meta[name="viewport"]');
  add(0, "mobile", "The page is set up for phones", 3, vp.includes("width=device-width") ? "pass" : "fail", vp ? `Viewport: ${clip(vp, 60)}` : "No mobile viewport setting found.", "Google ranks the phone version of your site, and most visitors are on one.", "Add a viewport tag so the page fits phone screens.", undefined, true);
  const lang = full.querySelector("html")?.getAttribute("lang") ?? "";
  add(0, "lang", "The page states its language", 1, lang ? "pass" : "warn", lang ? `Language: "${lang}".` : "No language set.", "It helps search engines show the page to people who read that language.", "Add lang=\"en-US\" (or your language) to the html tag.");
  const charset = !!full.querySelector("meta[charset]") || /charset=/i.test(H.get("content-type") ?? "") || !!full.querySelector('meta[http-equiv="Content-Type" i]');
  add(0, "charset", "The page declares its character encoding", 1, charset ? "pass" : "warn", charset ? "Encoding is declared." : "No encoding declared.", "Without it, special characters can display as garbage.", "Add <meta charset=\"utf-8\"> at the top of the head.");
  add(0, "doctype", "The page declares a modern document type", 1, /^\s*<!doctype html/i.test(page.body) ? "pass" : "warn", /^\s*<!doctype html/i.test(page.body) ? "HTML5 doctype found." : "No HTML5 doctype at the top.", "Old or missing doctypes push browsers into quirks mode, which breaks layouts.", "Start the document with <!doctype html>.");
  const path = u.pathname; const urlBad = [/[A-Z]/.test(path) && "capital letters", /_/.test(path) && "underscores", /\d{5,}/.test(path) && "long numbers", (path.length > 100) && "over 100 characters", /%[0-9A-F]{2}/i.test(path) && "encoded characters", !!u.search && "a query string"].filter(Boolean);
  add(0, "url", "The address is short and readable", 1, urlBad.length ? "warn" : "pass", urlBad.length ? `The address has ${urlBad.join(", ")}.` : `Clean address: ${clip(path, 60)}`, "Readable addresses get more clicks and are easier to share.", "Use short, lowercase words separated by hyphens.");
  const depth = path.split("/").filter(Boolean).length;
  add(0, "depth", "The page is not buried too deep", 1, depth <= 4 ? "pass" : "warn", `${plural(depth, "level")} deep in the site structure.`, "Pages many folders deep are treated as less important.", "Keep important pages within three or four levels of the homepage.");
  const iframes = full.querySelectorAll("iframe").length;
  add(0, "iframe", "Main content is not locked inside embedded frames", 1, iframes > 3 ? "warn" : "pass", iframes ? `${plural(iframes, "embedded frame")} found.` : "No embedded frames.", "Text inside a frame usually counts for the frame's source, not for your page.", "Keep your own content in the page. Use frames only for embeds like maps and videos.");

  // ===== 2. What it is about
  add(1, "title", "The page has a clear Google headline (title tag)", 3, !title ? "fail" : title.length < 25 || title.length > 60 ? "warn" : "pass", title ? `"${clip(title, 80)}" (${title.length} characters)` : "No title tag found.", "The title is the headline in Google results. It is the strongest on-page signal of what the page is about.", !title ? "Add a title that says what the page offers, with your main search phrase near the front." : title.length > 60 ? "Shorten it to about 60 characters so Google does not cut it off." : "Make it more descriptive. Aim for 25 to 60 characters.", "/tools/serp-preview", true);
  const tw = contentWords(title), h1w = contentWords(h1s[0]?.text ?? ""); const overlap = tw.filter((w) => h1w.includes(w)).length;
  add(1, "title-h1", "The title and the main heading agree", 2, !title || !h1s.length ? "info" : overlap >= 1 ? "pass" : "warn", !title || !h1s.length ? "Needs both a title and a main heading to compare." : overlap ? `They share ${plural(overlap, "key word")}.` : "They share no key words.", "When the headline in Google and the headline on the page match, visitors trust they landed in the right place.", "Use the same core phrase in both, worded naturally.");
  const brandFirst = brand && title.toLowerCase().startsWith(brand.toLowerCase()) && title.length > brand.length + 3;
  add(1, "title-front", "The title leads with the topic, not the brand", 1, brandFirst ? "warn" : "pass", brandFirst ? `The title starts with "${clip(brand, 30)}".` : "The topic comes first.", "Google gives more weight to the first words of a title, and truncates the end.", "Put the page's topic first and the brand name at the end: \"Topic | Brand\".", "/tools/serp-preview");
  add(1, "desc", "The page has a summary for Google (meta description)", 3, !desc ? "fail" : desc.length < 70 || desc.length > 160 ? "warn" : "pass", desc ? `"${clip(desc, 100)}" (${desc.length} characters)` : "No meta description found.", "The description is the preview text under your result. A good one earns the click.", !desc ? "Write a one or two sentence summary that previews the answer and gives a reason to click." : "Aim for 70 to 160 characters.", "/tools/serp-preview", true);
  const dw = contentWords(desc), bodyw = new Set(contentWords(text)); const dMatch = dw.filter((w) => bodyw.has(w)).length;
  add(1, "desc-match", "The summary matches what the page says", 1, !desc ? "info" : dMatch >= 3 || dw.length < 4 ? "pass" : "warn", !desc ? "No description to compare." : `${dMatch} of ${dw.length} key words in the description appear on the page.`, "Google rewrites descriptions that do not reflect the page.", "Describe what is actually on the page, using its own words.");
  add(1, "desc-title", "The summary is not a copy of the title", 1, desc && title && desc.toLowerCase() === title.toLowerCase() ? "warn" : "pass", desc && title && desc.toLowerCase() === title.toLowerCase() ? "The description repeats the title." : "The description adds to the title.", "A repeated title wastes the space where you could give a reason to click.", "Write a description that says something the title does not.");
  add(1, "h1", "The page has one main heading", 3, h1s.length === 1 ? "pass" : h1s.length === 0 ? "fail" : "warn", h1s.length === 1 ? `"${clip(h1s[0].text, 80)}"` : h1s.length === 0 ? "No main heading (H1) found." : `${h1s.length} main headings found.`, "The H1 is the on-page headline. One clear H1 tells Google and readers the single topic.", "Use exactly one H1 that says what the page is about.");
  add(1, "h2", "The page is split into sections with subheadings", 2, h2s.length >= 2 ? "pass" : "warn", `${plural(h2s.length, "section heading")} (H2).`, "Subheadings let readers scan and let Google and AI tools understand each part.", "Break the page into sections with clear H2 subheadings.");
  let skipped = 0, prev = 0; for (const h of heads) { if (prev && h.level > prev + 1) skipped++; prev = h.level; }
  add(1, "h-order", "Headings follow a logical order", 1, skipped ? "warn" : "pass", skipped ? `${plural(skipped, "heading")} skip a level (for example H2 straight to H4).` : "Heading levels step down in order.", "A logical outline helps assistive technology and shows the structure of your content.", "Use H2 for sections and H3 for points within them, without skipping levels.");
  const empty = heads.filter((h) => !h.text).length;
  add(1, "h-empty", "No headings are empty", 1, empty ? "warn" : "pass", empty ? `${plural(empty, "empty heading")} found.` : "All headings have text.", "Empty headings are usually leftover layout blocks and confuse the outline.", "Remove empty heading tags or give them real text.");
  const noAlt = imgs.filter((i) => i.getAttribute("alt") === undefined).length;
  add(1, "alt", "Images have text descriptions (alt text)", 2, imgs.length === 0 ? "info" : noAlt === 0 ? "pass" : noAlt / imgs.length > 0.3 ? "fail" : "warn", imgs.length === 0 ? "No images on the page." : `${imgs.length - noAlt} of ${imgs.length} images have alt text.`, "Alt text tells Google what an image shows and reads it aloud for blind visitors.", "Add a short description to each meaningful image. Decorative images can use an empty alt.");
  const noDim = imgs.filter((i) => !i.getAttribute("width") || !i.getAttribute("height")).length;
  add(1, "img-size", "Images declare their size", 1, imgs.length === 0 ? "info" : noDim === 0 ? "pass" : "warn", imgs.length === 0 ? "No images on the page." : `${noDim} of ${imgs.length} images have no width and height.`, "Without sizes, the page jumps around as images load, which Google measures as a bad experience.", "Add width and height attributes to every image.");
  const lazy = imgs.filter((i) => i.getAttribute("loading") === "lazy").length;
  add(1, "img-lazy", "Images below the fold load lazily", 1, imgs.length < 6 ? "info" : lazy ? "pass" : "warn", imgs.length < 6 ? "Few images, so this matters little." : `${lazy} of ${imgs.length} images are set to load lazily.`, "Lazy loading defers offscreen images so the visible part of the page appears faster.", "Add loading=\"lazy\" to images that are not visible at first.");
  const modern = imgs.filter((i) => /\.(webp|avif|svg)(\?|$)/i.test(i.getAttribute("src") ?? "")).length;
  add(1, "img-format", "Images use modern, lightweight formats", 1, imgs.length === 0 ? "info" : modern / imgs.length >= 0.5 ? "pass" : "warn", imgs.length === 0 ? "No images on the page." : `${modern} of ${imgs.length} images are WebP, AVIF, or SVG.`, "Modern formats are often half the size of JPEG or PNG at the same quality.", "Convert photos to WebP and logos to SVG. Most platforms can do this automatically.", "/services/technical-seo");
  const intSet = new Set(internal.map(({ l }) => l.pathname));
  add(1, "internal", "The page links to your other pages", 2, intSet.size >= 5 ? "pass" : intSet.size >= 1 ? "warn" : "fail", `Links to ${plural(intSet.size, "other page")} on your site.`, "Internal links help Google discover pages and understand which ones matter most.", "Link to related pages using descriptive words.");
  const generic = links.filter(({ a }) => /^(click here|here|read more|learn more|more|link|this)$/i.test(a.text.trim())).length;
  add(1, "anchors", "Links use descriptive words", 1, generic === 0 ? "pass" : generic > 3 ? "warn" : "pass", generic ? `${plural(generic, "link")} say only "click here", "read more", or similar.` : "No vague link text found.", "The words in a link tell Google what the destination page is about.", "Replace \"read more\" with the topic of the page you are linking to.");
  const dead = anchors.filter((a) => /^(#|javascript:)/i.test(a.getAttribute("href") ?? "")).length;
  add(1, "dead-links", "Links go somewhere", 1, dead > 3 ? "warn" : "pass", dead ? `${plural(dead, "link")} point nowhere (href=\"#\" or javascript:).` : "Every link has a destination.", "Links that go nowhere frustrate visitors and give crawlers nothing to follow.", "Give each link a real destination or make it a button.");
  const probes = x.links ?? []; const broken = probes.filter((p) => p.status === 404 || p.status === 410 || (p.status !== null && p.status >= 500)); const unsure = probes.filter((p) => p.status === null || p.status === 403 || p.status === 429);
  add(1, "broken", "Sampled links on this page work", 2, !probes.length ? "info" : broken.length ? "fail" : unsure.length === probes.length ? "info" : "pass", !probes.length ? "No internal links to test." : broken.length ? `${broken.length} of ${probes.length} tested links are broken: ${clip(broken.map((b) => new URL(b.url).pathname).join(", "), 80)}` : `${probes.length} links tested, none broken.${unsure.length ? ` ${unsure.length} could not be confirmed.` : ""}`, "Broken links lose visitors and waste Google's crawl of your site.", "Fix or remove the broken links, and redirect old addresses to their replacements.");
  add(1, "external", "The page links out to other sites", 1, external.length ? "pass" : "info", external.length ? `${plural(new Set(external.map(({ l }) => l.hostname)).size, "outside site")} linked.` : "No outside links.", "Linking to good sources is a sign of a well-researched page.", "Cite sources and link to them where it helps the reader.");

  // ===== 3. Helpful and readable
  add(2, "words", "The page has enough helpful content", 3, words >= 300 ? "pass" : words >= 120 ? "warn" : "fail", `About ${words.toLocaleString("en-US")} words of readable text.`, "Thin pages rarely rank. Google looks for pages that fully answer the question.", "Add what a customer needs: what you offer, who it is for, how pricing works, and answers to common questions.", "/services/ai-content-writing");
  const ratio = page.bytes ? (text.length / page.bytes) * 100 : 0;
  add(2, "ratio", "The page is mostly content, not code", 1, ratio >= 10 ? "pass" : ratio >= 4 ? "warn" : "fail", `Text makes up about ${ratio.toFixed(0)}% of the page code.`, "A very low ratio usually means a bloated page builder or content loaded by scripts.", "Trim unnecessary code and make sure the content is in the HTML.");
  const sentences = text.split(/[.!?]+\s/).filter((s) => s.split(" ").length > 2); const avgSent = sentences.length ? words / sentences.length : 0;
  add(2, "sentences", "Sentences are easy to read", 1, !words ? "info" : avgSent <= 22 ? "pass" : avgSent <= 30 ? "warn" : "fail", words ? `Average sentence is about ${Math.round(avgSent)} words.` : "No text to measure.", "Long sentences lose readers, and AI tools prefer clear statements they can quote.", "Aim for an average under 20 words. Split long sentences in two.");
  const paras = root.querySelectorAll("p").map((p) => p.text.trim().split(/\s+/).length); const longP = paras.filter((n) => n > 120).length;
  add(2, "paragraphs", "Paragraphs are short", 1, longP ? "warn" : "pass", longP ? `${plural(longP, "paragraph")} run over 120 words.` : "No wall-of-text paragraphs.", "On a phone, a 120-word paragraph is a full screen of unbroken text.", "Keep paragraphs to two or four sentences.");
  const lists = full.querySelectorAll("ul,ol").length, tables = full.querySelectorAll("table").length;
  add(2, "structure", "The page uses lists or tables", 1, lists + tables ? "pass" : "info", `${plural(lists, "list")} and ${plural(tables, "table")}.`, "Structured content is easier to scan, and AI tools lift lists and tables directly into answers.", "Turn steps into numbered lists and comparisons into tables.");
  const freq = new Map<string, number>(); for (const w of contentWords(text)) freq.set(w, (freq.get(w) ?? 0) + 1);
  const top = [...freq.entries()].sort((a, b) => b[1] - a[1])[0]; const density = top && words ? (top[1] / words) * 100 : 0;
  add(2, "stuffing", "No word is repeated unnaturally", 2, density > 5 ? "warn" : "pass", top ? `Most repeated word: "${top[0]}", about ${density.toFixed(1)}% of all words.` : "No text to measure.", "Repeating a keyword over and over is a spam signal and reads badly.", "Write naturally. Use the phrase where it belongs and use related words elsewhere.");
  const cta = anchors.some((a) => /^(tel|mailto):/i.test(a.getAttribute("href") ?? "")) || !!full.querySelector("form") || [...anchors, ...full.querySelectorAll("button")].some((el) => /(contact|book|call|quote|buy|get started|sign up|schedule|order|subscribe|apply|start)/i.test(el.text));
  add(2, "cta", "The page tells visitors what to do next", 2, cta ? "pass" : "warn", cta ? "A contact link, form, or clear next step was found." : "No form, contact link, or clear next step found.", "Traffic only pays when visitors can act. A clear next step turns readers into customers.", "Add one clear call to action: call, book, buy, or contact.", "/services/ai-seo-audit");
  const phone = anchors.some((a) => /^tel:/i.test(a.getAttribute("href") ?? "")) || /\(?\b\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}\b/.test(text);
  add(2, "contact", "Contact details are easy to find", 1, phone || anchors.some((a) => /^mailto:/i.test(a.getAttribute("href") ?? "")) ? "pass" : "info", phone ? "A phone number was found." : anchors.some((a) => /^mailto:/i.test(a.getAttribute("href") ?? "")) ? "An email link was found." : "No phone number or email link on this page.", "Visible contact details build trust with visitors and with Google's quality raters.", "Show a phone number or email in the header or footer of every page.");
  const author = !!full.querySelector('[rel="author"], [class*="author" i], [id*="author" i]') || ld.some((o) => o.author) || types.includes("Person");
  add(2, "author", "The page says who wrote it", 1, author ? "pass" : "info", author ? "Author information found." : "No author information found. This matters for articles more than service pages.", "Google's guidelines ask who created the content and whether they are credible.", "Add a byline and an author bio for articles.", "/guides/how-to-write-seo-content-with-ai");
  const yr = page.body.match(/(?:©|&copy;|copyright)\s*(?:\d{4}\s*[-–]\s*)?(\d{4})/i)?.[1]; const now = new Date().getFullYear();
  add(2, "copyright", "The copyright year is current", 1, !yr ? "info" : Number(yr) >= now - 1 ? "pass" : "warn", yr ? `Copyright year shown: ${yr}.` : "No copyright year found.", "An old year makes visitors wonder if the business is still open.", "Update the footer year, or make it update automatically.");

  // ===== 4. AI answers
  const aiBlocked = AI_BOTS.filter((b) => blocked.has(b.toLowerCase()) || blocked.has("*"));
  add(3, "aibots", "AI tools like ChatGPT are allowed to read your site", 2, aiBlocked.length ? "fail" : "pass", aiBlocked.length ? `Blocked in robots.txt: ${aiBlocked.join(", ")}.` : "No AI crawlers are blocked.", "Blocked crawlers cannot read you, so they cannot mention you.", "Remove the robots.txt rules that block AI crawlers, if you want to be cited.", "/guides/generative-engine-optimization");
  const scripts = full.querySelectorAll("script").length; const emptyApp = /<div[^>]+id=["'](root|app|__next|__nuxt)["'][^>]*>\s*<\/div>/i.test(page.body); const jsOnly = words < 150 && (emptyApp || scripts >= 4);
  add(3, "nojs", "Your content is visible without JavaScript", 3, words >= 150 ? "pass" : jsOnly ? "fail" : "info", words >= 150 ? "The main text is in the page itself." : jsOnly ? "Very little text is in the HTML and the page relies on scripts. Many AI crawlers do not run JavaScript." : "Very little text on this page, so there was not much to test.", "Some AI crawlers and some search features only read the HTML that the server sends.", "Ask your developer to render the main content on the server.", "/services/technical-seo");
  const qHeads = heads.filter((h) => h.level > 1 && (/\?$/.test(h.text) || /^(how|what|why|when|where|which|who|can|do|does|is|are|should)\b/i.test(h.text)));
  add(3, "questions", "Headings are written as questions people ask", 2, qHeads.length >= 2 ? "pass" : "warn", qHeads.length ? `${plural(qHeads.length, "question-style heading")}, e.g. "${clip(qHeads[0].text, 60)}"` : "No question-style headings.", "AI tools match headings to the questions people ask, then quote the answer beneath.", "Rewrite some headings as real customer questions and answer in the first sentence below.", "/guides/generative-engine-optimization");
  const firstP = root.querySelector("main p, article p, body p"); const fpw = firstP ? firstP.text.trim().split(/\s+/).length : 0;
  add(3, "answer-first", "The page gets to the point quickly", 2, !firstP ? "info" : fpw >= 15 && fpw <= 100 ? "pass" : "warn", firstP ? `The first paragraph is ${fpw} words.` : "No paragraph text found.", "AI tools and skimming readers both take the first sentences as the answer.", "Open with a direct one or two sentence answer, then explain.", "/guides/generative-engine-optimization");
  const avgSec = h2s.length >= 2 ? words / h2s.length : 0;
  add(3, "sections", "Sections are a quotable length", 1, h2s.length < 2 ? "info" : avgSec <= 400 ? "pass" : "warn", h2s.length < 2 ? "Fewer than two sections, so this was not measured." : `Average section is about ${Math.round(avgSec)} words.`, "AI tools quote passages of a few hundred words. Sections that stand alone get lifted.", "Split long sections with more subheadings so each answers one thing.");
  const cited = external.filter(({ a }) => a.closest("p, li, td, blockquote")).length;
  add(3, "sources", "Claims link to sources", 1, cited ? "pass" : "info", cited ? `${plural(cited, "source link")} inside the text.` : "No links to sources inside the text.", "Statements backed by a named source are far more likely to be quoted by AI tools.", "Link each statistic or claim to where it came from.");
  const stats = (text.match(/\b\d[\d,.]*\s?(%|percent|million|billion|thousand)\b/gi) ?? []).length;
  add(3, "stats", "The page includes concrete numbers", 1, stats ? "pass" : "info", stats ? `${plural(stats, "figure")} such as percentages or amounts.` : "No statistics or figures found.", "Specific numbers are what AI answers and readers remember and repeat.", "Add real figures: prices, timings, results, and sourced statistics.");
  add(3, "schema", "The page labels its key facts in code (schema)", 2, ldBroken ? "warn" : types.length ? "pass" : "warn", ldBroken ? `${plural(ldBroken, "schema block")} broken.` : types.length ? `Schema found: ${clip(types.join(", "), 90)}.` : "No schema found.", "Schema tells Google and AI tools exactly what the page is, without guessing.", ldBroken ? "Fix the broken schema and test it with Google's Rich Results Test." : "Add schema for your organization, articles, FAQs, and products.", "/services/technical-seo");
  const missing: string[] = [];
  for (const o of ld) { const t = typesOf(o); if (t.some((v) => /Article|BlogPosting/.test(v)) && !o.headline) missing.push("Article without headline"); if (t.some((v) => orgLike.test(v)) && !o.name) missing.push("Organization without name"); if (t.includes("FAQPage") && !Array.isArray(o.mainEntity)) missing.push("FAQPage without questions"); if (t.includes("Product") && !o.name) missing.push("Product without name"); if (t.includes("BreadcrumbList") && !Array.isArray(o.itemListElement)) missing.push("BreadcrumbList without items"); if (t.includes("AggregateRating") || o.aggregateRating) { if (!/review|rating|stars/i.test(text)) missing.push("rating markup with no visible reviews"); } }
  add(3, "schema-valid", "Schema has the details it needs", 1, !ld.length ? "info" : missing.length ? "warn" : "pass", !ld.length ? "No schema to check." : missing.length ? clip(missing.join("; "), 100) : "Required fields are present in every schema block.", "Incomplete schema is ignored. Schema that claims things the page does not show can trigger a penalty.", "Complete the missing fields and only mark up what is visible on the page.");
  add(3, "org", "The site says who is behind it, in code", 2, orgs.length ? "pass" : "warn", orgs.length ? `${typesOf(orgs[0])[0]} schema found${orgs[0].name ? ` for "${clip(String(orgs[0].name), 40)}"` : ""}.` : "No organization or business schema on this page.", "This is how Google and AI tools connect your brand name, site, and profiles into one identity.", "Add Organization or LocalBusiness schema with your name, address, phone, and profile links.");
  const sameAs = orgs.some((o) => Array.isArray(o.sameAs) && o.sameAs.length) || ld.some((o) => Array.isArray(o.sameAs) && o.sameAs.length);
  add(3, "sameas", "The schema links to your profiles", 1, !orgs.length ? "info" : sameAs ? "pass" : "warn", sameAs ? "Profile links (sameAs) found." : orgs.length ? "The organization schema has no sameAs links." : "No organization schema to check.", "Profile links confirm that the LinkedIn, Facebook, and directory entries belong to the same brand.", "Add a sameAs list with your social and directory profile URLs.");
  add(3, "breadcrumb", "Breadcrumb trail is marked up", 1, types.includes("BreadcrumbList") ? "pass" : u.pathname === "/" ? "info" : "warn", types.includes("BreadcrumbList") ? "BreadcrumbList schema found." : u.pathname === "/" ? "Homepages do not need breadcrumbs." : "No breadcrumb schema.", "Breadcrumbs show Google where the page sits in your site and can appear in results.", "Add a visible breadcrumb trail with BreadcrumbList schema.");
  add(3, "faq", "Common questions are marked up", 1, types.includes("FAQPage") ? "pass" : "info", types.includes("FAQPage") ? "FAQPage schema found." : "No FAQ schema. Optional, but useful on pages that answer questions.", "FAQ sections match the way people ask AI tools questions.", "Add a short FAQ with real customer questions and FAQPage schema.");
  const dated = ld.some((o) => o.dateModified || o.datePublished) || !!full.querySelector("time[datetime]");
  add(3, "date", "The page shows when it was updated", 1, dated ? "pass" : "info", dated ? "A date was found." : "No published or updated date. Matters for articles, less for service pages.", "Fresh, dated content is preferred by AI tools and by Google for changing topics.", "Show a real last-updated date on articles and guides.");
  add(3, "entity", "The brand name appears in the text", 1, !brand ? "info" : text.toLowerCase().includes(brand.toLowerCase()) ? "pass" : "warn", !brand ? "Brand name not detected (no og:site_name or organization schema)." : text.toLowerCase().includes(brand.toLowerCase()) ? `"${clip(brand, 40)}" is named on the page.` : `"${clip(brand, 40)}" is not mentioned in the page text.`, "AI tools attribute facts to brands they can see named clearly in the content.", "Name your business in the text, not only in the logo image.");
  const llmsOk = isText(x.llms) && x.llms!.body.trim().length > 20;
  add(3, "llms", "Optional: an llms.txt file for AI systems", 1, llmsOk ? "pass" : "info", llmsOk ? "llms.txt found." : "No llms.txt. Optional. Google says it is not needed for its AI answers.", "Some AI systems read it as a map of your key pages.", "It takes a minute to make.", "/tools/llms-txt-generator");

  // ===== 5. Sharing
  const og = { t: meta('meta[property="og:title"]'), d: meta('meta[property="og:description"]'), i: meta('meta[property="og:image"]'), u: meta('meta[property="og:url"]'), ty: meta('meta[property="og:type"]') };
  const ogMissing = [!og.t && "title", !og.d && "description", !og.i && "image"].filter(Boolean);
  add(4, "og", "Shared links show a title, summary, and image", 2, ogMissing.length === 0 ? "pass" : ogMissing.length === 3 ? "fail" : "warn", ogMissing.length ? `Missing share ${ogMissing.join(", ")}.` : "Share title, description, and image are set.", "Without Open Graph tags, a shared link shows up bare on Facebook, LinkedIn, and in messaging apps.", "Add og:title, og:description, and og:image tags.");
  const oi = x.ogImage; const oiOk = oi ? oi.status === 200 && /image/i.test(oi.headers.get("content-type") ?? "") : null;
  add(4, "og-image", "The share image loads", 2, !og.i ? "info" : oiOk === null ? "info" : oiOk ? "pass" : "fail", !og.i ? "No share image set." : oiOk === null ? "Could not test the image." : oiOk ? `Image loads (${Math.round((oi!.bytes) / 1024)} KB).` : `The image address returns status ${oi!.status}.`, "A broken share image looks worse than none.", "Point og:image at a real, public image at least 1200 by 630 pixels.");
  add(4, "og-size", "The share image declares its size", 1, !og.i ? "info" : meta('meta[property="og:image:width"]') ? "pass" : "info", meta('meta[property="og:image:width"]') ? "Width and height tags present." : "No og:image:width and height tags.", "Declared sizes let platforms show the image immediately on the first share.", "Add og:image:width and og:image:height.");
  let ogUrlOk: boolean | null = null; try { if (og.u) ogUrlOk = new URL(og.u).pathname.replace(/\/$/, "") === u.pathname.replace(/\/$/, ""); } catch { ogUrlOk = false; }
  add(4, "og-url", "The share address matches the page", 1, ogUrlOk === null ? "info" : ogUrlOk ? "pass" : "warn", ogUrlOk === null ? "No og:url tag." : ogUrlOk ? "og:url matches this page." : `og:url points to ${clip(og.u, 60)}`, "Platforms group shares by og:url. A wrong one sends likes and shares to the wrong page.", "Set og:url to the page's canonical address.");
  add(4, "twitter", "Links look good on X", 1, meta('meta[name="twitter:card"]') ? "pass" : "warn", meta('meta[name="twitter:card"]') ? `Card type: ${meta('meta[name="twitter:card"]')}.` : "No X (Twitter) card tag.", "X shows a large preview only when a card type is declared.", "Add a twitter:card tag set to summary_large_image.");
  add(4, "favicon", "The site has a browser tab icon", 1, full.querySelector('link[rel~="icon"]') ? "pass" : "info", full.querySelector('link[rel~="icon"]') ? "Icon found." : "No icon link in the page. It may still exist at /favicon.ico.", "Google shows your icon next to your result on phones.", "Add a favicon link in the head.");
  add(4, "apple-icon", "The site has a phone home-screen icon", 1, full.querySelector('link[rel="apple-touch-icon"]') ? "pass" : "info", full.querySelector('link[rel="apple-touch-icon"]') ? "Apple touch icon found." : "No apple-touch-icon.", "It is the icon shown when someone saves your site to their phone.", "Add a 180 by 180 pixel apple-touch-icon.");

  // ===== 6. Speed, safety, trust
  add(5, "ttfb", "The server responds quickly", 2, page.ms < 1200 ? "pass" : page.ms < 3000 ? "warn" : "fail", `First response in ${(page.ms / 1000).toFixed(1)} seconds, measured from our server. A rough guide, not a full speed test.`, "A slow first byte delays everything else on the page.", "Ask your host about caching or a content delivery network.", "/services/technical-seo");
  const kb = Math.round(page.bytes / 1024);
  add(5, "size", "The page code is not bloated", 1, kb < 250 ? "pass" : kb < 600 ? "warn" : "fail", `The HTML is ${kb.toLocaleString("en-US")} KB.`, "Large HTML slows every visit, especially on mobile networks.", "Trim page builder output and remove inlined images or scripts.");
  add(5, "gzip", "The server compresses pages", 1, H.get("content-encoding") ? "pass" : "warn", H.get("content-encoding") ? `Compression on (${H.get("content-encoding")}).` : "No compression detected.", "Compression cuts transfer size by around 70% for free.", "Turn on gzip or Brotli on the server. Usually one setting.");
  add(5, "cache", "The page sets caching rules", 1, H.get("cache-control") ? "pass" : "info", H.get("cache-control") ? `Cache-Control: ${clip(H.get("cache-control")!, 50)}` : "No Cache-Control header.", "Caching lets repeat visitors and CDNs reuse what they already downloaded.", "Set Cache-Control headers for pages and long cache times for images and scripts.");
  const mixed = https ? (page.body.match(/(?:src|href)=["']http:\/\/[^"']+\.(?:js|css|png|jpe?g|gif|webp|svg|woff2?)/gi) ?? []).length : 0;
  add(5, "mixed", "Nothing loads over an insecure connection", 2, mixed ? "warn" : "pass", mixed ? `${plural(mixed, "file")} load over plain http.` : "No insecure files found.", "Browsers block or warn about insecure files on secure pages.", "Change those addresses to https.");
  add(5, "redirects", "Visitors reach the page without extra hops", 1, page.hops.length <= 1 ? "pass" : "warn", page.hops.length ? `${plural(page.hops.length, "redirect")} before the page loaded.` : "No redirects.", "Each hop adds delay before anything appears.", "Point links and redirects straight at the final address.");
  const scriptSrcs = full.querySelectorAll("script[src]");
  add(5, "scripts", "The page does not load too many scripts", 1, scriptSrcs.length <= 15 ? "pass" : scriptSrcs.length <= 30 ? "warn" : "fail", `${plural(scriptSrcs.length, "external script")}.`, "Every script is a download and work for the phone's processor.", "Remove unused plugins and tracking scripts. Load the rest deferred.");
  const css = full.querySelectorAll('link[rel="stylesheet"]').length;
  add(5, "css", "The page does not load too many stylesheets", 1, css <= 6 ? "pass" : css <= 12 ? "warn" : "fail", `${plural(css, "stylesheet")}.`, "Each stylesheet blocks rendering until it arrives.", "Combine stylesheets and remove ones from unused plugins.");
  const blocking = full.querySelectorAll("head script[src]").filter((s) => !s.hasAttribute("async") && !s.hasAttribute("defer") && s.getAttribute("type") !== "module").length;
  add(5, "blocking", "Scripts do not block the page from appearing", 1, blocking === 0 ? "pass" : blocking <= 2 ? "warn" : "fail", blocking ? `${plural(blocking, "script")} in the head load before anything shows.` : "No render-blocking scripts in the head.", "A blocking script stops the browser drawing the page until it has downloaded and run.", "Add defer to scripts in the head, or move them to the end of the page.");
  const inlineKb = Math.round(full.querySelectorAll("script:not([src])").reduce((n, s) => n + s.text.length, 0) / 1024);
  add(5, "inline", "Inline code is kept small", 1, inlineKb < 60 ? "pass" : inlineKb < 150 ? "warn" : "fail", `About ${inlineKb} KB of inline script.`, "Inline code cannot be cached, so every visit downloads it again.", "Move large scripts to files and load only what the page needs.");
  const hosts = new Set<string>(); for (const el of full.querySelectorAll("script[src],link[href],img[src],iframe[src]")) { try { const h = new URL(el.getAttribute("src") ?? el.getAttribute("href")!, u).hostname; if (!sameSite(h, u.hostname) && !h.endsWith("." + u.hostname.replace(/^www\./, ""))) hosts.add(h); } catch { /* skip */ } }
  add(5, "third-party", "The page relies on few outside services", 1, hosts.size <= 8 ? "pass" : hosts.size <= 15 ? "warn" : "fail", `${plural(hosts.size, "outside domain")} loaded.`, "Each outside service adds connections and can slow or break the page.", "Remove tools you no longer use. Self-host fonts where you can.");
  add(5, "hsts", "Browsers are told to always use https (HSTS)", 1, !https ? "info" : H.get("strict-transport-security") ? "pass" : "info", H.get("strict-transport-security") ? "HSTS header present." : "No HSTS header.", "HSTS stops a downgrade to http after the first visit.", "Add a Strict-Transport-Security header. Many hosts have a toggle for it.");
  add(5, "xcto", "Files are served with their true type", 1, H.get("x-content-type-options") ? "pass" : "info", H.get("x-content-type-options") ? "X-Content-Type-Options set." : "No X-Content-Type-Options header.", "It stops browsers guessing file types, which closes a class of attacks.", "Add the header X-Content-Type-Options: nosniff.");
  const frame = H.get("x-frame-options") || /frame-ancestors/i.test(H.get("content-security-policy") ?? "");
  add(5, "frame", "The site cannot be framed by other sites", 1, frame ? "pass" : "info", frame ? "Framing protection set." : "No framing protection header.", "Framing protection prevents clickjacking, where your page is hidden under another.", "Add X-Frame-Options: SAMEORIGIN or a frame-ancestors policy.");
  add(5, "referrer", "Visitor privacy is protected on outbound links", 1, H.get("referrer-policy") ? "pass" : "info", H.get("referrer-policy") ? `Referrer-Policy: ${H.get("referrer-policy")}` : "No Referrer-Policy header.", "It limits what other sites learn about your visitors when they click out.", "Add Referrer-Policy: strict-origin-when-cross-origin.");
  const server = (H.get("server") ?? "") + " " + (H.get("x-powered-by") ?? ""); const leak = /\d+\.\d+/.test(server);
  add(5, "server-leak", "The server does not reveal its software version", 1, leak ? "warn" : "pass", leak ? `Headers reveal: ${clip(server.trim(), 50)}` : "No version numbers exposed.", "Version numbers tell attackers exactly which known weaknesses to try.", "Hide the Server and X-Powered-By headers.");
  const oldJq = scriptSrcs.some((s) => /jquery[-.]?(1|2)\.\d/i.test(s.getAttribute("src") ?? ""));
  add(5, "old-lib", "No outdated JavaScript libraries detected", 1, oldJq ? "warn" : "pass", oldJq ? "An old jQuery 1.x or 2.x file is loaded." : "No known outdated libraries found by name.", "Old libraries have public security holes and slow the page.", "Update to a current version, or remove it if nothing uses it.");
  const deprecated = full.querySelectorAll("font,center,marquee,blink,frameset").length;
  add(5, "deprecated", "The page uses modern HTML", 1, deprecated ? "warn" : "pass", deprecated ? `${plural(deprecated, "outdated tag")} such as <font> or <center>.` : "No outdated tags found.", "Outdated tags signal an old, unmaintained site.", "Replace them with CSS.");
  const noText = anchors.filter((a) => !a.text.trim() && !a.getAttribute("aria-label") && !a.querySelector("img[alt]")?.getAttribute("alt")).length;
  add(5, "link-text", "Every link has readable text", 1, noText === 0 ? "pass" : noText <= 2 ? "warn" : "fail", noText ? `${plural(noText, "link")} have no text or label.` : "All links have text or a label.", "Screen readers announce these as \"link\" with no clue where they go, and Google gets no context.", "Add text or an aria-label to icon links.");
  const privacy = anchors.some((a) => /privacy/i.test(a.text) || /privacy/i.test(a.getAttribute("href") ?? ""));
  add(5, "privacy", "The site links to a privacy policy", 1, privacy ? "pass" : "warn", privacy ? "Privacy policy link found." : "No privacy policy link found.", "A privacy policy is a basic trust signal and a legal requirement in many places.", "Add a privacy policy page and link it from the footer.");
  const social = new Set(external.filter(({ l }) => /(facebook|linkedin|instagram|youtube|tiktok|x|twitter|pinterest)\.com$/.test(l.hostname.replace(/^www\./, ""))).map(({ l }) => l.hostname.replace(/^www\./, ""))).size;
  add(5, "social", "The page links to your social profiles", 1, social ? "pass" : "info", social ? `${plural(social, "social platform")} linked.` : "No social profile links found.", "Profile links help Google and AI tools connect your brand across the web.", "Link your real profiles from the footer.");

  // Score and priorities from the full report
  const counts: Counts = { pass: 0, warn: 0, fail: 0, info: 0 }; out.forEach((c) => counts[c.status as keyof Counts]++);
  let got = 0, max = 0; for (const c of out) { if (c.status === "info") continue; max += c.weight; got += c.status === "pass" ? c.weight : c.status === "warn" ? c.weight / 2 : 0; }
  const score = max ? Math.round((got / max) * 100) : 0;
  const priorities = out.filter((c) => c.status === "fail" || c.status === "warn").sort((a, b) => (a.status === b.status ? b.weight - a.weight : a.status === "fail" ? -1 : 1)).slice(0, 3).map((c) => c.id);
  return { url: page.url, checkedAt: new Date().toISOString(), score, counts, total: out.length, groups: GROUPS, checks: out, priorities, locked: false };
}

/** Free view: full results for the five free checks, labels only for the rest. */
export function redact(r: Report): Report {
  return { ...r, locked: true, checks: r.checks.map((c) => (c.free ? c : { id: c.id, group: c.group, label: c.label, weight: c.weight, status: "locked" })) };
}
