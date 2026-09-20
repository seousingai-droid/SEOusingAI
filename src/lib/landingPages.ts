export type Landing = {
  slug: string; nav: string; eyebrow: string; metaTitle: string; description: string;
  h1: string; h1Mark: string; lede: string;
  quickQ: string; quickA: string;
  sections: { h: string; p: string[]; list?: string[]; ordered?: boolean }[];
  table?: { caption: string; head: string[]; rows: string[][] };
  services: string[];
  faqs: { q: string; a: string }[];
};

export const landingPages: Landing[] = [
  {
    slug: "ai-seo-agency", nav: "AI SEO agency", eyebrow: "AI SEO agency",
    metaTitle: "AI SEO Agency: AI Speed, Human Judgment",
    description: "SEO Using AI is an AI SEO agency for small and mid-sized businesses. AI does the volume work, a person checks everything, and you get a fixed price up front.",
    h1: "An AI SEO agency with a", h1Mark: "person checking everything",
    lede: "AI does the heavy lifting so the work is fast and affordable. A real person reviews every deliverable so it is right.",
    quickQ: "What is an AI SEO agency?",
    quickA: "An AI SEO agency is a search marketing company that uses AI tools to do the time-consuming parts of SEO, such as checking every page of a website, researching what customers search for, drafting content, and building reports, while people handle strategy, fact-checking, and client decisions. A good AI SEO agency also works on AI search, meaning it helps a business get mentioned by ChatGPT, Perplexity, and Google's AI answers, not only ranked on Google.",
    sections: [
      { h: "How is an AI SEO agency different from a traditional one?", p: ["An AI SEO agency differs from a traditional agency in how the hours are spent. In a traditional agency, much of the monthly fee pays for manual work: crawling sites, building spreadsheets, writing first drafts, and formatting reports. AI now does those jobs in minutes.", "That shift should show up in two places. You should get more finished work for the same budget, and a larger share of human time should go into the parts that need judgment: choosing what to do, checking that it is true, and making it sound like your business."] },
      { h: "How do you choose an AI SEO agency?", p: ["Choose an AI SEO agency by asking how it uses AI, who checks the output, and how it reports results. These seven questions separate careful agencies from content mills."], ordered: true, list: [
        "Who reviews the AI's work before it reaches my website? The answer should be a named role, not \"the system\".",
        "How do you check facts and statistics? Look for a rule that every number is verified at its source.",
        "Do you publish unedited AI content? The only safe answer is no.",
        "What exactly will I receive each month? Ask for deliverables, not hours.",
        "How do you measure results in AI tools like ChatGPT? A real answer involves a fixed list of test questions tracked monthly.",
        "Do you guarantee rankings? Anyone who says yes is either guessing or misleading you.",
        "Can I leave whenever I want? Long lock-in contracts usually protect the agency, not you.",
      ] },
      { h: "What does SEO Using AI do differently?", p: ["SEO Using AI runs fifteen specialist AI workflows, one for each job in SEO, and puts one review gate in front of all of them. Nothing reaches your website until a person has checked it. Every statistic we publish is verified on its source page. Prices are fixed and agreed before work starts, and there are no long contracts."] },
      { h: "Who do we work with?", p: ["We work with small and mid-sized businesses across the United States, entirely online. That includes local service businesses, online stores, software companies, professional firms, and other agencies that need delivery capacity. Calls happen on Google Meet."] },
    ],
    table: { caption: "Traditional SEO agency compared with an AI SEO agency", head: ["", "Traditional agency", "AI SEO agency done well"], rows: [
      ["Site audits", "A sample of pages, checked by hand", "Every page, checked by AI, reviewed by a person"],
      ["Content", "A few pieces a month", "More pieces, each fact-checked by a person"],
      ["Reports", "Built by hand, often late", "Generated fast, explained in plain English"],
      ["Where human time goes", "Spreadsheets and first drafts", "Strategy, accuracy, and your brand voice"],
      ["AI search (ChatGPT, Perplexity)", "Often not covered", "Measured and worked on monthly"],
    ] },
    services: ["ai-seo-audit", "technical-seo", "ai-content-writing", "link-building", "local-seo", "ai-search-optimization"],
    faqs: [
      { q: "How much does an AI SEO agency cost?", a: "Costs vary with the size of the website and the amount of work. At SEO Using AI you get a fixed price in writing after a free call, before anything starts. There are no packages of hours and no long contracts." },
      { q: "Is an AI SEO agency safe for my website?", a: "It is safe when a person reviews everything. The risk comes from agencies that publish unedited AI content in bulk, which Google's spam policies target. Ask any agency who checks the work." },
      { q: "Where is SEO Using AI based?", a: "SEO Using AI is a remote studio that works online with businesses across the United States. Everything happens by email and Google Meet." },
      { q: "Do you work with other agencies?", a: "Yes. Agencies can hand us audits, content, reporting, and technical fixes to deliver under their own brand." },
    ],
  },
  {
    slug: "ai-seo-for-small-business", nav: "AI SEO for small business", eyebrow: "For small businesses",
    metaTitle: "AI SEO for Small Business: A Plain-English Guide",
    description: "AI SEO for small business, explained simply: what it is, five things to do first, what to skip, and when it makes sense to get help. No jargon.",
    h1: "AI SEO for small business,", h1Mark: "without the jargon",
    lede: "You do not need a marketing department. You need to show up when nearby customers search, and AI makes that affordable.",
    quickQ: "What is AI SEO for small business?",
    quickA: "AI SEO for small business means using AI tools to do the search marketing work a small company could never afford to do by hand. AI can check your whole website, find the questions your customers type into Google, draft helpful pages, and write your monthly report. A person still needs to check the facts and add what is true about your business. The goal is simple: more calls, bookings, and sales from Google, Google Maps, and AI assistants.",
    sections: [
      { h: "Why does AI SEO suit small businesses?", p: ["AI SEO suits small businesses because it removes the biggest barrier, which is cost. Most of what an agency used to bill for was labor: reading pages, building lists, and writing first drafts. AI does that work in minutes, so a small budget now goes much further.", "It also helps with time. Most owners know they should update their website and never get to it. With AI handling the drafting, your part shrinks to answering a few questions and approving the result."] },
      { h: "What should a small business do first?", p: ["A small business should start with the free basics before spending anything. These five steps cover most of the early gains."], ordered: true, list: [
        "Claim and complete your free Google Business Profile. Add your services, hours, photos, and service area.",
        "Make sure your name, address, and phone number are identical everywhere online.",
        "Ask every happy customer for a Google review, and reply to each one.",
        "Give each service its own page on your website that says what it is, who it is for, what it costs or how pricing works, and how to book.",
        "Write down the ten questions customers ask you most, and answer each one on your website. AI can draft these in minutes. You check the facts.",
      ] },
      { h: "What should a small business skip?", p: ["A small business should skip anything that promises a shortcut. That includes buying links, paying for fake reviews, publishing dozens of unedited AI articles, and chasing broad national keywords you cannot win. Each of these either breaks Google's rules or wastes money. Steady, honest work on your own area and your own services beats all of them."] },
      { h: "When should you get help?", p: ["Get help when the basics are done and you have run out of time or technical skill. Common trigger points are a website that is slow or throwing errors, a competitor who keeps outranking you on the map, or the realization that you have not added a new page in a year. A one-time website checkup is the lowest-risk way to start, because you get a clear list whether or not you hire anyone afterward."] },
    ],
    services: ["ai-seo-audit", "local-seo", "ai-content-writing", "technical-seo"],
    faqs: [
      { q: "Can a small business do AI SEO without an agency?", a: "Yes. A small business can do a lot with a free AI tool, a Google Business Profile, and Google Search Console. Our free guides show the steps. Help becomes worthwhile when you lack the time or the technical skill for the next step." },
      { q: "How long does SEO take for a small business?", a: "Some changes, such as completing a Google Business Profile, can show results within weeks. New website pages commonly take a few months to settle in Google. Anyone promising instant results is not being straight with you." },
      { q: "Is AI SEO expensive?", a: "AI SEO is usually less expensive than traditional SEO because AI does much of the manual work. You can also start for free with the steps on this page." },
      { q: "Will AI tools like ChatGPT recommend my small business?", a: "They can. AI tools mention businesses they can find clear, consistent information about, especially on trusted third-party sites such as review platforms and local directories. Clear website pages, steady reviews, and consistent details all help." },
    ],
  },
  {
    slug: "ai-seo-for-b2b", nav: "AI SEO for B2B", eyebrow: "For B2B companies",
    metaTitle: "AI SEO for B2B: Be the Vendor AI Recommends",
    description: "AI SEO for B2B companies: get found when buyers research on Google and ask AI tools for vendor shortlists. Comparison pages, proof, and clear answers.",
    h1: "AI SEO for B2B: be on the shortlist", h1Mark: "before sales hears about it",
    lede: "B2B buyers research quietly, and more of them now start by asking an AI tool. We help you show up in both places.",
    quickQ: "What is AI SEO for B2B?",
    quickA: "AI SEO for B2B is search optimization for companies that sell to other businesses, carried out with AI tools and aimed at both Google and AI assistants. B2B purchases involve long research, several decision makers, and detailed comparison. AI SEO for B2B focuses on the pages those buyers actually use: comparison pages, pricing explanations, integration and use-case pages, and clear answers that AI tools can quote when someone asks for a vendor shortlist.",
    sections: [
      { h: "Why is B2B SEO different?", p: ["B2B SEO is different because the buyer is rarely one person and rarely in a hurry. Several people research over weeks or months, and most of that happens before anyone contacts sales. Search volumes are small, but each visitor can be worth a great deal.", "That changes the goal. A B2B site does not need huge traffic. It needs to be present and convincing at each step of a long decision: the problem, the options, the comparison, and the business case."] },
      { h: "How are B2B buyers using AI?", p: ["B2B buyers use AI tools to shorten research. They ask for vendor shortlists, comparisons, and summaries of what customers say. The AI answer is built from whatever clear, trustworthy text exists about each vendor, on the vendor's own site and on review sites, communities, and publications.", "If your website hides pricing logic, avoids naming competitors, and describes the product in slogans, AI tools have little to quote. Vendors that explain themselves plainly get described accurately."] },
      { h: "Which pages matter most for B2B?", p: ["The pages that matter most for B2B are the ones buyers use to decide."], list: [
        "Comparison pages: you versus each main alternative, written fairly.",
        "Alternatives pages: for buyers leaving a competitor.",
        "Pricing explained: even if you cannot list prices, explain how pricing works.",
        "Use-case and industry pages: one page per real situation you serve.",
        "Integration pages: one per tool you connect with.",
        "Proof: case studies with real numbers, and only real ones.",
      ] },
      { h: "How do we approach B2B AI SEO?", p: ["We start by listing the questions your buyers ask at each stage, then test those questions in Google and in the main AI tools to see who shows up. The gaps become the content plan. AI drafts from your real product knowledge, a person checks every claim, and subject experts on your side approve anything technical. We then track both rankings and AI mentions monthly."] },
    ],
    services: ["ai-search-optimization", "ai-content-writing", "ai-seo-audit", "link-building"],
    faqs: [
      { q: "Does AI SEO work for niche B2B products with low search volume?", a: "Yes. Low search volume is normal in B2B, and a handful of the right visitors can be worth more than thousands of casual ones. The focus is on high-intent pages such as comparisons and use cases, not on traffic totals." },
      { q: "Should a B2B company write comparison pages that name competitors?", a: "Yes, when they are fair and accurate. Buyers search for comparisons anyway, and AI tools quote them. If you do not publish one, the only version of the comparison is the one your competitor wrote." },
      { q: "How do you measure B2B SEO results?", a: "We measure qualified enquiries and pipeline influenced by organic search where your tracking allows it, plus rankings for decision-stage searches and monthly mentions in AI tools for a fixed list of buyer questions." },
    ],
  },
];
export const getLanding = (slug: string) => landingPages.find((l) => l.slug === slug)!;
