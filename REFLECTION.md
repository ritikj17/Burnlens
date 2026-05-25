# Reflection

## 1. Hardest bug and debugging process

The hardest issue during development was handling missing backend services locally without breaking the entire app. Initially, I blocked report creation completely if Supabase or the AI provider keys were missing. Technically that worked, but it quickly became frustrating during development because even simple UI changes required a full backend setup before the app could be tested properly.

At first I assumed the issue was coming from the AI summary generation, but after checking logs and stepping through the server action manually, I realized the bigger problem was the report flow itself being too tightly coupled to external services. I changed the logic so the audit result is always generated first, then persistence and AI summaries are attempted afterward. If those fail, the app falls back to a local preview mode instead of crashing.

The tricky part was making sure local previews could not accidentally behave like real public reports. I added separate handling so saved reports still require Supabase, while temporary previews remain non-indexable and clearly marked in the UI. Most of the debugging ended up being less about syntax errors and more about separating “required for production” from “required for local development.”

## 2. Decision reversed mid-week

One decision I changed halfway through the build was where the audit calculations should run. My first approach was fully client-side because the recommendations are rule-based and the UI feels faster when results appear instantly. After implementing the shareable report flow though, I realized that relying only on client-side calculations would make it too easy to manipulate numbers before saving reports publicly.

I switched to a hybrid approach instead. The client still generates an instant preview for responsiveness, but the server recomputes the audit before anything gets stored or shared publicly. That ended up solving two problems at once: it keeps the experience fast while also making the stored reports more trustworthy.

This also simplified testing because the same `auditStartupSpend` function is now shared between the client preview and server validation paths. If I continued the project further, I would probably add versioned recommendation rules so older reports can still explain exactly which audit logic generated a recommendation.

## 3. Week 2 roadmap

If I had another week, the next thing I would build is benchmarking. Right now the product mainly answers “can this setup be cheaper?” but not “is this level of spend normal for a company this size?” I think founders would trust the audit more if they could compare their AI spend per developer against similar teams.

I would also improve the procurement side of the workflow. For example, after receiving recommendations, a team could directly select which tools they want help optimizing and send invoices or screenshots to Credex from inside the report page itself.

On the technical side, I would move AI summary generation into an async job instead of generating it inline during report creation. I would also add pricing snapshot versioning because SaaS pricing changes frequently and reports should ideally store the pricing assumptions used at the time they were generated.

The other feature I would prioritize is PDF export. This feels like the kind of report a founder would forward internally to finance or operations, so having a clean downloadable version would make the product feel much more complete.

## 4. AI usage

I used AI tools mainly for brainstorming UI ideas, checking copy tone, and speeding up repetitive implementation work. They were especially useful for scaffolding smaller components and helping reorganize TypeScript types during refactors.

I avoided relying on AI for the audit calculations themselves because pricing logic and savings recommendations need to stay deterministic and easy to verify. All pricing data was checked manually against official pricing pages before being added to the audit engine.

One place where AI suggestions were actively misleading was around enterprise plans. Several generated suggestions treated enterprise tiers as automatically wasteful for small teams. After thinking through real-world cases, that logic felt too aggressive because some startups genuinely need SSO, compliance controls, or procurement support early. I changed the recommendation rules so enterprise plans are flagged only when the pricing gap is large enough to justify the recommendation and the reasoning language stays more cautious.

## 5. Self-rating

- **Discipline: 7/10** - The MVP is complete and the core systems are working, but the project still needs stronger real-world testing and more consistent day-by-day iteration.
- **Code quality: 8/10** - The codebase is modular and reasonably maintainable, especially around the audit engine and shared types.
- **Design sense: 8/10** - I spent a lot of time trying to make the product feel closer to a modern SaaS tool instead of a college project or admin dashboard.
- **Problem-solving: 8/10** - The biggest improvements came from simplifying flows and handling failure states more carefully instead of continuously adding features.
- **Entrepreneurial thinking: 7/10** - The product direction and GTM ideas are reasonably strong, but talking to more real users would probably change several assumptions in the current version.
