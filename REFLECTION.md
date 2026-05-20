# Reflection

> Draft reflection. Replace with your own specifics after the full 7-day submission period.

## 1. Hardest bug and debugging process

The hardest implementation bug in this session was designing the flow so the product still works when Supabase, Anthropic, OpenAI, or Resend are not configured locally, without weakening the production path. My first hypothesis was that a missing backend should simply block report creation. That would satisfy strict production behavior, but it would make local review brittle and hide the audit engine behind setup friction. I changed the flow so the server action recomputes the audit, attempts summary generation, attempts persistence, and returns a local-preview report if persistence fails. I then checked the boundaries: public URLs still require Supabase; local preview is explicitly marked and not indexable; lead capture still requires backend storage. The fix was less about syntax and more about making failure states product-shaped instead of crashing. What worked was treating every external provider as optional until production deployment, while keeping the deterministic audit result available.

## 2. Decision reversed mid-week

The biggest reversed decision was where to run the audit math. My first instinct was to compute everything client-side because the user gets instant feedback and the logic is not secret. But a public report URL needs trustworthy stored numbers, and a client-only result can be tampered with before saving. I reversed to a hybrid: the client computes a preview for responsiveness, while the server action validates the input and recomputes the final audit before storage. This keeps the UX fast without making Supabase a database of user-submitted claims. It also makes tests more meaningful because the server and client import the same pure `auditStartupSpend` function. If this became a real product, I would keep that pattern and add versioned rule IDs so a report can explain not only the recommendation but the exact rule version that produced it.

## 3. Week 2 roadmap

In week 2 I would build a benchmark layer and a procurement workflow. Benchmarking should answer “is $X per developer normal?” for company size and use case, not just “can this plan be cheaper?” The procurement workflow would let a high-savings lead mark which recommendations they want Credex to act on, upload an invoice, and book a consultation from the report page. I would also add a PDF export, because this is the kind of result a founder forwards to finance or a board observer. On the technical side, I would move AI summaries to an async job, add pricing snapshot versioning, create a small admin view for Credex to see qualified leads, and instrument funnel events: audit started, audit completed, lead captured, consultation clicked, and credit purchase attributed.

## 4. AI usage

AI was useful for brainstorming product angles, checking copy density, and pressure-testing whether audit reasoning sounded like finance rather than generic SaaS advice. I did not trust AI with pricing data or savings math. Those belong in official-source docs and deterministic TypeScript. A specific place AI can be wrong is treating “enterprise” as always wasteful. In reality, enterprise can be justified early if the startup has regulated customers, SSO/SCIM requirements, or contractual data controls. The audit rules therefore flag small-team enterprise usage with high confidence only when the submitted spend is materially above a self-serve team baseline, and the language says “until compliance needs mature” rather than “cancel enterprise.” That nuance matters because a founder will reject the whole report if one recommendation sounds reckless.

## 5. Self-rating

- **Discipline: 7/10** — The build covers the full MVP surface, but the real submission still needs genuine multi-day commits and interviews.
- **Code quality: 8/10** — The code is modular, typed, and testable, with the core engine isolated from UI and provider calls.
- **Design sense: 8/10** — The UI aims for a premium SaaS feel with clear hierarchy, restrained cards, and shareable report moments.
- **Problem-solving: 8/10** — The external-provider fallback path makes the MVP robust in local and production environments.
- **Entrepreneurial thinking: 7/10** — GTM and economics are specific, but real user interviews would sharpen the product more than another round of polish.
