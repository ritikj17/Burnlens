import type { AuditInput, AuditResult } from "@/types/audit";
import { formatCurrency } from "@/lib/utils";

const SYSTEM_PROMPT = `You are writing a short audit summary for an AI tooling cost review.
Write one concise paragraph of about 80-120 words.
Keep the tone practical, calm, and realistic.
Do not exaggerate savings or sound promotional.
Do not invent tools, pricing, discounts, compliance requirements, or usage patterns that are not present in the audit.
If savings are low, clearly say the current setup already looks fairly reasonable.
If savings are higher, mention practical areas like duplicate tools, oversized plans, unused seats, or API optimization opportunities.
Avoid startup jargon and avoid sounding like marketing copy.
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
    return `BurnLens estimated approximately ${formatCurrency(result.totalMonthlySavings)} in possible monthly savings, or ${formatCurrency(result.totalAnnualSavings)} annually. Most of the opportunities come from overlapping tools, oversized plans, unused seats, or API usage patterns that may be more expensive than necessary. The recommendations are intended to reduce avoidable spend without forcing major workflow changes for the team. Because the estimated savings are relatively large, it may also be worth reviewing vendor pricing options or discounted infrastructure credits.`;
  }

  if (result.totalMonthlySavings > 0) {
    return `BurnLens estimated approximately ${formatCurrency(result.totalMonthlySavings)} in monthly savings opportunities, or ${formatCurrency(result.totalAnnualSavings)} annually. The current setup does not appear heavily inefficient, but there are a few areas where plan selection, seat counts, or overlapping tools may be creating unnecessary recurring costs. The simplest adjustments are probably the highest-confidence recommendations before making broader workflow or vendor changes.`;
  }

  return "BurnLens did not identify many obvious savings opportunities from the submitted stack. Based on the current pricing assumptions, the selected plans, seat counts, and tooling choices already look fairly reasonable for the reported usage. In this situation, monitoring future pricing changes or usage growth is probably more useful than aggressively changing tools or downgrading plans.";
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
      temperature: 0.2,
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

  return (
    data.content?.find((part) => part.type === "text")?.text?.trim() || null
  );
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
      max_output_tokens: 180,
      temperature: 0.2
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI summary failed with ${response.status}`);
  }

  const data = (await response.json()) as {
    output_text?: string;
    output?: Array<{ content?: Array<{ text?: string }> }>;
  };

  return (
    data.output_text?.trim() ||
    data.output
      ?.flatMap((item) => item.content ?? [])
      .find((item) => item.text)?.text?.trim() ||
    null
  );
}

export async function generatePersonalizedSummary(
  input: AuditInput,
  result: AuditResult
) {
  const prompt = buildSummaryPrompt(input, result);

  try {
    const anthropicSummary = await callAnthropic(prompt);

    if (anthropicSummary) {
      return anthropicSummary;
    }
  } catch {
    // Fallback below keeps the report usable if provider keys or quota fail.
  }

  try {
    const openAiSummary = await callOpenAI(prompt);

    if (openAiSummary) {
      return openAiSummary;
    }
  } catch {
    // Deterministic fallback keeps the report useful without AI providers.
  }

  return fallbackSummary(result);
}
