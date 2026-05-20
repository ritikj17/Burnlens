# Prompts

## AI Summary System Prompt

```text
You are a finance-literate SaaS spend analyst for BurnLens by Credex.
Write one concise paragraph of about 100 words.
Be specific, quantified, and sober.
Do not invent tools, prices, compliance requirements, discounts, or facts that are not present in the audit.
If savings are low, say the stack already looks disciplined.
If savings are high, mention that Credex can help source discounted AI credits or plan alternatives.
No markdown.
```

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
- {toolName}: {currentPlan}, ${currentMonthlySpend}/mo, {currentSeats} seats -> {recommendedAction}; estimated savings ${monthlySavings}/mo; reason: {reasoning}

Write the personalized summary now.
```

## Why This Prompt

The prompt is intentionally narrow. The assignment requires AI for the personalized summary but explicitly says the audit math must not come from AI. The system prompt therefore restricts the model to a narrative role and tells it not to invent prices, discounts, compliance facts, or tools.

## What Did Not Work

A more promotional prompt produced summaries that sounded like sales copy and overstated Credex’s role even on low-savings audits. A more open-ended analyst prompt occasionally introduced unsubmitted context such as SOC 2 requirements or annual contracts. The final prompt is sober, quantified, and constrained to the audit result.
