// The SEO tips library: one page per animated video, with the method written out in
// full, so the page is useful without watching and easy for Google and AI tools to quote.
// Videos and posters live in /public/videos/tips/<slug>.mp4 and .webp.

export type SeoTip = {
  slug: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  title: string; // the H1
  metaTitle: string; // 45 characters or fewer: the site name is added after it
  description: string;
  answer: string; // the quick answer, first thing on the page
  steps: { h: string; p: string }[];
  why: string;
  mistakes: string[];
  faqs: { q: string; a: string }[];
  transcript: string[];
  seconds: number;
  uploaded: string; // ISO date the video was published
  service: { href: string; label: string };
};

export const seoTips: SeoTip[] = [
  {
    slug: "page-two-gold",
    level: "Advanced",
    title: "How to find your fastest SEO wins in Google Search Console",
    metaTitle: "Page Two Gold: Find Your Fastest SEO Wins",
    description: "Find searches where you rank 8 to 20 in Google Search Console, then move those pages to page one with a matching heading, a direct answer and internal links.",
    answer: "Your fastest SEO wins are searches where you already rank on page two, positions 8 to 20, with lots of impressions. Google already sees the page as relevant, so small changes can lift it onto page one: add the exact search as a heading, answer it in the first two sentences, and link to the page from your strongest pages.",
    steps: [
      { h: "Find searches ranking 8 to 20", p: "In Google Search Console, open Performance, then Search results. Turn on Average position, open the Queries tab and sort by position, or export the table to a spreadsheet and filter it to positions 8 to 20. Keep the searches with the most impressions: people already see you there, they just are not clicking. Click a search, then the Pages tab, to see which page ranks for it." },
      { h: "Add the exact question as a heading and answer it first", p: "Open that page and add the search, phrased the way people ask it, as a subheading (an H2). Put a direct answer in the first one or two sentences under it, with the specific fact people want, such as a price range, a time, or a yes or no. Then add the detail. Google and AI tools lift short, self-contained answers like this into results and summaries." },
      { h: "Link to it from your strongest pages", p: "In Search Console, open Links and check Top linked pages. Your homepage and your most-linked guides carry the most authority. Add a link from each of them to the page you are lifting, using the search phrase, or a close variation, as the link text instead of words like click here." },
    ],
    why: "Pages on page two already pass Google's relevance test for that search. They usually fall short on how directly they answer it, or on how much authority points at them. The heading and the answer fix the first; internal links fix the second. Both are changes you control, unlike links from other websites.",
    mistakes: [
      "Chasing searches at position 40 or 50, where the page is not really relevant yet",
      "Changing the title and the URL at the same time, so you cannot tell what worked",
      "Repeating the phrase in every paragraph instead of answering it once, clearly",
      "Judging after two days. Give it two to four weeks, then compare in Search Console",
    ],
    faqs: [
      { q: "What is a striking distance keyword?", a: "A search where your page already ranks just off page one, usually positions 8 to 20. It is called striking distance because a small improvement can move it onto page one, where most clicks happen." },
      { q: "How long does it take to see a change?", a: "Google has to recrawl the page first, which you can request with the URL Inspection tool in Search Console. Then compare the page's average position over the next two to four weeks with the weeks before." },
    ],
    transcript: [
      "Your fastest SEO win is hiding on page two. Here's how to dig it up.",
      "One. In Search Console, filter for searches ranking eight to twenty, with lots of impressions.",
      "Two. Add that exact question as a heading, and answer it in the first two sentences.",
      "Three. Link to that page from your strongest pages, using the search as the link text.",
      "Small edits that can move page two onto page one.",
    ],
    seconds: 23,
    uploaded: "2026-09-28",
    service: { href: "/services/managed-website-seo", label: "Website + SEO, Managed" },
  },
  {
    slug: "one-page-wins",
    level: "Advanced",
    title: "Keyword cannibalization: how to find and fix pages that compete",
    metaTitle: "Keyword Cannibalization: Find and Fix It",
    description: "When two of your pages chase the same search, both can rank worse. Find the clash in Search Console, merge the pages, and 301 redirect the weaker one.",
    answer: "Keyword cannibalization is when two or more of your pages target the same search, so Google splits its attention and often ranks both lower. To fix it, find searches where Search Console shows more than one of your pages, merge the best content into the stronger page, 301 redirect the weaker page to it, and update your internal links.",
    steps: [
      { h: "Find the clash in Search Console", p: "Open Performance, then Search results, and add a filter for the search you care about (Query, exact). Then open the Pages tab. If two or more of your pages appear, and the position swings between them from week to week, they are competing. Not every overlap is a problem: if the pages answer genuinely different questions, make that difference clearer instead of merging." },
      { h: "Merge the best parts into the stronger page", p: "Choose the page with more clicks, more links pointing to it and the better address. Move over anything useful from the weaker page, such as prices, FAQs, photos or examples, so the combined page is the most complete answer to that search. Keep the stronger page's URL." },
      { h: "301 redirect the weaker page and update your links", p: "Set up a permanent 301 redirect from the weaker page's address to the stronger one. It sends visitors there and tells Google the two pages are now one. Then point your menu, footer and in-text links straight at the stronger page, and remove the old address from your sitemap." },
    ],
    why: "Links, clicks and relevance that were split across two pages come together on one. Google no longer has to guess which page to show, and the merged page is more complete than either was on its own.",
    mistakes: [
      "Deleting the weaker page without a redirect, which throws away its links and sends visitors to an error",
      "Using a temporary 302 redirect instead of a permanent 301",
      "Merging pages that answer different questions, like a service page and a how-to guide",
      "Leaving old internal links in place, so your own site keeps pointing at the redirect",
    ],
    faqs: [
      { q: "Is keyword cannibalization always bad?", a: "No. Two pages can rank for the same search if they serve different needs, and Google sometimes shows both. It becomes a problem when neither ranks well and the position keeps swapping between them." },
      { q: "What is a 301 redirect?", a: "A permanent redirect. Anyone who opens the old address is sent to the new one, and search engines treat the new page as the replacement. On WordPress a redirect plugin can set it up; on Next.js or Vercel, the project's redirect settings." },
    ],
    transcript: [
      "Two of your pages chasing the same search can hold each other back. Here's the three-step fix.",
      "One. In Search Console, open the search, then the Pages tab. Two pages listed? That's the clash.",
      "Two. Merge the best parts into the stronger page.",
      "Three. Redirect the weaker page with a three-oh-one, and update your internal links.",
      "One strong page beats two weak ones.",
    ],
    seconds: 22,
    uploaded: "2026-09-28",
    service: { href: "/services/technical-seo", label: "Technical SEO Fixes" },
  },
  {
    slug: "win-the-click",
    level: "Intermediate",
    title: "How to write page titles that win the click on Google",
    metaTitle: "Page Titles That Win the Click on Google",
    description: "Rank but get few clicks? Rewrite the page title: search words first, a real reason to click, and about 60 characters so Google does not cut it off.",
    answer: "If your page shows up on Google but few people click, the title is usually the problem. Put the words people search at the start, add a concrete reason to click, such as open now, a price or free quotes, and keep it to about 60 characters so Google does not cut it off.",
    steps: [
      { h: "Put the search words first", p: "Check which searches the page appears for in Search Console, then start the title with that phrase. People scan results in a second, and seeing their own words first tells them this page answers their search." },
      { h: "Add a reason to click", p: "Add one specific, true benefit that the other results lack: open now, same day, a starting price, free quotes, a year or a number. Look at the other titles on the results page and make yours the one with the clearest reason." },
      { h: "Keep it around 60 characters", p: "Google shortens titles that are too wide for the results page, which is roughly 50 to 60 characters. Put your brand name last, or drop it, so the important words are never the ones cut. Write a matching meta description too: it is not a ranking factor, but it helps people decide." },
    ],
    why: "Clicks are the point of ranking. A clearer title can bring more visitors from the same position, without moving up a single spot.",
    mistakes: [
      "Starting every title with your business name",
      "Using the same title on several pages",
      "Promising something the page does not deliver, which leads to quick exits",
      "Assuming Google always shows your title. It sometimes rewrites it, so make the page's main heading match",
    ],
    faqs: [
      { q: "Does Google always use my page title?", a: "Not always. Google may rewrite a title if another line on the page describes it better, often the main heading. Titles that are accurate, concise and match the heading are rewritten less often." },
      { q: "How long should an SEO title be?", a: "Around 50 to 60 characters. Google cuts titles by pixel width rather than by character count, so put the important words first and nothing important gets cut." },
    ],
    transcript: [
      "Showing up on Google, but nobody clicks? Fix your title in three steps.",
      "One. Put the words people search at the very front.",
      "Two. Add a reason to click, like open now or free quotes.",
      "Three. Keep it under sixty characters, so nothing gets cut off.",
      "Same ranking. More clicks. More customers.",
    ],
    seconds: 20,
    uploaded: "2026-09-28",
    service: { href: "/services/ai-content-writing", label: "AI Content Writing" },
  },
  {
    slug: "get-recommended-by-ai",
    level: "Intermediate",
    title: "How to get recommended by ChatGPT and AI search",
    metaTitle: "How to Get Recommended by ChatGPT and AI",
    description: "AI tools quote clear, consistent sources. Answer real questions first, get mentioned on sites AI trusts, and keep your business facts the same everywhere.",
    answer: "AI tools like ChatGPT, Perplexity and Google's AI Overviews recommend businesses they can find, understand and trust. Answer real customer questions plainly at the top of your pages, get mentioned on websites these tools already rely on, and keep your name, services and prices the same everywhere they appear.",
    steps: [
      { h: "Answer real questions in plain words, first", p: "Take the questions customers ask on calls and put each one on your site as a heading, with a direct answer of one or two sentences underneath. AI tools pull short, self-contained passages, so an answer that makes sense on its own is the one that gets quoted." },
      { h: "Get mentioned on sites AI already trusts", p: "AI search tools run web searches and read the pages that rank. Being mentioned on those pages, such as local news, industry directories, review sites and well-known blogs, puts your name in what they read. Ask ChatGPT or Perplexity your customers' questions and note the sources they cite: those are your targets." },
      { h: "Keep your facts the same everywhere", p: "Your business name, phone, address, services and prices should match on your website, Google Business Profile, social profiles and directories. Add Organization or LocalBusiness structured data to your site. Conflicting facts make AI tools less confident, and less likely to name you." },
    ],
    why: "AI answers are built from sources the tool can retrieve and cross-check. Clear answers make you easy to quote, mentions make you easy to find, and consistent facts make you safe to recommend.",
    mistakes: [
      "Hiding answers under long introductions or behind forms",
      "Blocking AI crawlers in robots.txt by accident",
      "Different prices or phone numbers on different sites",
      "Vague marketing copy, like quality solutions, instead of specific facts",
    ],
    faqs: [
      { q: "How do I check whether AI tools mention my business?", a: "Ask ChatGPT, Perplexity and Google the questions your customers ask, such as best plumber near me, and note who gets named and which sources are cited. Repeat it monthly, because answers change." },
      { q: "Does SEO still matter for AI search?", a: "Yes. AI search tools rely on web search results, so pages that rank and are easy to read are the ones most likely to be retrieved and quoted." },
    ],
    transcript: [
      "Want ChatGPT to recommend your business? Here's how.",
      "One. Answer real questions in plain words, right at the top.",
      "Two. Get mentioned on sites the AI already trusts.",
      "Three. Keep your name, services and prices the same everywhere.",
      "Clear facts get quoted. Vague pages get skipped.",
    ],
    seconds: 19,
    uploaded: "2026-09-27",
    service: { href: "/services/ai-search-optimization", label: "AI Search Optimization" },
  },
  {
    slug: "rank-on-google-maps",
    level: "Beginner",
    title: "How to rank higher on Google Maps",
    metaTitle: "How to Rank Higher on Google Maps",
    description: "Google ranks Maps results on relevance, distance and prominence. Complete your Business Profile, ask every happy customer for a review, and post photos weekly.",
    answer: "Google ranks local results on three things: relevance, distance and prominence. You cannot move closer to the searcher, but you can improve the other two: fill in every part of your Google Business Profile, get a steady flow of genuine reviews, and keep the profile active with new photos and posts.",
    steps: [
      { h: "Complete every part of your Business Profile", p: "Choose the most specific primary category, since it shapes which searches you appear for, then add secondary categories. Fill in services, service areas, hours, holiday hours, attributes and a description that says what you do and where. Every empty field is a missed chance to match a search." },
      { h: "Ask every happy customer for a review", p: "Send your review link by text or email right after the job, when the customer is happiest. Reply to every review, good and bad. Never offer discounts or gifts for reviews: Google's policies ban incentivized reviews, and they can be removed." },
      { h: "Add fresh photos and posts every week", p: "Upload real photos of your work, your team and your premises, and publish posts for offers, updates and events. Regular activity keeps the profile complete and current, and gives searchers more reasons to choose you." },
    ],
    why: "Relevance comes from categories, services and descriptions that match the search. Prominence comes from reviews, activity and how well known you are online. Both are signals you control.",
    mistakes: [
      "A broad primary category, like contractor, instead of plumber",
      "Adding keywords or city names to your business name, which breaks Google's guidelines",
      "Buying or incentivizing reviews",
      "Setting the profile up once and never touching it again",
    ],
    faqs: [
      { q: "How long does it take to rank higher on Google Maps?", a: "Changes to categories and details can show up within days. Reviews and prominence build over months, so steady effort beats bursts of activity." },
      { q: "Do Google Business Profile posts help rankings?", a: "Google does not list posts as a ranking factor. They keep your profile current and give searchers reasons to choose you, which helps you win the call once you appear." },
    ],
    transcript: [
      "Want more calls from Google Maps? Do these three things.",
      "One. Fill in every part of your Google Business Profile.",
      "Two. Ask every happy customer for a review.",
      "Three. Add fresh photos and posts every week.",
      "That's how you climb into the top three on the map.",
    ],
    seconds: 16,
    uploaded: "2026-09-27",
    service: { href: "/services/local-seo", label: "Local SEO" },
  },
  {
    slug: "turn-visits-into-calls",
    level: "Beginner",
    title: "How to turn website visitors into calls",
    metaTitle: "How to Turn Website Visitors Into Calls",
    description: "Visitors but no calls? Say what you do and where in the first line, put a big call button where the thumb lands, and show real reviews right next to it.",
    answer: "If people visit your website but do not call, fix three things: say what you do and where you do it in the first line, put a large tap-to-call button where the thumb rests on a phone, and show real reviews right next to that button, where people make the decision.",
    steps: [
      { h: "Say what you do and where, in the first line", p: "Replace a headline like Welcome to our website with your service and location, such as Emergency plumber in Austin, plus one line on why you: open 24/7, arrival time or a starting price. Visitors decide in seconds whether they are in the right place." },
      { h: "Put a big call button where the thumb lands", p: "Most local visitors are on a phone. Add a large button that starts a call when tapped, low on the screen where it is easy to reach, and keep it visible as people scroll. A small contact us link at the top is easy to miss." },
      { h: "Show real reviews next to that button", p: "Put two or three short, genuine reviews beside the call button, with star ratings and first names or towns where customers agree to it. Trust is needed at the moment of decision, not on a separate testimonials page." },
    ],
    why: "Each fix removes a reason to leave: confusion, effort or doubt. Together they turn the same traffic into more calls, which is often cheaper than finding more visitors.",
    mistakes: [
      "Phone numbers as plain text that cannot be tapped",
      "Pop-ups that cover the call button on phones",
      "Stock photos and made-up testimonials",
      "Sending phone visitors to a long form instead of a call",
    ],
    faqs: [
      { q: "What is a good conversion rate for a service business website?", a: "It varies by industry, but many service sites turn a few percent of visitors into enquiries. The useful measure is your own rate before and after each change." },
      { q: "How do I make a phone number tap to call?", a: "Link it with tel: followed by the full number, for example tel:+15125550142. On a phone, tapping it opens the dialer with the number filled in." },
    ],
    transcript: [
      "People visit your website, but nobody calls? Fix three things.",
      "One. Say what you do and where, in the very first line.",
      "Two. Put a big call button right where the thumb lands.",
      "Three. Show real reviews right next to that button.",
      "Clear, easy, trusted. That's how visitors become customers.",
    ],
    seconds: 19,
    uploaded: "2026-09-27",
    service: { href: "/services/website-redesign", label: "Website Redesign for Conversion" },
  },
  {
    slug: "one-answer-five-posts",
    level: "Beginner",
    title: "How to turn one answer into a week of social posts",
    metaTitle: "Turn One Answer Into a Week of Posts",
    description: "No time for social media? Write one helpful answer to a customer question, turn it into a reel, carousel, tip, quote and story, and schedule the week at once.",
    answer: "Write one helpful answer to a question customers ask, then turn it into five formats: a short reel, a carousel, a tip, a quote and a story. Schedule all five in one sitting with a scheduling tool, and one idea becomes a week of posts.",
    steps: [
      { h: "Write one helpful answer", p: "Pick a question customers really ask, such as how much does a pipe repair cost, and answer it in a few short paragraphs: the direct answer, what changes it, and what to do next. Publish it on your website first, so every post can link back to it." },
      { h: "Turn it into five posts", p: "Reel: the answer in 15 to 20 seconds, with captions. Carousel: the steps, one per slide. Tip: the single most useful line. Quote: a customer review or a strong sentence from the answer. Story: behind the scenes of doing the job. Write each one for how people use that platform, rather than copying and pasting." },
      { h: "Schedule the week in one sitting", p: "Load the five posts into a scheduler such as Buffer or Meta Business Suite, spread across the week at times your audience is active. Then reply to comments as they come in. That part should stay personal." },
    ],
    why: "The researched idea is the slow part. Reformatting it is fast, each platform gets content that suits it, and every post points back to the same page on your website.",
    mistakes: [
      "Posting the same caption on every platform",
      "Answering questions nobody asks",
      "Scheduling posts and never replying to comments",
      "Posts with no link or next step back to your website",
    ],
    faqs: [
      { q: "How often should a small business post on social media?", a: "Consistency beats volume. Three to five posts a week on the platforms your customers use is plenty for most small businesses." },
      { q: "Which scheduling tool should I use?", a: "Buffer's free plan covers three channels, and Meta Business Suite schedules Facebook and Instagram for free. Start free and upgrade when you outgrow it." },
    ],
    transcript: [
      "No time for social media? Try this three-step shortcut.",
      "One. Write one helpful answer to a question customers ask.",
      "Two. Turn it into five posts: a reel, a carousel, a tip, a quote and a story.",
      "Three. Schedule the whole week in one sitting.",
      "One idea. A week of posts. Your evenings back.",
    ],
    seconds: 20,
    uploaded: "2026-09-28",
    service: { href: "/services/ai-reels-for-business", label: "Social + AI Reels" },
  },
  {
    slug: "seo-strategy-four-steps",
    level: "Beginner",
    title: "A simple SEO strategy in four steps",
    metaTitle: "A Simple SEO Strategy in Four Steps",
    description: "A small business SEO strategy in four steps: find the words customers search, give each question its own page, make the site fast, and earn trusted links.",
    answer: "A workable SEO strategy for a small business has four parts: find the exact words your customers search, give each question its own clear page, make the site fast enough for Google's Core Web Vitals, and earn links from websites people already trust. Then repeat it every month.",
    steps: [
      { h: "Find the words customers search", p: "Start with the Queries report in Google Search Console, Google's autocomplete and the People also ask box. Write down the phrases customers actually use, including prices, places and problems, not just the names of your services." },
      { h: "Give each question its own page", p: "Match each important search to one page on your site, so your pages do not compete with each other. Each page answers its question directly near the top, then goes deeper." },
      { h: "Make the site fast", p: "Check your pages in PageSpeed Insights. Google's Core Web Vitals targets are a Largest Contentful Paint under 2.5 seconds, an Interaction to Next Paint under 200 milliseconds, and a Cumulative Layout Shift under 0.1. Oversized images and heavy plugins are the usual causes." },
      { h: "Earn links from trusted sites", p: "Get listed and mentioned where your customers and your industry already are: suppliers, local associations, sponsorships, local news, and useful guides others want to reference. Avoid bought links, which break Google's spam policies." },
    ],
    why: "Search engines rank pages that match the search, answer it well, load quickly and are referenced by others. These four steps cover each of those, and repeating them builds on last month's work.",
    mistakes: [
      "Targeting only the name of your service instead of the questions people ask",
      "Several pages chasing the same search",
      "Ignoring phones, where most local searches happen",
      "Buying cheap links in bulk",
    ],
    faqs: [
      { q: "How long does SEO take to work?", a: "Usually months rather than weeks, depending on your competition and how much the site needs. Watch impressions and average position in Search Console, since they move before clicks do." },
      { q: "Can I do SEO myself?", a: "Yes. Start with these four steps and our free guides. Many owners handle the basics and hire help for technical fixes or ongoing content." },
    ],
    transcript: [
      "Can't find your business on Google? Fix it in four steps.",
      "One. Find the exact words your customers search.",
      "Two. Answer each question on its own clear page.",
      "Three. Make your site fast, so Google can read it.",
      "Four. Earn links from sites people trust.",
      "Repeat every month, and watch yourself climb.",
    ],
    seconds: 20,
    uploaded: "2026-09-27",
    service: { href: "/services/managed-website-seo", label: "Website + SEO, Managed" },
  },
];

/** The rendered file for each tip, named after the episode in the video project. */
export const tipVideo: Record<string, string> = {
  "page-two-gold": "page-two-gold",
  "one-page-wins": "one-page-wins",
  "win-the-click": "win-the-click",
  "get-recommended-by-ai": "ai-search",
  "rank-on-google-maps": "local-maps",
  "turn-visits-into-calls": "more-calls",
  "one-answer-five-posts": "one-to-five",
  "seo-strategy-four-steps": "seo-strategy",
};

export const getSeoTip = (slug: string) => seoTips.find((t) => t.slug === slug);
export const videoSrc = (slug: string) => `/videos/tips/${tipVideo[slug]}.mp4`;
export const posterSrc = (slug: string) => `/videos/tips/${tipVideo[slug]}.webp`;
