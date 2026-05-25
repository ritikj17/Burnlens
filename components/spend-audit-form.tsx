"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2, RotateCcw, Sparkles } from "lucide-react";

import { createAuditAction } from "@/app/actions";
import { auditStartupSpend } from "@/lib/audit/audit-engine";
import { getDefaultPlanId, pricingCatalog } from "@/lib/audit/pricing-data";
import { fallbackSummary } from "@/lib/ai-summary";
import { buildPublicAuditReport } from "@/lib/public-report";
import { formatCurrency } from "@/lib/utils";
import type { AuditInput, PrimaryUseCase, PublicAuditReport, ToolId, ToolSpendInput } from "@/types/audit";
import { toolIds } from "@/types/audit";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

const storageKey = "burnlens:audit-form";
const reportStorageKey = "burnlens:last-report";

const defaultTools: ToolSpendInput[] = toolIds.map((toolId) => ({
  toolId,
  planId: getDefaultPlanId(toolId),
  monthlySpend: 0,
  seats: 1,
  enabled: toolId === "cursor" || toolId === "chatgpt"
}));

const defaultInput: AuditInput = {
  teamSize: 8,
  primaryUseCase: "coding",
  tools: defaultTools
};

function getToolInputLabel(toolId: ToolId) {
  return pricingCatalog[toolId].name;
}

export function SpendAuditForm() {
  const router = useRouter();
  const [input, setInput] = useState<AuditInput>(defaultInput);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) {
      return;
    }

    try {
      const parsed = JSON.parse(saved) as AuditInput;
      setInput({
        teamSize: parsed.teamSize || defaultInput.teamSize,
        primaryUseCase: parsed.primaryUseCase || defaultInput.primaryUseCase,
        tools: defaultTools.map((tool) => {
          const savedTool = parsed.tools?.find((candidate) => candidate.toolId === tool.toolId);
          return savedTool ? { ...tool, ...savedTool } : tool;
        })
      });
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(input));
  }, [input]);

  const activeTools = useMemo(() => input.tools.filter((tool) => tool.enabled && tool.monthlySpend > 0), [input.tools]);
  const preview = useMemo(() => auditStartupSpend(input), [input]);

  function updateTool(toolId: ToolId, patch: Partial<ToolSpendInput>) {
    setInput((current) => ({
      ...current,
      tools: current.tools.map((tool) => (tool.toolId === toolId ? { ...tool, ...patch } : tool))
    }));
  }

  function resetForm() {
    setInput(defaultInput);
    window.localStorage.removeItem(storageKey);
    setError(null);
  }

  function saveLocalReport(report: PublicAuditReport) {
    window.localStorage.setItem(reportStorageKey, JSON.stringify(report));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (activeTools.length === 0) {
      setError("Enter spend details for at least one enabled tool before generating the audit.");
      return;
    }

    startTransition(async () => {
      const localResult = auditStartupSpend(input);

      try {
        const response = await createAuditAction(input);

        if (response.ok) {
          router.push(`/report/${response.publicId}`);
          return;
        }

        if (response.fallbackReport) {
          saveLocalReport(response.fallbackReport);
          router.push("/report/local-preview");
          return;
        }

        const fallbackReport = buildPublicAuditReport({
          publicId: "local-preview",
          createdAt: new Date().toISOString(),
          result: localResult,
          aiSummary: fallbackSummary(localResult)
        });

        saveLocalReport(fallbackReport);
        setError(`${response.error} Showing a local preview instead.`);
        router.push("/report/local-preview");
      } catch {
        const fallbackReport = buildPublicAuditReport({
          publicId: "local-preview",
          createdAt: new Date().toISOString(),
          result: localResult,
          aiSummary: fallbackSummary(localResult)
        });

        saveLocalReport(fallbackReport);
        router.push("/report/local-preview");
      }
    });
  }

  return (
    <Card className="shadow-soft">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <Badge variant="outline">Free audit</Badge>

          <Button type="button" variant="ghost" size="sm" onClick={resetForm}>
            <RotateCcw className="size-4" />
            Reset
          </Button>
        </div>

        <CardTitle className="text-2xl tracking-normal">
          AI tooling overview
        </CardTitle>

        <p className="text-sm text-muted-foreground">
          Enter the tools, plans, and approximate monthly spend currently used by your team.
        </p>
      </CardHeader>

      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="team-size">Team size</Label>

              <Input
                id="team-size"
                type="number"
                min={1}
                value={input.teamSize}
                onChange={(event) =>
                  setInput((current) => ({
                    ...current,
                    teamSize: Number(event.target.value)
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="use-case">Primary use case</Label>

              <Select
                id="use-case"
                value={input.primaryUseCase}
                onChange={(event) =>
                  setInput((current) => ({
                    ...current,
                    primaryUseCase: event.target.value as PrimaryUseCase
                  }))
                }
              >
                <option value="coding">Coding</option>
                <option value="writing">Writing</option>
                <option value="data">Data</option>
                <option value="research">Research</option>
                <option value="mixed">Mixed</option>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            {input.tools.map((tool) => {
              const pricing = pricingCatalog[tool.toolId];

              return (
                <div key={tool.toolId} className="rounded-lg border bg-background p-4">
                  <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr_0.8fr_0.65fr]">
                    <label className="flex items-center gap-3">
                      <Checkbox
                        checked={tool.enabled}
                        onChange={(event) =>
                          updateTool(tool.toolId, {
                            enabled: event.currentTarget.checked
                          })
                        }
                        aria-label={`Enable ${getToolInputLabel(tool.toolId)}`}
                      />

                      <span>
                        <span className="block text-sm font-semibold">
                          {pricing.name}
                        </span>

                        <span className="text-xs text-muted-foreground capitalize">
                          {pricing.category} tool
                        </span>
                      </span>
                    </label>

                    <div className="space-y-2">
                      <Label htmlFor={`${tool.toolId}-plan`}>Plan</Label>

                      <Select
                        id={`${tool.toolId}-plan`}
                        value={tool.planId}
                        disabled={!tool.enabled}
                        onChange={(event) =>
                          updateTool(tool.toolId, {
                            planId: event.target.value
                          })
                        }
                      >
                        {pricing.plans.map((plan) => (
                          <option key={plan.id} value={plan.id}>
                            {plan.label}
                          </option>
                        ))}
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`${tool.toolId}-spend`}>
                        Monthly spend
                      </Label>

                      <Input
                        id={`${tool.toolId}-spend`}
                        type="number"
                        min={0}
                        inputMode="decimal"
                        placeholder="0"
                        value={tool.monthlySpend}
                        disabled={!tool.enabled}
                        onChange={(event) =>
                          updateTool(tool.toolId, {
                            monthlySpend: Number(event.target.value)
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`${tool.toolId}-seats`}>
                        Seats
                      </Label>

                      <Input
                        id={`${tool.toolId}-seats`}
                        type="number"
                        min={1}
                        placeholder="1"
                        value={tool.seats}
                        disabled={!tool.enabled}
                        onChange={(event) =>
                          updateTool(tool.toolId, {
                            seats: Number(event.target.value)
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {error ? (
            <div className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <span>{error}</span>
            </div>
          ) : null}

          <div className="grid gap-3 rounded-lg border bg-muted/45 p-4 text-sm sm:grid-cols-3">
            <div>
              <span className="block text-muted-foreground">
                Entered spend
              </span>

              <strong>
                {formatCurrency(preview.totalCurrentMonthlySpend)}
              </strong>
            </div>

            <div>
              <span className="block text-muted-foreground">
                Estimated savings opportunity
              </span>

              <strong>
                {formatCurrency(preview.totalMonthlySavings)}/mo
              </strong>
            </div>

            <div>
              <span className="block text-muted-foreground">
                Tools reviewed
              </span>

              <strong>{activeTools.length}</strong>
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={isPending}>
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Sparkles className="size-4" />
            )}

            {isPending ? "Preparing report..." : "Generate audit report"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
