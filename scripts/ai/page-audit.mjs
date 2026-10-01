// TypeSafe page audit: one request per content page, six independent judgments over the
// same page state (answer-first, accurate description, specificity, quotability for AI,
// unsourced claims, search intent). Code chooses the pages and applies the thresholds.
// Runs on your computer only; needs TYPESAFE_API_KEY in your shell (never in this repo).
// Usage: npm run ai:audit                         (live site, writes scripts/ai/pages.json)
//        node scripts/ai/page-audit.mjs http://localhost:3000 > scripts/ai/pages.json
//        ONLY=/pricing,/services node scripts/ai/page-audit.mjs <base>   (just these pages)
import { TypeSafeClient } from "@typesafe-ai/sdk";
import { parse } from "node-html-parser";

const BASE = process.argv[2] || "https://seousingai.com";
const LIVE = "https://seousingai.com";
const client = new TypeSafeClient(); // reads TYPESAFE_API_KEY from the environment

// Pages whose job is to rank and be quoted. Policy and utility pages are left out.
const SKIP = /^\/(privacy|terms|contact|book-a-call|editorial-standards|case-studies|about)$/;

const questions = {
  answer_first: {
    type: "noul",
    instructions: "Read `page.opening`, the text that comes right after the main heading. Does it directly answer the question or need expressed by `page.title` within its first two sentences?",
    criteria: {
      true: "The first one or two sentences give the actual answer: a definition, a yes or no, the steps, a price range, or what the service is and who it is for.",
      false: "The opening is a welcome, background, a story, a list of links, or a broad claim; the real answer comes later or not at all.",
    },
  },
  meta_accurate: {
    type: "noul",
    instructions: "Does `page.meta_description` accurately describe what `page.body` actually contains, without promising anything the page does not deliver?",
    criteria: {
      true: "A reader who clicked because of the description would find exactly that on the page.",
      false: "The description is vague, describes something else, or promises content, results or offers the page does not contain.",
    },
  },
  specificity: {
    type: "score",
    instructions: "How specific and experience-based is the content in `page.body`?",
    criteria: [
      "Generic statements that could appear on any SEO website; no concrete steps, numbers, tools or examples.",
      "Some concrete advice, but most of it is general; few named tools, numbers or examples.",
      "Mostly concrete: named tools, exact steps or settings, and at least one worked example or number.",
      "Highly specific throughout: exact clicks or settings, real numbers or prices, named examples, and details that show first-hand experience.",
    ],
  },
  quotable: {
    type: "score",
    instructions: "How easily could an AI assistant such as ChatGPT or Google's AI Overviews lift a correct, self-contained answer from `page.body`, using `page.headings` as the page structure?",
    criteria: [
      "No passage answers a question on its own; points depend on surrounding context.",
      "One or two quotable answers, but buried inside long paragraphs.",
      "Several clear one-to-two-sentence answers under descriptive headings.",
      "Organized as questions with a direct answer under each heading plus a summary answer near the top; most sections can be quoted on their own.",
    ],
  },
  unsourced_claims: {
    type: "noul",
    instructions: "Does `page.body` present statistics, percentages, study findings or client results as fact without naming where they come from?",
    criteria: {
      true: "At least one specific figure or result is stated as fact with no named source, for example '70% of searches start on Google' or 'we doubled their traffic'.",
      false: "Figures are sourced, clearly labelled as examples, are our own prices or timings, or there are no such figures.",
    },
  },
  intent: {
    type: "choice",
    instructions: "Which search intent does this page serve best for someone arriving from Google or an AI assistant?",
    criteria: {
      learn: "Wants to learn how to do something or understand a topic.",
      compare: "Is comparing options, tools, prices or approaches before deciding.",
      hire: "Is ready to hire or buy a service.",
      brand: "Is looking for this company specifically.",
    },
  },
};

const sitemap = await (await fetch(`${BASE}/sitemap.xml`)).text();
const paths = process.env.ONLY ? process.env.ONLY.split(",") : [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1].replace(LIVE, "") || "/").filter((p) => !SKIP.test(p)).slice(0, Number(process.argv[3]) || undefined);

async function judge(path) {
  const root = parse(await (await fetch(BASE + path)).text());
  const main = root.querySelector("main");
  const h1 = main.querySelector("h1");
  const body = main.text.replace(/\s+/g, " ").trim();
  const afterH1 = h1 ? body.slice(body.indexOf(h1.text.replace(/\s+/g, " ").trim()) + h1.text.length) : body;
  const state = {
    page: {
      url: LIVE + path,
      title: root.querySelector("title")?.text.trim(),
      h1: h1?.text.replace(/\s+/g, " ").trim(),
      meta_description: root.querySelector('meta[name="description"]')?.getAttribute("content"),
      opening: afterH1.slice(0, 700),
      headings: main.querySelectorAll("h2, h3").map((h) => h.text.replace(/\s+/g, " ").trim()).slice(0, 40),
      body: body.slice(0, 7000),
    },
  };
  const { answers, usage } = await client.systemOne({ state, questions });
  return {
    path,
    title: state.page.title,
    answer_first: +answers.answer_first.noul.toFixed(3),
    meta_accurate: +answers.meta_accurate.noul.toFixed(3),
    specificity: +answers.specificity.score.toFixed(2),
    specificity_conf: +answers.specificity.confidence.toFixed(2),
    quotable: +answers.quotable.score.toFixed(2),
    quotable_conf: +answers.quotable.confidence.toFixed(2),
    unsourced_claims: +answers.unsourced_claims.noul.toFixed(3),
    intent: answers.intent.choice,
    intent_conf: +answers.intent.confidence.toFixed(2),
    tokens: usage.input_tokens + usage.output_tokens,
  };
}

const results = [];
const failed = [];
for (let i = 0; i < paths.length; i += 4) {
  const batch = await Promise.allSettled(paths.slice(i, i + 4).map(judge));
  batch.forEach((r, j) => (r.status === "fulfilled" ? results.push(r.value) : failed.push({ path: paths[i + j], error: String(r.reason?.message || r.reason) })));
}
console.log(JSON.stringify({ results, failed }, null, 1));
console.error(`judged ${results.length}, failed ${failed.length}, tokens ${results.reduce((a, r) => a + r.tokens, 0)}`);
