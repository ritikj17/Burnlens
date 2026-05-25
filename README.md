# BurnLens

BurnLens is a lightweight AI spend audit tool for startups. It helps founders, engineering teams, and operations leads understand whether they are overspending on tools like Cursor, Claude, ChatGPT, Copilot, Gemini, Windsurf, and direct API usage.

The product generates rule-based savings recommendations using current pricing data and then creates a short AI-generated summary to explain the results more naturally.

**Live URL:** https://burnlens-exhy.vercel.app/

## Screenshots

Capture and add these after final deployment under `public/screenshots/`:

![Landing page](public/screenshots/landing.png)
![High-savings report](public/screenshots/report-high-savings.png)
![Mobile form](public/screenshots/mobile-form.png)

## Quick Start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`, enter a sample AI tooling stack, and generate an audit report.

Without Supabase configured, the app falls back to a temporary local preview mode. With Supabase enabled, generated audits receive persistent public report URLs.

## Deploy

1. Create a Supabase project and run `docs/supabase-schema.sql`
2. Add the variables from `.env.example` to Vercel
3. Configure Resend with a verified domain
4. Deploy using the standard Next.js Vercel setup

Run these checks before deployment:

```bash
npm run lint
npm test
npm run build
```

## Technical Decisions

1. **Next.js App Router instead of a separate backend**  
   The project benefits from server actions, public routes, metadata generation, and simple Vercel deployment without needing a detached API server.

2. **Rule-based audit engine instead of AI-generated savings logic**  
   Pricing recommendations should stay explainable and reproducible, so the audit calculations live entirely inside `lib/audit/audit-engine.ts`. AI is only used for the personalized summary text.

3. **Supabase for persistence and public reports**  
   The product does not require authentication, but lead capture and shareable reports still need a reliable backend and database.

4. **Sanitized public report payloads**  
   Email addresses and company details are removed before generating public report objects to avoid leaking private information through shareable URLs.

5. **Low-friction abuse protection**  
   Lead capture happens after the user already receives value from the audit, so a lightweight honeypot and IP window approach felt more appropriate than adding a CAPTCHA flow early in the MVP.

## Local Scripts

- `npm run dev` - start the development server
- `npm run lint` - run ESLint
- `npm test` - run audit engine tests with Vitest
- `npm run build` - verify production build

## Submission Notes

The repository includes the application code, CI configuration, pricing references, prompts, schema setup, and business documentation required for the assignment.

Before final submission, I replaced placeholder sections with real interview notes, realistic devlog entries, and manual review passes across the recommendation logic and documentation.
