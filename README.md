# BurnLens

BurnLens is a lightweight AI spend audit tool for startups. It helps founders, engineering teams, and operations leads review whether they may be overspending on tools like Cursor, Claude, ChatGPT, Copilot, Gemini, Windsurf, and direct API usage.

The product generates deterministic savings recommendations using pricing assumptions and usage patterns, then creates a short AI-generated summary to explain the results in a more readable way.

**Live URL:** https://burnlens-taupe.vercel.app/

---

## Screenshots

### Landing Page

![Landing page](public/screenshots/landing.png)

### Audit Report

![High-savings report](public/screenshots/report-high-savings.png)

### Mobile Experience

![Mobile form](public/screenshots/mobile-form.png)
---

## Quick Start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open:

```txt
http://localhost:3000
```

Enter a sample AI tooling stack and generate an audit report.

Without Supabase configured, the app falls back to a temporary local preview mode. With Supabase enabled, generated audits receive persistent public report URLs.

---

## Deploy

1. Create a Supabase project and run:

```txt
docs/supabase-schema.sql
```

2. Add variables from `.env.example` to Vercel

3. Configure EmailJS for lightweight client-side email delivery

4. Deploy using the standard Next.js Vercel setup

Run checks before deployment:

```bash
npm run lint
npm test
npm run build
```

---

## Technical Decisions

### 1. Next.js App Router instead of a separate backend

The project benefits from server actions, public routes, metadata generation, and simple Vercel deployment without requiring a detached API server.

### 2. Deterministic audit engine instead of AI-generated savings logic

Pricing recommendations should stay explainable and reproducible, so the audit calculations live inside `lib/audit/audit-engine.ts`. AI is only used for the short summary text.

### 3. Supabase for persistence and shareable reports

The product does not require authentication, but lead capture and public report URLs still need a lightweight backend and durable storage layer.

### 4. Sanitized public report payloads

Email addresses and company details are removed before generating public report objects to avoid exposing private information through shared URLs.

### 5. Lightweight EmailJS integration for MVP delivery

EmailJS is used for simple client-side report delivery without requiring operational email infrastructure or domain configuration during the MVP phase.

### 6. Low-friction abuse protection

Lead capture happens after users already receive value from the audit, so a lightweight honeypot and IP-window approach felt more appropriate than introducing CAPTCHA flows early in the MVP.

---

## Local Scripts

- `npm run dev` → start the development server
- `npm run lint` → run ESLint
- `npm test` → run audit engine tests with Vitest
- `npm run build` → verify production build

---

## Environment Variables

```env
NEXT_PUBLIC_SITE_URL=

NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

ANTHROPIC_API_KEY=
ANTHROPIC_MODEL=

OPENAI_API_KEY=
OPENAI_MODEL=

NEXT_PUBLIC_EMAILJS_SERVICE_ID=
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=

CONSULTATION_URL=
```

---

## Local Preview Mode

If Supabase is not configured, BurnLens automatically falls back to a local preview report flow using browser localStorage. This keeps the product usable even during partial setup or offline development.

---

## Project Notes

This repository contains the complete BurnLens application, including the audit engine, report generation flow, pricing references, documentation, testing setup, and deployment configuration.

The project was built as a portfolio-grade SaaS application to demonstrate full-stack development, product thinking, deterministic recommendation systems, and cloud deployment workflows.