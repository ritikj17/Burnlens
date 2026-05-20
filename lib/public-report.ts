import type { AuditResult, PublicAuditReport } from "@/types/audit";

export function sanitizeAuditResult(result: AuditResult): AuditResult {
  return {
    ...result,
    input: {
      teamSize: result.input.teamSize,
      primaryUseCase: result.input.primaryUseCase,
      tools: result.input.tools
        .filter((tool) => tool.enabled && tool.monthlySpend > 0)
        .map((tool) => ({
          toolId: tool.toolId,
          planId: tool.planId,
          monthlySpend: tool.monthlySpend,
          seats: tool.seats,
          enabled: true
        }))
    }
  };
}

export function buildPublicAuditReport(params: {
  publicId: string;
  createdAt: string;
  result: AuditResult;
  aiSummary: string;
}): PublicAuditReport {
  return {
    publicId: params.publicId,
    createdAt: params.createdAt,
    teamSize: params.result.input.teamSize,
    primaryUseCase: params.result.input.primaryUseCase,
    result: sanitizeAuditResult(params.result),
    aiSummary: params.aiSummary
  };
}
