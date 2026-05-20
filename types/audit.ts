export const toolIds = [
  "cursor",
  "github-copilot",
  "claude",
  "chatgpt",
  "anthropic-api",
  "openai-api",
  "gemini",
  "windsurf"
] as const;

export type ToolId = (typeof toolIds)[number];

export type PrimaryUseCase = "coding" | "writing" | "data" | "research" | "mixed";

export type ConfidenceLevel = "high" | "medium" | "low";

export type RecommendationCategory =
  | "downgrade"
  | "right-size"
  | "enterprise-misuse"
  | "vendor-alternative"
  | "credits"
  | "api-efficiency"
  | "duplicate-tool"
  | "optimized";

export type SavingsLevel = "high" | "moderate" | "low" | "optimized";

export interface ToolSpendInput {
  toolId: ToolId;
  planId: string;
  monthlySpend: number;
  seats: number;
  enabled: boolean;
}

export interface AuditInput {
  teamSize: number;
  primaryUseCase: PrimaryUseCase;
  tools: ToolSpendInput[];
}

export interface ToolRecommendation {
  toolId: ToolId;
  toolName: string;
  currentPlan: string;
  currentMonthlySpend: number;
  currentSeats: number;
  recommendedAction: string;
  recommendedPlan?: string;
  monthlySavings: number;
  annualSavings: number;
  reasoning: string;
  confidence: ConfidenceLevel;
  category: RecommendationCategory;
}

export interface AuditResult {
  input: AuditInput;
  recommendations: ToolRecommendation[];
  totalCurrentMonthlySpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  savingsLevel: SavingsLevel;
  optimizedTools: number;
  flaggedTools: number;
  generatedAt: string;
}

export interface PublicAuditReport {
  publicId: string;
  createdAt: string;
  teamSize: number;
  primaryUseCase: PrimaryUseCase;
  result: AuditResult;
  aiSummary: string;
}

export interface LeadCaptureInput {
  publicId: string;
  email: string;
  companyName?: string;
  role?: string;
  teamSize?: number;
  honeypot?: string;
}
