import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LocalReportPage } from "@/components/local-report-page";
import { ReportView } from "@/components/report-view";
import { fetchPublicAudit } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/env";
import { formatCurrency } from "@/lib/utils";

interface ReportPageProps {
  params: Promise<{
    publicId: string;
  }>;
}

export async function generateMetadata({ params }: ReportPageProps): Promise<Metadata> {
  const { publicId } = await params;

  if (publicId === "local-preview") {
    return {
      title: "BurnLens Local Preview",
      robots: {
        index: false,
        follow: false
      }
    };
  }

  const report = await fetchPublicAudit(publicId);
  if (!report) {
    return {
      title: "Report not found"
    };
  }

  const title = `${formatCurrency(report.result.totalMonthlySavings)}/mo potential AI savings`;
  const description = `BurnLens reviewed a ${report.teamSize}-person ${report.primaryUseCase} team and estimated approximately ${formatCurrency(report.result.totalAnnualSavings)} in yearly AI tooling savings opportunities.`;
  const url = `${getSiteUrl()}/report/${publicId}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: "article",
      siteName: "BurnLens",
      images: [
        {
          url: `${getSiteUrl()}/og-image.png`,
          width: 1200,
          height: 630,
          alt: "BurnLens AI spend audit"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${getSiteUrl()}/og-image.png`]
    }
  };
}

export default async function ReportPage({ params }: ReportPageProps) {
  const { publicId } = await params;

  if (publicId === "local-preview") {
    return <LocalReportPage />;
  }

  const report = await fetchPublicAudit(publicId);
  if (!report) {
    notFound();
  }

  return <ReportView report={report} shareUrl={`${getSiteUrl()}/report/${publicId}`} />;
}
