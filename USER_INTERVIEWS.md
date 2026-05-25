# User Interviews

## Interview 1 : Early-stage SaaS Founder

- **Name / role / stage:** A.K. - Founder, 4-person B2B SaaS startup
- **Context:** The conversation focused on how the team started adopting AI tools informally over time instead of through a centralized purchasing decision.

### Direct quotes

> “At first everyone just bought their own subscriptions and expensed them later.”

> “We probably have overlap between ChatGPT, Claude, and Gemini, but nobody has had time to properly compare them.”

> “The funny thing is we try to save money everywhere except developer tooling.”

> “I don’t even know which plans are actively being used anymore.”

### Most surprising thing

The founder repeatedly described the company as “careful with spending” but also admitted that almost every engineer independently picked their own preferred AI stack without approval. AI tooling was treated differently from other SaaS purchases because the team viewed it as directly tied to productivity.

### What it changed in the product

This conversation made me avoid making the audit feel overly aggressive or judgmental. Instead of presenting recommendations as “you are wasting money,” the product now tries to separate justified expensive usage from obvious overlap or unused seats.

---

## Interview 2 : Engineering Manager Using Multiple Coding Assistants

- **Name / role / stage:** R.S. - Engineering Manager, ~15-person startup engineering team
- **Context:** Discussion focused on how the team uses Cursor, GitHub Copilot, and Claude together during active development work.

### Direct quotes

> “Different engineers swear by different tools, so standardizing completely is harder than it sounds.”

> “We tried reducing duplicate subscriptions once and people complained almost immediately.”

> “Honestly, some of these tools overlap a lot, but removing them completely hurts morale more than finance would expect.”

> “A few people heavily use Claude even though most of the team could probably work fine without it.”

### Most surprising thing

The manager acknowledged that there was definitely duplicate spend across coding assistants, but still resisted fully consolidating tools because experimentation and personal workflow preference mattered to the engineering culture.

### What it changed in the product

Originally, the audit logic aggressively consolidated duplicate coding assistants. After this conversation, I changed the recommendations so they preserve a smaller “champion seat” pool for secondary tools instead of recommending full cancellation across the entire team.

---

## Interview 3 : Startup Operations / API Spend

- **Name / role / stage:** N.M. - Operations lead at an AI-heavy services startup
- **Context:** The conversation focused on direct API spending and why optimization work often gets delayed.

### Direct quotes

> “We know the API bill is high, but nobody wants to be responsible for lowering model quality.”

> “Every time we try cheaper models, someone screenshots a bad output and the whole experiment gets abandoned.”

> “Caching and batching sound good in theory, but product teams usually prioritize shipping features first.”

> “Finance asks about the bill every month, but engineering still sees it as a growth expense.”

### Most surprising thing

The team was already aware that API costs were growing quickly, but optimization work kept getting postponed because nobody wanted to risk lower-quality outputs during active customer projects.

### What it changed in the product

This changed how API recommendations are framed inside the audit engine. Instead of suggesting broad model downgrades, the recommendations now focus more on routing low-priority requests, caching repeat tasks, batching background jobs, and using credits strategically without affecting critical user-facing workflows.

---

## Outreach Script

```text
Hey! quick favor? I’m building a free AI spend audit for startups as part of an application project and wanted to ask a few questions about your team’s AI tooling setup. Mainly curious about what feels worth paying for versus what feels duplicated or hard to track. Totally fine if you want anything anonymized.
