// Single source of truth for brand facts. Edit here, not in components.
export const site = {
  name: "SEO Using AI",
  domain: "seousingai.com",
  url: "https://seousingai.com",
  tagline: "Rank on Google and get cited by AI answers",
  description:
    "SEO Using AI helps businesses rank on Google and get cited by ChatGPT, Perplexity, and AI Overviews, through free step-by-step guides, prompts, and tools, and through done-for-you AI SEO services reviewed by a person.",
  email: "hello@seousingai.com",
  locale: "en_US",
  founded: "2026",
  // Content is published under the brand, not a named person.
  editorial: { name: "SEO Using AI Editorial Team", url: "https://seousingai.com/editorial-standards" },
  // Paste your Google Calendar appointment schedule link here to turn on live booking.
  // Google Calendar > Create > Appointment schedule > set Google Meet as the location > Share > copy the booking page link.
  bookingUrl: "",
  callMinutes: 30,
  nav: [
    { label: "Services", href: "/services" },
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

export const services = [
  {
    key: "Audit and fixes",
    summary: "Find what is holding the site back, then fix it in the code.",
    items: [
      ["Full-site SEO audit", "Every page crawled, not a sample. Titles, metas, headings, broken links, redirects, canonicals, indexability, schema, and thin content, delivered as a prioritized report."],
      ["WordPress and Next.js fixes", "Errors, plugin conflicts, redirects, schema, meta tags, and Core Web Vitals issues fixed at the code level."],
      ["Conversion review", "Fonts, spacing, readability, and every page area checked for what stops visitors from buying or enquiring."],
    ],
  },
  {
    key: "Strategy",
    summary: "Decide what to publish, in what order, and why.",
    items: [
      ["Keyword and content strategy", "Queries worth targeting, grouped by intent into topic clusters, with a content calendar that says what to publish next."],
      ["Competitor analysis", "What rivals rank for that you do not, how their sites are built, and what to copy, beat, or ignore."],
      ["SEO and AI answer optimization", "Pages structured to rank on Google and to be quoted by ChatGPT, Perplexity, Gemini, and AI Overviews."],
    ],
  },
  {
    key: "Content",
    summary: "Publish pages that deserve to rank, without the production drag.",
    items: [
      ["Article and page writing", "Publish-ready guides, comparisons, and landing pages with metadata, FAQs, and schema built in. Every fact checked by a person."],
      ["Images that explain", "Diagrams and illustrations made for the page, sized to the placement, compressed, and named for search."],
      ["Publishing and internal links", "Posts formatted, checked for errors, linked to related pages, and published to your site."],
    ],
  },
  {
    key: "Authority",
    summary: "Earn the mentions that Google and AI engines trust.",
    items: [
      ["Digital PR and link outreach", "Linkable assets such as original data and free tools, qualified prospects, and personal outreach. No paid link schemes."],
      ["Local SEO", "Google Business Profile, reviews, citations, location pages, and LocalBusiness schema for map pack and local results."],
      ["Prospect research", "Lists of relevant businesses and publications with verified public contact details, built for partnerships and outreach."],
    ],
  },
  {
    key: "Reporting",
    summary: "Know what changed, what it did, and what happens next.",
    items: [
      ["Performance reports", "Search Console and GA4 data turned into a plain monthly report: wins, losses, near-miss keywords, and next actions."],
      ["Social repurposing", "Each article rewritten natively for X, LinkedIn, Instagram, Facebook, YouTube, Pinterest, and email."],
      ["Email design", "Mobile-ready HTML emails that render correctly in Gmail, Outlook, Apple Mail, and dark mode."],
    ],
  },
] as const;

export const abs = (path = "/") => `${site.url}${path === "/" ? "" : path}`;
