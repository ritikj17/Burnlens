import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  CircleDollarSign,
  ShieldCheck
} from "lucide-react";

import { getCredexConsultationRecommended } from "@/lib/audit/audit-engine";
import { getCredexConsultationUrl } from "@/lib/env";
import { formatCurrency } from "@/lib/utils";
import type { PublicAuditReport } from "@/types/audit";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { LeadCaptureForm } from "@/components/lead-capture-form";
import { ShareButton } from "@/components/share-button";
import { PrintButton } from "@/components/print-button";

function ConfidenceBadge({ confidence }: { confidence: string }) {
  const variant =
    confidence === "high"
      ? "success"
      : confidence === "medium"
      ? "warning"
      : "muted";

  return (
    <Badge variant={variant}>
      {confidence} confidence estimate
    </Badge>
  );
}

export function ReportView({
  report,
  shareUrl
}: {
  report: PublicAuditReport;
  shareUrl: string;
}) {
  const result = report.result;

  const recommendCredex =
    getCredexConsultationRecommended(result);

  return (
    <main className="bg-background">
      <section className="soft-band border-b">
        <div className="container py-12 md:py-16">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Badge
                variant={
                  recommendCredex
                    ? "success"
                    : result.savingsLevel === "optimized"
                    ? "muted"
                    : "secondary"
                }
              >
                {recommendCredex
                  ? "Larger savings opportunity identified"
                  : result.savingsLevel === "optimized"
                  ? "Reasonably optimized setup"
                  : "Potential savings identified"}
              </Badge>

              <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-normal md:text-6xl">
                {formatCurrency(result.totalMonthlySavings)}

                <span className="block text-2xl text-muted-foreground md:text-3xl">
                  estimated monthly savings opportunity
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
                This audit estimates approximately{" "}
                {formatCurrency(result.totalAnnualSavings)} in yearly savings
                opportunities across {result.recommendations.length} tools for a{" "}
                {report.teamSize}-person {report.primaryUseCase} team.
              </p>
            </div>

            <div className="no-print flex flex-col gap-3 sm:flex-row">
              <ShareButton
                url={shareUrl}
                title="BurnLens audit report"
              />

              <PrintButton />
            </div>
          </div>
        </div>
      </section>

      <section className="container grid gap-8 py-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <CircleDollarSign className="size-5 text-primary" />

              <h2 className="text-xl font-semibold tracking-normal">
                Audit summary
              </h2>
            </div>

            <p className="mt-4 text-base leading-8 text-muted-foreground">
              {report.aiSummary}
            </p>
          </div>

          {recommendCredex ? (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold tracking-normal text-emerald-950">
                    Credex may be able to help reduce these costs
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-emerald-900">
                    For teams with larger AI budgets, procurement support,
                    pricing negotiations, or discounted credits may help reduce
                    overall spend further.
                  </p>
                </div>

                <Button asChild>
                  <a
                    href={getCredexConsultationUrl()}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Explore consultation options

                    <ArrowRight className="size-4" />
                  </a>
                </Button>
              </div>
            </div>
          ) : result.totalMonthlySavings < 100 ? (
            <div className="rounded-lg border bg-card p-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 size-5 text-primary" />

                <div>
                  <h2 className="text-xl font-semibold tracking-normal">
                    Your current setup already looks fairly reasonable.
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    The audit did not find many obvious savings opportunities.
                    In this case, monitoring pricing changes and usage growth is
                    probably more useful than aggressively changing tools or
                    plans.
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          <div>
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold tracking-normal">
                Tool-by-tool review
              </h2>

              <Badge variant="outline">
                {result.flaggedTools} possible issues
              </Badge>
            </div>

            <div className="space-y-4">
              {result.recommendations.map((recommendation) => (
                <Card
                  key={`${recommendation.toolId}-${recommendation.category}`}
                >
                  <CardContent className="p-5">
                    <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold tracking-normal">
                            {recommendation.toolName}
                          </h3>

                          <ConfidenceBadge
                            confidence={recommendation.confidence}
                          />
                        </div>

                        <p className="mt-2 text-sm text-muted-foreground">
                          {recommendation.currentPlan} ·{" "}
                          {recommendation.currentSeats} seat
                          {recommendation.currentSeats === 1 ? "" : "s"} ·{" "}
                          {formatCurrency(
                            recommendation.currentMonthlySpend
                          )}
                          /mo
                        </p>

                        <p className="mt-4 font-medium">
                          {recommendation.recommendedAction}
                        </p>

                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          {recommendation.reasoning}
                        </p>
                      </div>

                      <div className="shrink-0 rounded-lg border bg-muted/45 p-4 text-left md:w-48">
                        <span className="block text-xs uppercase tracking-[0.12em] text-muted-foreground">
                          Estimated savings
                        </span>

                        <strong className="mt-1 block text-2xl tracking-normal">
                          {formatCurrency(recommendation.monthlySavings)}
                        </strong>

                        <span className="text-sm text-muted-foreground">
                          per month
                        </span>

                        {recommendation.recommendedPlan ? (
                          <span className="mt-3 block text-xs text-muted-foreground">
                            Suggested plan:{" "}
                            {recommendation.recommendedPlan}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="size-5 text-primary" />

              <h2 className="text-xl font-semibold tracking-normal">
                Shared report privacy
              </h2>
            </div>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              This shared report removes identifying information like email
              addresses and company names. It only includes team size, tools,
              recommendations, and estimated savings details.
            </p>
          </div>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <Card>
            <CardContent className="grid gap-4 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Current spend
                </span>

                <strong>
                  {formatCurrency(result.totalCurrentMonthlySpend)}/mo
                </strong>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Estimated monthly savings
                </span>

                <strong>
                  {formatCurrency(result.totalMonthlySavings)}
                </strong>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Estimated annual savings
                </span>

                <strong>
                  {formatCurrency(result.totalAnnualSavings)}
                </strong>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Use case
                </span>

                <strong className="capitalize">
                  {report.primaryUseCase}
                </strong>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="size-4" />
                  Report generated
                </span>

                <strong>
                  {new Date(report.createdAt).toLocaleDateString("en-US")}
                </strong>
              </div>
            </CardContent>
          </Card>

          <LeadCaptureForm report={report} />

          <Button variant="ghost" asChild className="w-full">
            <Link href="/">
              Create another report
            </Link>
          </Button>
        </aside>
      </section>
    </main>
  );
}
