// Single source of truth for brand facts. Edit here, not in components.
export const site = {
  name: "SEO Using AI",
  domain: "seousingai.com",
  url: "https://seousingai.com",
  tagline: "Rank on Google and get cited by AI answers",
  description:
    "SEO Using AI is a free, plain-English resource for doing SEO with AI: step-by-step guides, tested prompts, tool comparisons, and free tools for ranking on Google and getting cited by ChatGPT, Perplexity, and AI Overviews.",
  email: "hello@seousingai.com",
  locale: "en_US",
  founded: "2026",
  author: {
    name: "John Abala",
    role: "Founder and editor",
    bio: "John is a long-time WordPress developer and SEO practitioner. He builds and ranks websites, and uses AI models every day for research, briefs, audits, and technical fixes. SEO Using AI is where he documents what works.",
    url: "https://seousingai.com/about",
    sameAs: ["https://github.com/xBalzerian"],
  },
  nav: [
    { label: "Start here", href: "/guides/how-to-use-ai-for-seo" },
    { label: "Guides", href: "/guides" },
    { label: "AI SEO tools", href: "/guides/best-ai-seo-tools" },
    { label: "Free tools", href: "/tools" },
    { label: "About", href: "/about" },
  ],
} as const;

export const tools = [
  {
    slug: "serp-preview",
    name: "SERP Snippet Preview",
    blurb:
      "See how your title and meta description look in Google, with live pixel-safe length checks.",
  },
  {
    slug: "ai-seo-prompt-builder",
    name: "AI SEO Prompt Builder",
    blurb:
      "Build a structured prompt for keyword research, briefs, audits, or meta tags. Paste it into any AI model.",
  },
  {
    slug: "llms-txt-generator",
    name: "llms.txt Generator",
    blurb:
      "Create an llms.txt file that tells AI crawlers what your site is and which pages matter.",
  },
] as const;

export const abs = (path = "/") => `${site.url}${path === "/" ? "" : path}`;
