import type { PrimaryUseCase, ToolId } from "@/types/audit";

export const auditThresholds = {
  highSavingsMonthly: 500,
  lowSavingsMonthly: 100,
  enterpriseTeamSizeCeiling: 25,
  singleUserTeamSeats: 1,
  overRetailMultiplier: 1.2,
  duplicateAssistantSeatRetainedRatio: 0.25
} as const;

export const primaryIndividualPlanByTool: Partial<Record<ToolId, string>> = {
  cursor: "pro",
  "github-copilot": "individual",
  claude: "pro",
  chatgpt: "plus",
  gemini: "pro",
  windsurf: "pro"
};

export const teamPlanByTool: Partial<Record<ToolId, string>> = {
  cursor: "business",
  "github-copilot": "business",
  claude: "team",
  chatgpt: "team",
  windsurf: "teams"
};

export const codingAssistantPriority: ToolId[] = ["cursor", "github-copilot", "windsurf"];

export const chatAssistantPriorityByUseCase: Record<PrimaryUseCase, ToolId[]> = {
  coding: ["claude", "chatgpt", "gemini"],
  writing: ["chatgpt", "claude", "gemini"],
  data: ["chatgpt", "gemini", "claude"],
  research: ["claude", "chatgpt", "gemini"],
  mixed: ["chatgpt", "claude", "gemini"]
};

export function apiEfficiencySavingsRate(toolId: ToolId, monthlySpend: number) {
  if (toolId === "anthropic-api") {
    return monthlySpend >= 1000 ? 0.28 : 0.18;
  }

  if (toolId === "openai-api") {
    return monthlySpend >= 1000 ? 0.25 : 0.16;
  }

  if (toolId === "gemini") {
    return monthlySpend >= 500 ? 0.18 : 0.12;
  }

  if (toolId === "chatgpt") {
    return monthlySpend >= 700 ? 0.16 : 0.1;
  }

  if (toolId === "claude") {
    return monthlySpend >= 700 ? 0.18 : 0.12;
  }

  return 0.12;
}

export function isCodingTool(toolId: ToolId) {
  return codingAssistantPriority.includes(toolId);
}

export function isChatAssistant(toolId: ToolId) {
  return toolId === "claude" || toolId === "chatgpt" || toolId === "gemini";
}

export function isApiTool(toolId: ToolId, planId?: string) {
  return toolId === "anthropic-api" || toolId === "openai-api" || planId === "api";
}
