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
  // Paste the verification codes from Google Search Console and Bing Webmaster Tools here.
  verification: { google: "", bing: "" },
  // Public brand profiles. Add each URL as you create it. They feed the Organization schema (sameAs),
  // which is how Google and AI tools connect your profiles to this website.
  social: [] as string[],
  knowsAbout: ["Search engine optimization", "AI SEO", "Generative engine optimization", "Local SEO", "Technical SEO", "Content marketing", "Link building", "Google Business Profile", "AI Overviews"],
  callMinutes: 30,
  // The checklist tool. Paste your checkout link (Payhip, Paddle, or similar) to turn on buying.
  // Keys are issued with: node scripts/issue-license.mjs
  checklist: { price: 67, currency: "USD", freeChecks: 5, checkoutUrl: "" },
  nav: [
    { label: "Services", href: "/services" },
    { label: "AI SEO agency", href: "/ai-seo-agency" },
    { label: "Guides", href: "/guides" },
    { label: "Free tools", href: "/tools" },
    { label: "About", href: "/about" },
  ],
} as const;

export const tools = [
  {
    slug: "seo-checklist",
    name: "SEO Checklist Checker",
    blurb:
      "Enter your website and get an instant report. The first 5 checks are free. Unlock all 94 for one payment.",
  },
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
    key: "Check and fix",
    summary: "Find what is holding your website back, then fix it.",
    items: [
      ["Full website checkup", "We check every page, not a sample. You get a plain-English list of what is broken, what is missing, and what to fix first."],
      ["Website fixes", "Errors, slow pages, broken links, and the behind-the-scenes code Google reads. We fix it on WordPress and Next.js sites."],
      ["Turn visitors into customers", "We review your menus, pages, forms, and buttons and show you what stops people from calling or buying."],
    ],
  },
  {
    key: "Plan",
    summary: "Know what to publish, in what order, and why.",
    items: [
      ["What your customers search for", "A clear list of the searches worth going after, grouped into topics, with a simple calendar of what to publish next."],
      ["What your competitors do", "We study the sites that outrank you and tell you what to copy, what to beat, and what to ignore."],
      ["Ready for Google and AI", "Pages set up so Google ranks them and so ChatGPT, Perplexity, and Google's AI answers can quote them."],
    ],
  },
  {
    key: "Create",
    summary: "Helpful pages and posts, without you writing a word.",
    items: [
      ["Articles and web pages", "Ready-to-publish guides, comparisons, and service pages. A person checks every fact before you see it."],
      ["Pictures that explain", "Diagrams and illustrations made for your pages, sized correctly so your site stays fast."],
      ["Posted for you", "We format each page, check it for mistakes, link it to your other pages, and publish it on your site."],
    ],
  },
  {
    key: "Get known",
    summary: "Earn the mentions that Google and AI trust.",
    items: [
      ["Mentions and links from other sites", "We create things worth linking to, find the right websites, and reach out to them personally. No paid link schemes."],
      ["Local search and Google Maps", "Your Google Business Profile, reviews, local listings, and location pages, so nearby customers find you first."],
      ["Partner and press lists", "Lists of relevant businesses and publications with their public contact details, ready for outreach."],
    ],
  },
  {
    key: "Share and report",
    summary: "Get more from every page, and see what it did.",
    items: [
      ["Simple monthly reports", "What went up, what went down, which pages are close to page one, and what we will do next. No jargon."],
      ["Social media posts", "Each article rewritten properly for X, LinkedIn, Instagram, Facebook, YouTube, Pinterest, and email."],
      ["Email newsletters", "Good-looking emails that display correctly on phones, Gmail, Outlook, and Apple Mail."],
    ],
  },
] as const;

// The five ways people start. `price` is shown when you fill it in, for example "From $490".
export const offers = [
  {
    id: "checkup",
    href: "/services/ai-seo-audit",
    need: "I don't know what is wrong",
    name: "Website Checkup",
    plain: "We check every page of your website and tell you, in plain English, what stops customers from finding you.",
    get: ["Every page checked, not a sample", "A short list of what to fix first, and why", "A call to walk you through it"],
    price: "",
  },
  {
    id: "fix",
    href: "/services/technical-seo",
    need: "My website is broken or slow",
    name: "Fix-It",
    plain: "We repair the problems that hurt your rankings: errors, slow pages, broken links, and missing behind-the-scenes details.",
    get: ["Problems fixed on your live site", "A before and after list of what changed", "Works with WordPress and Next.js sites"],
    price: "",
  },
  {
    id: "grow",
    href: "/services/ai-content-writing",
    need: "I want more customers from Google",
    name: "Monthly Growth",
    plain: "Each month we plan, write, publish, and improve pages so more of the right people find you.",
    get: ["A plan of what to publish and when", "New pages and articles, fact-checked by a person", "Links and mentions from other websites", "A simple monthly report"],
    price: "",
  },
  {
    id: "local",
    href: "/services/local-seo",
    need: "I need more local customers",
    name: "Local Boost",
    plain: "We help you show up on Google Maps and in \"near me\" searches, ahead of nearby competitors.",
    get: ["Google Business Profile set up properly", "A simple way to earn more reviews", "Your name, address, and phone matching everywhere", "Pages for the areas you serve"],
    price: "",
  },
  {
    id: "ai",
    href: "/services/ai-search-optimization",
    need: "I want ChatGPT to recommend me",
    name: "AI Visibility",
    plain: "We set up your website so ChatGPT, Perplexity, and Google's AI answers can understand it, trust it, and mention it.",
    get: ["A check of what AI tools say about you today", "Pages rewritten so AI can quote them", "The technical setup AI tools read", "Monthly tracking of your mentions"],
    price: "",
  },
] as const;

export const abs = (path = "/") => `${site.url}${path === "/" ? "" : path}`;
