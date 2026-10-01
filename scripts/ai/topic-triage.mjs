// TypeSafe topic triage: for each candidate page, judge buyer intent, our fit, whether an
// existing page already covers it (picked from the real page list), and whether people ask
// AI assistants this kind of question. Code combines the answers into a priority.
// Needs TYPESAFE_API_KEY in your shell. Run the page audit first: this reads its pages.json.
// Usage: npm run ai:topics   (writes scripts/ai/topics.json)
import { TypeSafeClient } from "@typesafe-ai/sdk";
import fs from "node:fs";

const client = new TypeSafeClient();
const pages = JSON.parse(fs.readFileSync(new URL("./pages.json", import.meta.url), "utf8")).results;

const business = {
  name: "SEO Using AI",
  sells_to: "US small and mid-sized businesses, mostly local and home-service companies, plus some B2B companies",
  services: [
    "Website + SEO managed plan, from $990/month",
    "Social + AI reels plan, from $790/month",
    "Website checkup $290, technical SEO from $490, AI search optimization from $590, local SEO from $390/month, content writing from $390/month, link building from $590/month, website redesign from $1,490",
  ],
  first_hand_experience: [
    "Lead SEO and website manager for an Australian air-conditioning and electrical contractor since 2021",
    "10+ years building and optimizing WordPress websites",
    "Managed websites for marketing agencies and an e-commerce gardening business",
    "Builds animated explainer reels and AI-assisted content with human fact-checking",
  ],
};

// Existing pages as Choice options: the model selects one, or none.
const overlapCriteria = { none: "No existing page already answers this topic's main question." };
for (const p of pages) overlapCriteria[p.path] = p.title;

const questions = {
  buyer_intent: {
    type: "score",
    instructions: "Think about a typical person who searches for `candidate.target_search`. How close are they to paying a company like `business` for help?",
    criteria: [
      "Hobbyist, student or marketer learning for themselves; would not hire anyone.",
      "Business owner learning the basics; might hire later but is researching for now.",
      "Business owner comparing options, prices or providers, likely to hire within months.",
      "Business owner looking to hire help now for this exact problem.",
    ],
  },
  fit: {
    type: "score",
    instructions: "How well could `business`, using its `services` and `first_hand_experience`, write the most useful, specific page on the internet for `candidate.topic`?",
    criteria: [
      "Outside what the business does or knows first-hand.",
      "Related to its services, but it has no first-hand experience to add beyond general knowledge.",
      "Core to its services, and it can add some specific examples or prices of its own.",
      "Core to its services and its own first-hand experience, so it can add details competitors cannot.",
    ],
  },
  overlap: {
    type: "choice",
    instructions: "Which existing page on the business's website already answers the main question of `candidate.topic`, so a new page would compete with it? Choose none if no existing page answers that main question.",
    criteria: overlapCriteria,
  },
  asked_to_ai: {
    type: "noul",
    instructions: "Is `candidate.target_search` the kind of question people commonly ask an AI assistant such as ChatGPT to answer, recommend or compare, rather than only typing into Google?",
    criteria: {
      true: "It asks for an explanation, a recommendation, a comparison, a cost estimate or a how-to that an assistant can summarize.",
      false: "It is mainly navigational, a local map lookup, or a quick fact people type into a search box.",
    },
  },
};

const candidates = [
  ["SEO for HVAC companies", "seo for hvac companies"],
  ["SEO for electricians", "seo for electricians"],
  ["SEO for plumbers", "plumber seo"],
  ["SEO for roofing companies", "roofing seo"],
  ["SEO for landscaping and lawn care businesses", "landscaping seo"],
  ["SEO for dentists", "dental seo"],
  ["SEO for law firms", "law firm seo"],
  ["SEO for real estate agents", "real estate seo"],
  ["How much does SEO cost for a small business in 2026", "how much does seo cost for a small business"],
  ["How much does local SEO cost per month", "local seo pricing"],
  ["Is SEO worth it for a small local business", "is seo worth it for small business"],
  ["AI SEO vs traditional SEO", "ai seo vs traditional seo"],
  ["SEO agency vs freelancer vs doing it yourself", "seo agency vs freelancer"],
  ["SEO vs Google Ads for a small business", "seo vs google ads for small business"],
  ["Best SEO tools for small businesses", "best seo tools for small business"],
  ["How to show up in Google AI Overviews", "how to appear in google ai overviews"],
  ["How to get your business recommended by ChatGPT", "how to get chatgpt to recommend my business"],
  ["How to get cited by Perplexity", "how to get cited by perplexity"],
  ["What is llms.txt and does it help SEO", "what is llms.txt"],
  ["How to check if AI tools mention your business", "check if chatgpt mentions my business"],
  ["Schema markup for local businesses", "local business schema markup"],
  ["How to get more Google reviews the right way", "how to get more google reviews"],
  ["Google Business Profile suspended: how to fix it", "google business profile suspended"],
  ["Service area pages: ranking in several cities without doorway pages", "service area pages seo"],
  ["WordPress SEO checklist for 2026", "wordpress seo checklist"],
  ["How to speed up a WordPress site for Core Web Vitals", "speed up wordpress site"],
  ["Yoast vs Rank Math: which WordPress SEO plugin", "yoast vs rank math"],
  ["How to redesign or migrate a WordPress site without losing rankings", "website migration without losing seo"],
  ["How to choose an SEO agency: questions to ask before hiring", "how to choose an seo agency"],
  ["SEO red flags and scams small businesses should avoid", "seo scams"],
  ["How long does SEO take to work", "how long does seo take"],
  ["How often should a small business publish blog posts", "how often should a small business blog"],
  ["Does AI-written content rank on Google", "does ai content rank on google"],
  ["Study: which local businesses ChatGPT, Gemini and Perplexity recommend", "which businesses does chatgpt recommend"],
  ["SEO for home service businesses", "home services seo"],
  ["Google Search Console for beginners", "google search console tutorial"],
];

async function judge([topic, target_search]) {
  const { answers, usage } = await client.systemOne({ state: { business, candidate: { topic, target_search } }, questions });
  const o = answers.overlap;
  return {
    topic,
    target_search,
    buyer_intent: +answers.buyer_intent.score.toFixed(2),
    fit: +answers.fit.score.toFixed(2),
    asked_to_ai: +answers.asked_to_ai.noul.toFixed(2),
    overlap: o.choice,
    overlap_p: +o.probabilities[o.choice].toFixed(2),
    none_p: +o.probabilities.none.toFixed(2),
    tokens: usage.input_tokens + usage.output_tokens,
  };
}

const results = [], failed = [];
for (let i = 0; i < candidates.length; i += 4) {
  const batch = await Promise.allSettled(candidates.slice(i, i + 4).map(judge));
  batch.forEach((r, j) => (r.status === "fulfilled" ? results.push(r.value) : failed.push({ topic: candidates[i + j][0], error: String(r.reason?.message || r.reason) })));
}
console.log(JSON.stringify({ results, failed }, null, 1));
console.error(`judged ${results.length}, failed ${failed.length}, tokens ${results.reduce((a, r) => a + r.tokens, 0)}`);
