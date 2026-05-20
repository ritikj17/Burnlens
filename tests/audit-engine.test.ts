import { describe, expect, it } from "vitest";

import { auditStartupSpend } from "@/lib/audit/audit-engine";
import type { AuditInput } from "@/types/audit";

function audit(input: Partial<AuditInput> & Pick<AuditInput, "tools">) {
  return auditStartupSpend({
    teamSize: input.teamSize ?? 5,
    primaryUseCase: input.primaryUseCase ?? "coding",
    tools: input.tools
  });
}

describe("auditStartupSpend", () => {
  it("downgrades a single-user team plan to an individual plan", () => {
    const result = audit({
      teamSize: 1,
      tools: [
        {
          toolId: "cursor",
          planId: "business",
          monthlySpend: 40,
          seats: 1,
          enabled: true
        }
      ]
    });

    expect(result.totalMonthlySavings).toBe(20);
    expect(result.recommendations[0]?.category).toBe("downgrade");
    expect(result.recommendations[0]?.recommendedPlan).toBe("Pro");
  });

  it("flags enterprise misuse for a small team on GitHub Copilot Enterprise", () => {
    const result = audit({
      teamSize: 4,
      tools: [
        {
          toolId: "github-copilot",
          planId: "enterprise",
          monthlySpend: 156,
          seats: 4,
          enabled: true
        }
      ]
    });

    expect(result.totalMonthlySavings).toBe(80);
    expect(result.recommendations[0]?.category).toBe("enterprise-misuse");
    expect(result.recommendations[0]?.reasoning).toContain("below the size");
  });

  it("right-sizes paid seats that exceed submitted team size", () => {
    const result = audit({
      teamSize: 4,
      primaryUseCase: "writing",
      tools: [
        {
          toolId: "chatgpt",
          planId: "team",
          monthlySpend: 250,
          seats: 10,
          enabled: true
        }
      ]
    });

    expect(result.totalMonthlySavings).toBe(150);
    expect(result.recommendations[0]?.category).toBe("right-size");
  });

  it("models API optimization savings without using AI for math", () => {
    const result = audit({
      teamSize: 12,
      primaryUseCase: "data",
      tools: [
        {
          toolId: "openai-api",
          planId: "standard",
          monthlySpend: 2000,
          seats: 1,
          enabled: true
        }
      ]
    });

    expect(result.totalMonthlySavings).toBe(500);
    expect(result.recommendations[0]?.category).toBe("api-efficiency");
    expect(result.recommendations[0]?.confidence).toBe("high");
  });

  it("detects duplicate coding assistant spend and keeps one primary tool broadly deployed", () => {
    const result = audit({
      teamSize: 5,
      primaryUseCase: "coding",
      tools: [
        {
          toolId: "cursor",
          planId: "business",
          monthlySpend: 200,
          seats: 5,
          enabled: true
        },
        {
          toolId: "github-copilot",
          planId: "business",
          monthlySpend: 95,
          seats: 5,
          enabled: true
        },
        {
          toolId: "windsurf",
          planId: "teams",
          monthlySpend: 200,
          seats: 5,
          enabled: true
        }
      ]
    });

    expect(result.totalMonthlySavings).toBe(177);
    expect(result.recommendations.filter((rec) => rec.category === "duplicate-tool")).toHaveLength(2);
  });

  it("does not manufacture savings for an already disciplined small stack", () => {
    const result = audit({
      teamSize: 2,
      primaryUseCase: "writing",
      tools: [
        {
          toolId: "chatgpt",
          planId: "plus",
          monthlySpend: 40,
          seats: 2,
          enabled: true
        }
      ]
    });

    expect(result.totalMonthlySavings).toBe(0);
    expect(result.savingsLevel).toBe("optimized");
    expect(result.recommendations[0]?.category).toBe("optimized");
  });
});
