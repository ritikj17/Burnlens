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
  const highSavings = params.report.result.totalMonthlySavings >= 500;
  const subject = highSavings
    ? `Your BurnLens audit found ${formatCurrency(params.report.result.totalMonthlySavings)}/mo in AI savings`
    : "Your BurnLens AI spend audit is ready";

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
        <div style="font-family:Inter,Arial,sans-serif;line-height:1.6;color:#172033">
          <h1 style="font-size:22px;margin:0 0 12px">Your BurnLens report</h1>
          <p>Thanks${params.companyName ? `, ${params.companyName}` : ""}. Your public AI spend audit is ready:</p>
          <p><a href="${reportUrl}" style="color:#047857">${reportUrl}</a></p>
          <p>Estimated savings: <strong>${formatCurrency(params.report.result.totalMonthlySavings)}/mo</strong> (${formatCurrency(params.report.result.totalAnnualSavings)}/yr).</p>
          ${
            highSavings
              ? `<p>This looks like a strong Credex fit. You can book a consultation here: <a href="${getCredexConsultationUrl()}" style="color:#047857">${getCredexConsultationUrl()}</a>.</p>`
              : "<p>Your stack is already fairly disciplined. We will keep an eye on pricing changes and credit opportunities that could apply later.</p>"
          }
        </div>
      `
    })
  });

  if (!response.ok) {
    throw new Error(`Resend failed with ${response.status}`);
  }

  return { skipped: false };
}
