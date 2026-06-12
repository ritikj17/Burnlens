# BurnLens Implementation Guide

## Architecture

BurnLens is a Next.js 15 App Router app with server actions for audit creation and lead capture. The audit engine is pure TypeScript under `lib/audit`, Supabase stores audits/leads, Anthropic/OpenAI generate only the summary paragraph, and Resend sends transactional confirmations.

## Folder Structure

```text
app/                    Next.js routes, layout, server actions
components/             Product and shadcn-style UI components
components/ui/          Button, card, input, select, badge, skeleton primitives
lib/                    Shared utilities, AI, email, Supabase, audit logic
lib/audit/              pricing-data.ts, recommendation-rules.ts, audit-engine.ts
lib/supabase/           Server-side Supabase client and queries
types/                  Shared audit/report TypeScript models
hooks/                  Reserved for future client hooks
public/screenshots/     README screenshots
tests/                  Vitest coverage for the audit engine
docs/                   Supabase schema and implementation notes
.github/workflows/      CI pipeline
```

## Key Files

- `app/page.tsx` — landing page, hero copy, social proof, FAQ, and embedded audit form.
- `components/spend-audit-form.tsx` — persisted input form and create-audit flow.
- `app/report/[publicId]/page.tsx` — public report route with Open Graph/Twitter metadata.
- `components/report-view.tsx` — savings hero, recommendations, Burnlens Consultation, lead capture, print/share controls.
- `lib/audit/pricing-data.ts` — official pricing catalog used by the engine.
- `lib/audit/recommendation-rules.ts` — thresholds and rule constants.
- `lib/audit/audit-engine.ts` — deterministic savings calculations.
- `lib/ai-summary.ts` — Anthropic/OpenAI/fallback summary generation.
- `app/actions.ts` — server actions for creating audits and capturing leads.
- `docs/supabase-schema.sql` — database schema, indexes, and RLS policies.

## Environment Variables

```bash
NEXT_PUBLIC_SITE_URL=https://your-vercel-domain.vercel.app
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
ANTHROPIC_MODEL=claude-sonnet-4-6
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5-mini
RESEND_API_KEY=
RESEND_FROM_EMAIL=BurnLens <audit@yourdomain.com>
CONSULTATION_URL=https://docs.google.com/forms/d/e/1FAIpQLSdnoglk32ChxkZ7MI9heCZRxxnGjw1eGt6sF4Qrwz9f31ZjDA/viewform?usp=publish-editor
```

Anthropic is attempted first. OpenAI is the fallback. If both are missing or fail, the report still uses a deterministic finance summary.

## Supabase Setup

1. Create a Supabase project.
2. Open SQL Editor.
3. Run `docs/supabase-schema.sql`.
4. Copy the project URL into `NEXT_PUBLIC_SUPABASE_URL`.
5. Copy the service-role key into `SUPABASE_SERVICE_ROLE_KEY`.
6. Keep the service-role key server-only; never expose it in browser code.

## Vercel Deployment

1. Push the repo to GitHub.
2. Import the repo into Vercel.
3. Add all environment variables.
4. Use the default Next.js build command: `npm run build`.
5. After deployment, update `NEXT_PUBLIC_SITE_URL` to the live URL and redeploy.

## Local Commands

```bash
npm install
npm run dev
npm run lint
npm test
npm run build
```

## CI

`.github/workflows/ci.yml` runs on pushes and PRs to `main`:

- install dependencies
- lint
- test
- production build

## Testing

Vitest covers the audit engine in `tests/audit-engine.test.ts`, including downgrade detection, enterprise misuse, seat right-sizing, API optimization, duplicate-tool savings, and already-optimized stacks.
