# BurnLens

BurnLens is a no-login AI spend audit for startup founders, CTOs, and finance operators who need to know whether their Cursor, Copilot, Claude, ChatGPT, Gemini, Windsurf, and API spend is creating leverage or leaking burn. It shows deterministic, finance-literate savings recommendations first, then uses an LLM only to write a concise personalized summary.

**Live URL:** add your Vercel URL after deployment.

## Screenshots

Capture these after deployment and commit them under `public/screenshots/`:

![Landing page](public/screenshots/landing.png)
![High-savings report](public/screenshots/report-high-savings.png)
![Mobile form](public/screenshots/mobile-form.png)

## Quick Start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`, enter a stack, and generate an audit. Without Supabase variables the app gracefully routes to `/report/local-preview`; with Supabase configured, every audit gets a persistent public URL.

## Deploy

1. Create a Supabase project and run `docs/supabase-schema.sql`.
2. Add the environment variables from `.env.example` to Vercel.
3. Configure Resend with a verified sending domain.
4. Deploy with Vercel’s Next.js preset.

```bash
npm run lint
npm test
npm run build
```

## Decisions

1. **Next.js App Router over a separate API server:** the product needs public pages, metadata, server actions, and Vercel deployment speed more than a detached backend.
2. **Deterministic audit engine:** finance recommendations must be explainable and reproducible, so `lib/audit/audit-engine.ts` owns the math while AI only writes the summary.
3. **Supabase service-role writes from server actions:** no login is required, but private lead writes still need a durable backend with simple operational setup.
4. **Public report payload is sanitized at write time:** email and company identity never enter the shareable object, reducing accidental leakage.
5. **Honeypot plus IP window instead of hCaptcha:** lead capture happens after value is shown, so the lowest-friction abuse protection is the right MVP trade-off.

## Local Scripts

- `npm run dev` - start the local app
- `npm run lint` - run ESLint
- `npm test` - run Vitest audit-engine tests
- `npm run build` - verify production build

## Submission Notes

The code, CI, schema, prompts, pricing sources, and business documents are in place. Before submitting to Credex, replace the marked interview/devlog placeholders with real daily work and real user conversations; the assignment explicitly checks both.
