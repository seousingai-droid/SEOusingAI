# Hosting and data: GitHub, Supabase, Vercel

## The short version

GitHub and Vercel are the right choices and you need them now. Supabase is the right database when you need one, but the app does not need one to launch. Launch first, add Supabase at the trigger below.

There is no Anthropic or Claude product for storing application data. Claude writes and runs the code; it is not a database. Supabase is the store.

## Stage 1: launch (do this first, about an hour)

1. **GitHub.** Push this repository to https://github.com/seousingai-droid/SEOusingAI. The remote is already set.
2. **Vercel.** Sign in with GitHub, import the repo, accept the defaults. Next.js needs no configuration.
3. **Environment variables**, set in Vercel under Settings, Environment Variables:
   - `LICENSE_SECRET` and `AUTH_SECRET`: copy the values from your local `.env.local` (the names are listed in `.env.example`). Never change them afterwards, or every licence key and every signed-in session stops working.
   - `LEAD_WEBHOOK_URL` (optional): a Kit, Mailchimp, Zapier, or Formspree endpoint. Without it, people can sign in but their email is not collected anywhere.
4. **Domain.** Add seousingai.com in Vercel and point the DNS as it instructs. Redirect www to the apex.
5. **Search Console and Bing.** Verify the domain, paste the codes into `verification` in `src/lib/site.ts`, and submit `/sitemap.xml`.

What works at this stage: the whole site, sign-in, the 94-check audit, the free and paid tiers, and the dashboard. Audit history is saved in each visitor's own browser.

## If Vercel blocks a deployment

Vercel's Hobby plan only builds commits whose author it recognises as the project owner. If a deployment shows "Deployment Blocked: the commit author did not have contributing access", the commit was authored under a different name or email.

Fix it by making sure the repository's git identity matches the GitHub account that owns the Vercel project:

```
git config --local user.name "seousingai-droid"
git config --local user.email "332692477+seousingai-droid@users.noreply.github.com"
```

That address is GitHub's private noreply form, `<id>+<username>@users.noreply.github.com`, so no personal email is ever published. Every commit made after that is deployable. A public repository also lifts the restriction, because the plan limit is on collaboration in private repositories.

## Stage 2: add Supabase (when one of these becomes true)

- A paying customer asks why their history is missing on their phone.
- You want to see who signed up without relying on a webhook.
- You want to email members, or stop a shared licence key.
- You have more than about 50 members and need to know what they use.

Until one of those is true, Supabase adds work and risk for no benefit.

### What Supabase would change

| Today | With Supabase |
|---|---|
| Sessions are a signed cookie | Supabase Auth, with email links or passwords |
| Emails only reach a webhook | A real table of members you can query |
| Audit history lives in one browser | History on the server, on every device |
| Licence keys are signed, never revocable | Keys in a table, revocable, one per customer |
| No usage data | Checks per member, popular problems, churn |

### The migration, in order

1. Create a Supabase project. Add `NEXT_PUBLIC_SUPABASE_URL` and the keys to Vercel.
2. Tables: `members` (email, plan, created), `licences` (key hash, member, revoked), `runs` (member, url, score, counts, checks as JSON), `done` (member, check key).
3. Turn on row level security so a member can only read their own rows. This is the step people skip and regret.
4. Replace the read and write pair in `src/lib/history.ts` with Supabase calls. The dashboard and the tool do not change: that was the point of putting them behind one small file.
5. Replace `src/lib/session.ts` with Supabase Auth, or keep the cookie and store only the data. Either works.
6. Offer existing members an import: the dashboard already exports their history as a file.

Budget: Supabase and Vercel both have free tiers that comfortably cover a few hundred members. Expect to pay when you pass that.

## What not to do

- Do not put `LICENSE_SECRET`, `AUTH_SECRET`, or any Supabase service key in the repository. They belong in Vercel's environment variables. `.env.local` is already ignored by git.
- Do not change a secret after launch unless you intend to sign everyone out and void every key.
- Do not wait for Supabase before launching. Nothing on this site can rank or sell while it only runs on your laptop.
