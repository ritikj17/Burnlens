import type { AuditInput, AuditResult } from "@/types/audit";
import { formatCurrency } from "@/lib/utils";

const SYSTEM_PROMPT = `You are a finance-literate SaaS spend analyst for BurnLens by Credex.
Write one concise paragraph of about 100 words.
Be specific, quantified, and sober.
Do not invent tools, prices, compliance requirements, discounts, or facts that are not present in the audit.
If savings are low, say the stack already looks disciplined.
If savings are high, mention that Credex can help source discounted AI credits or plan alternatives.
No markdown.`;

export function buildSummaryPrompt(input: AuditInput, result: AuditResult) {
  const recommendationLines = result.recommendations
    .map(
      (recommendation) =>
        `- ${recommendation.toolName}: ${recommendation.currentPlan}, $${recommendation.currentMonthlySpend}/mo, ${recommendation.currentSeats} seats -> ${recommendation.recommendedAction}; estimated savings $${recommendation.monthlySavings}/mo; reason: ${recommendation.reasoning}`
    )
    .join("\n");

  return `Audit context:
Team size: ${input.teamSize}
Primary use case: ${input.primaryUseCase}
Current monthly AI spend: $${result.totalCurrentMonthlySpend}
Potential monthly savings: $${result.totalMonthlySavings}
Potential annual savings: $${result.totalAnnualSavings}
Savings level: ${result.savingsLevel}

Per-tool findings:
${recommendationLines}

Write the personalized summary now.`;
}

export function fallbackSummary(result: AuditResult) {
  if (result.totalMonthlySavings >= 500) {
    return `BurnLens found ${formatCurrency(result.totalMonthlySavings)} in credible monthly savings, or ${formatCurrency(result.totalAnnualSavings)} annually, mostly from plan fit, duplicate tooling, seat cleanup, or API spend controls. The recommendation is not to cut AI usage blindly; it is to keep the workflows that create leverage while moving avoidable retail spend into right-sized plans and credit-backed usage. This is a strong Credex consultation case because the savings are large enough to justify procurement help.`;
  }

  if (result.totalMonthlySavings > 0) {
    return `BurnLens found ${formatCurrency(result.totalMonthlySavings)} in monthly savings, or ${formatCurrency(result.totalAnnualSavings)} annually. The stack is not wildly inefficient, but a few plan and seat adjustments can trim recurring spend without disrupting the team. Start with the highest-confidence recommendations, then revisit API routing or vendor consolidation after one billing cycle.`;
  }

  return "BurnLens did not find material savings from the submitted stack. That is a good signal: seat counts, plan choices, and usage profile look disciplined relative to published pricing. The best next step is to keep monitoring new pricing changes and credit opportunities rather than forcing a downgrade that could slow the team down.";
}

async function callAnthropic(prompt: string) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return null;
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6",
      max_tokens: 180,
      temperature: 0.3,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`Anthropic summary failed with ${response.status}`);
  }

  const data = (await response.json()) as {
    content?: Array<{ type: string; text?: string }>;
  };

  return data.content?.find((part) => part.type === "text")?.text?.trim() || null;
}

async function callOpenAI(prompt: string) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-5-mini",
      input: [
        {
          role: "system",
          content: SYSTEM_PROMPT
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_output_tokens: 180
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI summary failed with ${response.status}`);
  }

  const data = (await response.json()) as {
    output_text?: string;
    output?: Array<{ content?: Array<{ text?: string }> }>;
  };

  return data.output_text?.trim() || data.output?.flatMap((item) => item.content ?? []).find((item) => item.text)?.text?.trim() || null;
}

export async function generatePersonalizedSummary(input: AuditInput, result: AuditResult) {
  const prompt = buildSummaryPrompt(input, result);

  try {
    const anthropicSummary = await callAnthropic(prompt);
    if (anthropicSummary) {
      return anthropicSummary;
    }
  } catch {
    // The fallback below keeps the report useful when provider quota or keys fail.
  }

  try {
    const openAiSummary = await callOpenAI(prompt);
    if (openAiSummary) {
      return openAiSummary;
    }
  } catch {
    // The deterministic fallback is intentionally finance-specific and non-empty.
  }

  return fallbackSummary(result);
}
