// Tells Bing (and other IndexNow engines) which pages exist or changed, so they are
// crawled sooner. Bing's index also feeds ChatGPT search and Copilot.
// Run after a deploy: node scripts/indexnow.mjs
const HOST = "seousingai.com";
const KEY = "330741166e4bbe2e972d8368c84bf878"; // public/<KEY>.txt proves we own the site
const sitemap = await (await fetch(`https://${HOST}/sitemap.xml`)).text();
const urlList = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
});
console.log(`IndexNow: ${res.status} ${res.statusText} for ${urlList.length} URLs`);
