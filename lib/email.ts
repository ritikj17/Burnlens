import type { PublicAuditReport } from "@/types/audit";
import { getCredexConsultationUrl, getSiteUrl } from "@/lib/env";
import { formatCurrency } from "@/lib/utils";

export async function sendLeadConfirmationEmail(params: {
  email: string;
  companyName?: string;
  report: PublicAuditReport;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    return { skipped: true };
  }

  const reportUrl = `${getSiteUrl()}/report/${params.report.publicId}`;

  const highSavings =
    params.report.result.totalMonthlySavings >= 500;

  const subject = highSavings
    ? `Your BurnLens report estimates ${formatCurrency(
        params.report.result.totalMonthlySavings
      )}/mo in possible savings`
    : "Your BurnLens audit report is ready";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      from,
      to: params.email,
      subject,
      html: `
        <div style="font-family:Inter,Arial,sans-serif;line-height:1.6;color:#172033;max-width:640px;margin:0 auto;padding:24px">
          <h1 style="font-size:22px;margin:0 0 12px;font-weight:700">
            Your BurnLens report is ready
          </h1>

          <p style="margin:0 0 16px">
            Thanks${
              params.companyName ? `, ${params.companyName}` : ""
            }. Your AI tooling audit has been generated and can be viewed using the link below.
          </p>

          <p style="margin:0 0 18px">
            <a
              href="${reportUrl}"
              style="color:#047857;text-decoration:none;font-weight:600"
            >
              Open audit report
            </a>
          </p>

          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px;margin:0 0 18px">
            <p style="margin:0 0 8px;font-size:14px;color:#475569">
              Estimated monthly savings opportunity
            </p>

            <p style="margin:0;font-size:24px;font-weight:700;color:#172033">
              ${formatCurrency(
                params.report.result.totalMonthlySavings
              )}/mo
            </p>

            <p style="margin:8px 0 0;font-size:14px;color:#64748b">
              Approximately ${formatCurrency(
                params.report.result.totalAnnualSavings
              )} annually
            </p>
          </div>

          ${
            highSavings
              ? `
            <p style="margin:0 0 16px">
              The report identified a relatively large savings opportunity. Depending on your team's usage, it may be worth reviewing procurement options, pricing negotiations, or discounted infrastructure credits.
            </p>

            <p style="margin:0 0 18px">
              <a
                href="${getCredexConsultationUrl()}"
                style="color:#047857;text-decoration:none;font-weight:600"
              >
                View consultation options
              </a>
            </p>
          `
              : `
            <p style="margin:0 0 18px">
              The current setup already looks fairly reasonable based on the submitted usage and pricing assumptions. Monitoring future pricing changes or plan updates may still help over time.
            </p>
          `
          }

          <p style="margin:24px 0 0;font-size:13px;color:#64748b">
            This email was generated from a BurnLens audit request.
          </p>
        </div>
      `
    })
  });

  if (!response.ok) {
    throw new Error(`Resend failed with ${response.status}`);
  }

  return { skipped: false };
}
