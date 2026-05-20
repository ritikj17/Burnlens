"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import type { PublicAuditReport } from "@/types/audit";
import { ReportView } from "@/components/report-view";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const reportStorageKey = "burnlens:last-report";

export function LocalReportPage() {
  const [report, setReport] = useState<PublicAuditReport | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(reportStorageKey);
    if (saved) {
      try {
        setReport(JSON.parse(saved) as PublicAuditReport);
      } catch {
        window.localStorage.removeItem(reportStorageKey);
      }
    }
    setLoaded(true);
  }, []);

  if (!loaded) {
    return <div className="container py-16 text-muted-foreground">Loading local report...</div>;
  }

  if (!report) {
    return (
      <main className="container py-16">
        <Card className="mx-auto max-w-xl">
          <CardContent className="p-6">
            <h1 className="text-2xl font-semibold tracking-normal">No local report found</h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Run a new audit to generate a preview. Public report URLs require Supabase environment variables.
            </p>
            <Button asChild className="mt-5">
              <Link href="/">Start audit</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return <ReportView report={report} shareUrl={`${window.location.origin}/report/local-preview`} />;
}
