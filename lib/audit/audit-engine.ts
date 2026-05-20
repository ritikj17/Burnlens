import type {
  AuditInput,
  AuditResult,
  ConfidenceLevel,
  RecommendationCategory,
  SavingsLevel,
  ToolRecommendation,
  ToolSpendInput
} from "@/types/audit";
import { clamp } from "@/lib/utils";
import { getPlan, getPlanLabel, getToolPricing } from "@/lib/audit/pricing-data";
import {
  apiEfficiencySavingsRate,
  auditThresholds,
  chatAssistantPriorityByUseCase,
  codingAssistantPriority,
  isApiTool,
  isChatAssistant,
  isCodingTool,
  primaryIndividualPlanByTool,
  teamPlanByTool
} from "@/lib/audit/recommendation-rules";

function dollars(value: number) {
  return Math.max(0, Math.round(value));
}

function estimatePlanCost(tool: ToolSpendInput, targetPlanId: string, targetSeats = tool.seats) {
  const targetPlan = getPlan(tool.toolId, targetPlanId);
  if (!targetPlan || targetPlan.monthlyPerSeat === null) {
    return null;
  }

  const seatCount = Math.max(targetPlan.minSeats ?? 1, targetSeats);
  return dollars(targetPlan.monthlyPerSeat * seatCount);
}

function monthlyPlanCost(tool: ToolSpendInput) {
  const plan = getPlan(tool.toolId, tool.planId);
  if (!plan || plan.monthlyPerSeat === null) {
    return null;
  }

  return dollars(plan.monthlyPerSeat * Math.max(tool.seats, plan.minSeats ?? 1));
}

function buildRecommendation(params: {
  tool: ToolSpendInput;
  action: string;
  recommendedPlan?: string;
  savings: number;
  reasoning: string;
  confidence: ConfidenceLevel;
  category: RecommendationCategory;
}): ToolRecommendation {
  const toolPricing = getToolPricing(params.tool.toolId);
  return {
    toolId: params.tool.toolId,
    toolName: toolPricing.name,
    currentPlan: getPlanLabel(params.tool.toolId, params.tool.planId),
    currentMonthlySpend: dollars(params.tool.monthlySpend),
    currentSeats: params.tool.seats,
    recommendedAction: params.action,
    recommendedPlan: params.recommendedPlan,
    monthlySavings: dollars(params.savings),
    annualSavings: dollars(params.savings * 12),
    reasoning: params.reasoning,
    confidence: params.confidence,
    category: params.category
  };
}

function optimizedRecommendation(tool: ToolSpendInput): ToolRecommendation {
  return buildRecommendation({
    tool,
    action: "Keep current plan",
    savings: 0,
    reasoning: "Spend is close to published pricing and the selected plan appears proportionate to the submitted team size and use case.",
    confidence: "medium",
    category: "optimized"
  });
}

function betterOf(current: ToolRecommendation, candidate: ToolRecommendation) {
  if (candidate.monthlySavings > current.monthlySavings) {
    return candidate;
  }

  if (candidate.monthlySavings === current.monthlySavings && current.category === "optimized") {
    return candidate;
  }

  return current;
}

function evaluateSingleTool(tool: ToolSpendInput, input: AuditInput): ToolRecommendation {
  const plan = getPlan(tool.toolId, tool.planId);
  const spend = dollars(tool.monthlySpend);
  const seats = Math.max(1, Math.floor(tool.seats || 1));
  const teamSize = Math.max(1, Math.floor(input.teamSize || seats));
  const currentPlanCost = monthlyPlanCost({ ...tool, seats });
  let recommendation = optimizedRecommendation({ ...tool, monthlySpend: spend, seats });

  const individualPlanId = primaryIndividualPlanByTool[tool.toolId];
  const teamPlanId = teamPlanByTool[tool.toolId];

  if (individualPlanId && seats <= auditThresholds.singleUserTeamSeats && (plan?.minSeats || plan?.isEnterprise || tool.planId === teamPlanId)) {
    const targetCost = estimatePlanCost({ ...tool, seats }, individualPlanId, seats);
    if (targetCost !== null && spend > targetCost) {
      recommendation = betterOf(
        recommendation,
        buildRecommendation({
          tool: { ...tool, monthlySpend: spend, seats },
          action: "Downgrade the single active user to the individual plan",
          recommendedPlan: getPlanLabel(tool.toolId, individualPlanId),
          savings: spend - targetCost,
          reasoning: `${getPlanLabel(tool.toolId, tool.planId)} has collaboration or admin value, but one paid seat does not justify a team workspace. The individual plan covers the same solo workflow at about $${targetCost}/mo.`,
          confidence: "high",
          category: "downgrade"
        })
      );
    }
  }

  if (plan?.isEnterprise && teamPlanId && teamSize <= auditThresholds.enterpriseTeamSizeCeiling) {
    const targetSeats = Math.min(seats, teamSize);
    const targetCost = estimatePlanCost({ ...tool, seats }, teamPlanId, targetSeats);
    if (targetCost !== null && spend > targetCost) {
      recommendation = betterOf(
        recommendation,
        buildRecommendation({
          tool: { ...tool, monthlySpend: spend, seats },
          action: "Move from enterprise to the self-serve team tier until compliance needs mature",
          recommendedPlan: getPlanLabel(tool.toolId, teamPlanId),
          savings: spend - targetCost,
          reasoning: `A ${teamSize}-person startup is below the size where SCIM, custom legal terms, and account management usually justify enterprise overhead. The team tier covers centralized billing at roughly $${targetCost}/mo for the submitted seat count.`,
          confidence: "high",
          category: "enterprise-misuse"
        })
      );
    }
  }

  if (seats > teamSize && currentPlanCost !== null) {
    const excessSeats = seats - teamSize;
    const perSeat = currentPlanCost / seats;
    const savings = clamp(excessSeats * perSeat, 0, spend);
    if (savings >= 20) {
      recommendation = betterOf(
        recommendation,
        buildRecommendation({
          tool: { ...tool, monthlySpend: spend, seats },
          action: "Remove unused seats and align paid licenses to team size",
          recommendedPlan: getPlanLabel(tool.toolId, tool.planId),
          savings,
          reasoning: `The audit shows ${seats} paid seats for a ${teamSize}-person team. Even allowing for contractors, unused seats are the cleanest savings because they reduce spend without changing vendor or workflow.`,
          confidence: "high",
          category: "right-size"
        })
      );
    }
  }

  if (currentPlanCost !== null && spend > currentPlanCost * auditThresholds.overRetailMultiplier) {
    recommendation = betterOf(
      recommendation,
      buildRecommendation({
        tool: { ...tool, monthlySpend: spend, seats },
        action: "Audit add-ons, stale annual commitments, and over-retail billing",
        recommendedPlan: getPlanLabel(tool.toolId, tool.planId),
        savings: spend - currentPlanCost,
        reasoning: `Published pricing implies about $${currentPlanCost}/mo for this plan and seat count, while submitted spend is $${spend}/mo. The delta is likely add-ons, old pricing, excess credits, or inactive seats.`,
        confidence: "medium",
        category: "right-size"
      })
    );
  }

  if (isApiTool(tool.toolId, tool.planId) && spend >= 250) {
    const rate = apiEfficiencySavingsRate(tool.toolId, spend);
    const apiSavings = spend * rate;
    recommendation = betterOf(
      recommendation,
      buildRecommendation({
        tool: { ...tool, monthlySpend: spend, seats },
        action: "Add spend controls, batch non-urgent jobs, and route easy work to cheaper models",
        recommendedPlan: "Credits + model routing",
        savings: apiSavings,
        reasoning: `API spend above $250/mo usually has optimization room from caching, batch queues, model tiering, and prepaid credits. BurnLens models only ${Math.round(rate * 100)}% savings, leaving room for quality-critical traffic to stay on the current model.`,
        confidence: spend >= 1000 ? "high" : "medium",
        category: "api-efficiency"
      })
    );
  }

  if (tool.toolId === "gemini" && tool.planId === "ultra" && seats <= 3 && input.primaryUseCase !== "research") {
    const targetCost = estimatePlanCost({ ...tool, seats }, "pro", seats);
    if (targetCost !== null && spend > targetCost) {
      recommendation = betterOf(
        recommendation,
        buildRecommendation({
          tool: { ...tool, monthlySpend: spend, seats },
          action: "Downgrade Ultra seats to Google AI Pro unless Deep Think is a daily workflow",
          recommendedPlan: getPlanLabel("gemini", "pro"),
          savings: spend - targetCost,
          reasoning: "Ultra is priced for the highest usage limits. For a small team not primarily doing research-heavy work, Google AI Pro captures the Workspace and Gemini value at a much lower fixed cost.",
          confidence: "medium",
          category: "downgrade"
        })
      );
    }
  }

  if (tool.toolId === "claude" && tool.planId === "max" && seats > 1) {
    const targetCost = estimatePlanCost({ ...tool, seats }, "team", seats);
    if (targetCost !== null && spend > targetCost && input.primaryUseCase !== "coding") {
      recommendation = betterOf(
        recommendation,
        buildRecommendation({
          tool: { ...tool, monthlySpend: spend, seats },
          action: "Move most users from Max to Team Standard and reserve Max for one power user",
          recommendedPlan: getPlanLabel("claude", "team"),
          savings: Math.max(0, spend - targetCost),
          reasoning: "Max is excellent for heavy individual usage, but teams with mixed writing or research work usually get better governance and lower blended cost from standard Team seats.",
          confidence: "medium",
          category: "downgrade"
        })
      );
    }
  }

  return recommendation;
}

function applyDuplicateCodingRules(input: AuditInput, recommendations: ToolRecommendation[]) {
  if (input.primaryUseCase !== "coding" && input.primaryUseCase !== "mixed") {
    return recommendations;
  }

  const activeCodingTools = input.tools
    .filter((tool) => tool.enabled && tool.monthlySpend > 0 && isCodingTool(tool.toolId))
    .sort((a, b) => codingAssistantPriority.indexOf(a.toolId) - codingAssistantPriority.indexOf(b.toolId));

  if (activeCodingTools.length <= 1) {
    return recommendations;
  }

  const keeper = activeCodingTools[0]?.toolId;
  return recommendations.map((recommendation) => {
    const matchingTool = activeCodingTools.find((tool) => tool.toolId === recommendation.toolId);
    if (!matchingTool || matchingTool.toolId === keeper) {
      return recommendation;
    }

    const retainedSeats = Math.max(1, Math.ceil(matchingTool.seats * auditThresholds.duplicateAssistantSeatRetainedRatio));
    const plan = getPlan(matchingTool.toolId, matchingTool.planId);
    const retainedCost = plan?.monthlyPerSeat ? retainedSeats * plan.monthlyPerSeat : matchingTool.monthlySpend * 0.25;
    const savings = Math.max(0, matchingTool.monthlySpend - retainedCost);

    const candidate = buildRecommendation({
      tool: matchingTool,
      action: "Consolidate duplicate coding-assistant seats",
      recommendedPlan: `${retainedSeats} champion seat${retainedSeats === 1 ? "" : "s"}`,
      savings,
      reasoning: `The stack includes multiple paid coding assistants. Keep the primary editor assistant for the team and retain ${retainedSeats} ${getToolPricing(matchingTool.toolId).name} seat${retainedSeats === 1 ? "" : "s"} for comparison or specialist workflows instead of paying for everyone twice.`,
      confidence: "medium",
      category: "duplicate-tool"
    });

    return betterOf(recommendation, candidate);
  });
}

function applyDuplicateChatRules(input: AuditInput, recommendations: ToolRecommendation[]) {
  const activeChatTools = input.tools.filter(
    (tool) => tool.enabled && tool.monthlySpend > 0 && isChatAssistant(tool.toolId)
  );

  if (activeChatTools.length <= 1) {
    return recommendations;
  }

  const priority = chatAssistantPriorityByUseCase[input.primaryUseCase];
  const keeper = [...activeChatTools].sort((a, b) => priority.indexOf(a.toolId) - priority.indexOf(b.toolId))[0]?.toolId;

  return recommendations.map((recommendation) => {
    const matchingTool = activeChatTools.find((tool) => tool.toolId === recommendation.toolId);
    if (!matchingTool || matchingTool.toolId === keeper || matchingTool.planId === "api") {
      return recommendation;
    }

    const retainedSeats = Math.max(1, Math.ceil(matchingTool.seats * 0.35));
    const plan = getPlan(matchingTool.toolId, matchingTool.planId);
    const retainedCost = plan?.monthlyPerSeat ? retainedSeats * plan.monthlyPerSeat : matchingTool.monthlySpend * 0.35;
    const savings = Math.max(0, matchingTool.monthlySpend - retainedCost);

    const candidate = buildRecommendation({
      tool: matchingTool,
      action: "Trim duplicate general-assistant seats",
      recommendedPlan: `${retainedSeats} shared seat${retainedSeats === 1 ? "" : "s"}`,
      savings,
      reasoning: `For a ${input.primaryUseCase} use case, paying for multiple broad chat assistants across every seat creates overlapping value. Keep the best-fit assistant broadly deployed and retain a small pool for this tool where it is genuinely differentiated.`,
      confidence: "medium",
      category: "duplicate-tool"
    });

    return betterOf(recommendation, candidate);
  });
}

function getSavingsLevel(totalMonthlySavings: number): SavingsLevel {
  if (totalMonthlySavings >= auditThresholds.highSavingsMonthly) {
    return "high";
  }

  if (totalMonthlySavings >= auditThresholds.lowSavingsMonthly) {
    return "moderate";
  }

  if (totalMonthlySavings > 0) {
    return "low";
  }

  return "optimized";
}

export function auditStartupSpend(input: AuditInput): AuditResult {
  const normalizedInput: AuditInput = {
    teamSize: Math.max(1, Math.floor(input.teamSize || 1)),
    primaryUseCase: input.primaryUseCase,
    tools: input.tools.map((tool) => ({
      ...tool,
      monthlySpend: dollars(Number.isFinite(tool.monthlySpend) ? tool.monthlySpend : 0),
      seats: Math.max(1, Math.floor(Number.isFinite(tool.seats) ? tool.seats : 1)),
      enabled: Boolean(tool.enabled)
    }))
  };

  const activeTools = normalizedInput.tools.filter((tool) => tool.enabled && tool.monthlySpend > 0);
  const baseRecommendations = activeTools.map((tool) => evaluateSingleTool(tool, normalizedInput));
  const withCodingDuplicates = applyDuplicateCodingRules(normalizedInput, baseRecommendations);
  const recommendations = applyDuplicateChatRules(normalizedInput, withCodingDuplicates);

  const totalCurrentMonthlySpend = dollars(activeTools.reduce((sum, tool) => sum + tool.monthlySpend, 0));
  const totalMonthlySavings = dollars(recommendations.reduce((sum, recommendation) => sum + recommendation.monthlySavings, 0));
  const flaggedTools = recommendations.filter((recommendation) => recommendation.monthlySavings > 0).length;

  return {
    input: normalizedInput,
    recommendations,
    totalCurrentMonthlySpend,
    totalMonthlySavings,
    totalAnnualSavings: dollars(totalMonthlySavings * 12),
    savingsLevel: getSavingsLevel(totalMonthlySavings),
    optimizedTools: recommendations.length - flaggedTools,
    flaggedTools,
    generatedAt: new Date().toISOString()
  };
}

export function getCredexConsultationRecommended(result: AuditResult) {
  return result.totalMonthlySavings >= auditThresholds.highSavingsMonthly;
}
