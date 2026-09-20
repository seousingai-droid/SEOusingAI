---
title: "ChatGPT Prompts for SEO That Produce Usable Work"
metaTitle: "ChatGPT Prompts for SEO: 11 That Actually Work"
description: "Good SEO prompts give the model a role, context, source material, constraints, and an output format. Here are 11 prompts for ChatGPT, Claude, or Gemini."
eyebrow: "Prompts"
image: "/images/anatomy-of-an-seo-prompt.webp"
order: 6
published: "2026-09-20"
updated: "2026-09-20"
quickAnswer: "The best ChatGPT prompts for SEO share five parts: a role, your business context, pasted source material, clear constraints, and a required output format. Prompts built this way work the same in ChatGPT, Claude, and Gemini. The most useful ones cover keyword clustering, content briefs, title and meta description variants, internal links, schema markup, and analysis of Search Console exports."
faqs:
  - q: "Do these prompts work in Claude and Gemini too?"
    a: "Yes. These prompts work in ChatGPT, Claude, Gemini, and other general AI models because they rely on clear context and format instructions, not on features of one product."
  - q: "Why does ChatGPT give generic SEO advice?"
    a: "ChatGPT gives generic SEO advice when the prompt is generic. Without your audience, your competitors, and your data, the model can only return the average of what it has read. Pasting in real source material is the fastest fix."
  - q: "Should I tell the model not to invent data?"
    a: "Yes. Telling the model not to invent statistics, volumes, or quotes, and to mark anything uncertain, noticeably reduces fabricated details. You still need to verify every fact before publishing."
---

## What makes a good SEO prompt?

A good SEO prompt has five parts: role, context, source material, constraints, and output format. Missing any one of them is why most SEO prompts return filler.

![Anatomy of an SEO prompt with five labeled parts: role, context, source material, constraints, and output format](/images/anatomy-of-an-seo-prompt.webp "Source material is the part most people skip, and the one that changes the output most.")

- **Role.** Who the model should act as, such as a technical SEO or a content strategist.
- **Context.** What you sell, who buys it, and the country you target.
- **Source material.** Pasted competitor headings, your draft, or a data export. This is the part most people skip.
- **Constraints.** What not to do, including "do not invent statistics or search volumes."
- **Output format.** A table, a list of ten, or JSON-LD. Format instructions make output usable without cleanup.

The [AI SEO Prompt Builder](/tools/ai-seo-prompt-builder) assembles these parts for you.

## What are the best prompts for keyword research?

The best prompts for keyword research ask for real user phrasing, grouping by intent, and no invented numbers.

```
Act as an SEO strategist. I sell [product] to [audience] in the US.
From these seed topics: [list], give me 40 queries real buyers would type.
Group by intent and name one page per group. Do not include search volumes.
```

```
Here are my Google Search Console queries with clicks, impressions, and position: [paste].
List queries in positions 5 to 20 with high impressions.
For each, name the page and one change likely to improve it.
```

More detail is in the [AI keyword research guide](/guides/ai-keyword-research).

## What are the best prompts for content briefs?

The best prompts for content briefs start from what already ranks and ask for the gap.

```
Here are the titles and H2 headings of the top 5 results for "[query]": [paste].
Summarize what they all cover, what they miss, and the dominant format.
Then write a brief: search intent, angle, H2s as questions, and 5 FAQs.
```

```
Review this outline for "[query]": [paste].
Which sections would a reader skip? Which question is missing?
Reply with a revised outline only.
```

To keep briefs consistent, use the one-page [content brief template](/guides/ai-content-brief-template).

## What are the best prompts for on-page SEO?

The best prompts for on-page SEO request several variants within hard limits so you can choose.

```
Write 8 title tags for a page targeting "[query]". Max 60 characters.
Keyword near the front. Each needs a different reason to click. No clickbait.
```

```
Write 5 meta descriptions under 155 characters for this page: [paste intro].
Each should read as a preview of the answer and end with a reason to click.
```

```
Here is my sitemap: [paste URLs and titles]. Here is a new article: [paste].
Suggest 5 internal links from the article to existing pages, with anchor text,
and 3 existing pages that should link to the new article.
```

Check the winners in the [SERP Snippet Preview](/tools/serp-preview) before you publish.

## What are the best prompts for technical SEO?

The best prompts for technical SEO paste the actual error, code, or export and ask for a specific fix.

```
Generate JSON-LD for this page using Article and FAQPage schema.
Only include facts present in this content: [paste]. Do not add ratings or reviews.
```

```
Here is a crawl export of URLs, status codes, and canonicals: [paste].
List the issues by priority and explain each fix in one sentence.
```

```
Write a redirect rule for [Apache / Nginx / Next.js] that sends
[old pattern] to [new pattern]. Explain what it matches and one case it would miss.
```

Always test generated code on a staging site. A confident wrong redirect can remove pages from search.

## What are the best prompts for getting cited by AI answers?

The best prompts for getting cited by AI answers check whether each passage can stand alone.

```
Read this section: [paste]. If an AI engine quoted only this passage,
would it fully answer "[question]"? Rewrite it so the first sentence answers
directly and the passage makes sense with no surrounding context.
```

The reasoning behind this is covered in [generative engine optimization](/guides/generative-engine-optimization).

## How do you stop AI from making things up?

You stop AI from making things up by limiting it to material you provide and by checking its work. Three habits help.

1. Paste your sources and write "use only the information above."
2. Ask the model to mark any claim it is unsure about.
3. Verify every number, name, and quote against a primary source before publishing.

No prompt removes the need for step three. The complete workflow is in [how to use AI for SEO](/guides/how-to-use-ai-for-seo).
