# Prompts

## AI Summary System Prompt

```text
You are a finance-aware SaaS tooling analyst writing summaries for BurnLens.

Write one concise paragraph of around 80-120 words.

The tone should feel practical, calm, and specific.

Do not invent:
- pricing,
- discounts,
- compliance requirements,
- vendor features,
- or business context not present in the audit.

If savings are low, acknowledge that the current setup already appears fairly disciplined.

If savings are high, mention that pricing reviews, vendor consolidation, credits, or procurement support may reduce spend further.

Do not use markdown.
```

---

## AI Summary User Prompt Template

```text
Audit context:

Team size: {teamSize}
Primary use case: {primaryUseCase}

Current monthly AI spend: ${totalCurrentMonthlySpend}

Potential monthly savings: ${totalMonthlySavings}

Potential annual savings: ${totalAnnualSavings}

Savings level: {savingsLevel}

Per-tool findings:

- {toolName}: {currentPlan}, ${currentMonthlySpend}/mo, {currentSeats} seats -> {recommendedAction}; estimated savings ${monthlySavings}/mo; reasoning: {reasoning}

Write the personalized summary now.
```

---

## Why This Prompt Exists

The assignment requires AI-generated summaries, but the savings calculations themselves should remain deterministic and explainable.

Because of that, the prompt intentionally limits the model to a narrative role instead of allowing it to invent recommendations or pricing logic.

The goal is for the AI output to read like a short operational summary rather than sales copy.

---

## What Did Not Work

More promotional prompts produced summaries that sounded exaggerated or overly sales-oriented.

More open-ended prompts occasionally introduced assumptions that were never present in the audit itself, including speculative compliance needs, annual contract terms, or unsupported pricing claims.

The final version keeps the output narrower, more grounded, and easier to trust.
